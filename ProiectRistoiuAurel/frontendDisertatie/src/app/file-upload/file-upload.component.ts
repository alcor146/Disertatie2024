import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse, HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import {saveAs} from "file-saver";
import { MetamaskService } from '../services/metamask.service';
import { DialogServiceShareFileService } from '../services/dialog.service.share-file.service';



@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit  {

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  private baseUrl = 'http://localhost:3001/api';
  fileInfos: any[] = [];
  currentAccount: string = '';
  currentVersion: string = '';
  admin = '0x568f2D6eB23cbF65D56cC004f9CDB26AEfbCf244'

  constructor(private uploadService: FileUploadService, private http: HttpClient, private metamaskService: MetamaskService, private dialogService: DialogServiceShareFileService) { }

  onVersionChange(record: any) {
    
    this.currentVersion = record.selectedTimestamp;
    console.log("new version: ", this.currentVersion)
    // Do something when the version changes
  }

  ngOnInit(): void {
    this.showFiles()
  }

  showFiles() {
    this.metamaskService.getCurrentAccount().then(
      (res: any) => {
        this.currentAccount = res
        const headers =  {
          'currentAccount': this.currentAccount
        };
        this.http.get('http://localhost:3001/api/files', {headers})
          .subscribe(async (res: any) => {
            //console.log("res: ", res)
            let jsonString = JSON.stringify(res);
            let jsonDB = JSON.parse(jsonString);
            this.fileInfos = res.data;
            console.log("FILEINFOS:", this.fileInfos)
            console.log("acc: ", this.currentAccount)
          })
      })
  }

  createAccount() {
    
    this.dialogService.shareDialog({
      account : "",
      confirmText: "Create"
    }).subscribe( ( result ) => {  
        console.log(result)
        let newAccount = JSON.parse(JSON.stringify(result))
        if(newAccount.confirmText.toString() == "Create"){   
              console.log("account created");
              let body = {
                account : newAccount.account,
                currentAccount: this.currentAccount
              }
              this.http.post(`${this.baseUrl}/accounts/create`, {body})
                .subscribe((res ) => {
                  console.log("res2: ", res)
                })
        };
    });
  }

  deleteAccount() {
    
    this.dialogService.shareDialog({
      account : "",
      confirmText: "Delete"
    }).subscribe( ( result ) => {  
        console.log(result)
        let newAccount = JSON.parse(JSON.stringify(result))
        if(newAccount.confirmText.toString() == "Delete"){   
              console.log("account deleted");
              let body = {
                account : newAccount.account,
                currentAccount: this.currentAccount
              }
              this.http.post(`${this.baseUrl}/accounts/delete`, {body})
                .subscribe((res ) => {
                  console.log("res2: ", res)
                })
        };
    });
  }


  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.upload();
  }

  download(record: any) {
    console.log(`da1`)

    const headers = new HttpHeaders({
      'currentAccount': this.currentAccount,
      'currentVersion': record.selectedTimestamp
    });

    this.http.get(`${this.baseUrl}/documents/${record.name}`,  { headers, responseType: "blob" })
      .subscribe((blob ) => {
        console.log(`${this.baseUrl}/documents/${record.name}`)
        saveAs(blob, record.name);
      })
      
  }

  async upload() {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        const response = await this.uploadService.uploadFile(this.currentFile, this.currentAccount)
        this.showFiles()
      }

      this.selectedFiles = undefined;
    }
  }

  delete(record: any) {
    let body = {
      name : record.name,
      currentAccount: this.currentAccount
    }
    console.log("body: " ,body)
    this.http.delete(`${this.baseUrl}/documents`, {body})
      .subscribe((res ) => {
        console.log("res2: ", res)
        this.showFiles()
      })
  }

  share(record: any) {
    
    this.dialogService.shareDialog({
      account : "",
      confirmText: "Share"
    }).subscribe( ( result ) => {  
        console.log(result)
        let shareFile = JSON.parse(JSON.stringify(result))
        if(shareFile.confirmText.toString() == "Share"){   
              console.log("record shared");
              let body = {
                name : record.name,
                currentAccount: this.currentAccount,
                account : shareFile.account
              }
              this.http.post(`${this.baseUrl}/documents/share`, {body})
                .subscribe((res ) => {
                  console.log("res2: ", res)
                })
        };
    });
  }

  deny(record: any) {
    
    this.dialogService.shareDialog({
      account : "",
      confirmText: "Confirm"
    }).subscribe( ( result ) => {  
        console.log(result)
        let denyAccess = JSON.parse(JSON.stringify(result))
        if(denyAccess.confirmText.toString() == "Confirm"){   
              console.log("record denied access");
              let body = {
                name : record.name,
                currentAccount: this.currentAccount,
                account : denyAccess.account
              }
              this.http.post(`${this.baseUrl}/documents/deny`, {body})
                .subscribe((res ) => {
                  console.log("res2: ", res)
                })
        };
    });
  }

}
