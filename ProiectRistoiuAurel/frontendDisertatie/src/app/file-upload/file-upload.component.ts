import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import {saveAs} from "file-saver";


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
  fileInfos?: Observable<any>;

  constructor(private uploadService: FileUploadService, private http: HttpClient) { }

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.upload();
  }

  download(record: any) {
    console.log(`da1`)
    this.http.get(`${this.baseUrl}/documents/${record.name}`,  { responseType: "blob" })
      .subscribe((blob ) => {
        console.log(`${this.baseUrl}/documents/${record.name}`)
        saveAs(blob, record.name);
      })
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
              this.ngOnInit()
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }

}
