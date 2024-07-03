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

  public isVisible: boolean = false;
  shareFile: boolean = false;
  denyFile: boolean = false;
  deleteFile: boolean = false;
  shareFileMessage: string = "Shared access to file";
  denyFileMessage: string = "Denied access to file";
  deleteFileMessage: string = "File deleted";

  constructor(private uploadService: FileUploadService, private http: HttpClient, private metamaskService: MetamaskService, private dialogService: DialogServiceShareFileService) { }

  onVersionChange(record: any) {
    
    this.currentVersion = record.selectedTimestamp;
    console.log("new version: ", this.currentVersion)
    // Do something when the version changes
  }

  showAlert() : void {
    if (this.isVisible) { // if the alert is visible return
      return;
    } 
    this.isVisible = true;
    setTimeout(()=> {
      this.isVisible = false
      if(this.shareFile == true)
        this.shareFile = false
      else if(this.denyFile == true)
        this.denyFile = false;
      else if(this.deleteFile == true)
        this.deleteFile = false;
      
    },6000); // hide the alert after 2.5s
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
        console.log("this.currentAccount: ", this.currentAccount)
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
        this.deleteFile = true
        this.showAlert()
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
                  this.shareFile = true
                  this.showAlert()
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
                  this.denyFile = true
                  this.showAlert()
                })
        };
    });
  }

}
