import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse, HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import {saveAs} from "file-saver";
import { MetamaskService } from '../services/metamask.service';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit  {

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  private baseUrl = 'http://localhost:3001/api';
  fileInfos: any[] = [];
  currentAccount: string = '';

  constructor(private uploadService: FileUploadService, private http: HttpClient, private metamaskService: MetamaskService) { }

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
            console.log("res: ", res)
            let jsonString = JSON.stringify(res);
            let jsonDB = JSON.parse(jsonString);
            this.fileInfos = res.data;
            console.log(this.fileInfos)
            console.log("acc: ", this.currentAccount)
          })
      }
    )
  }


  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.upload();
  }

  download(record: any) {
    console.log(`da1`)

    const headers = new HttpHeaders({
      'currentAccount': this.currentAccount
    });

    this.http.get(`${this.baseUrl}/documents/${record.name}`,  { headers, responseType: "blob" })
      .subscribe((blob ) => {
        console.log(`${this.baseUrl}/documents/${record.name}`)
        saveAs(blob, record.name);
      })
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

  // async someFunction() {
  //   try {
  //     const response = await this.uploadService.uploadFile(myFile);
  //     // File has reached the backend, handle the response
  //     console.log(response);
  //   } catch (error) {
  //     // Handle errors
  //     console.error(error);
  //   }
  // }

}
