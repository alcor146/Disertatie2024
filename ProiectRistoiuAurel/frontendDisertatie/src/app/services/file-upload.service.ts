import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  async uploadAndProcessFile(file: File): Promise<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.http.post<any>(`${this.baseUrl}/upload`, formData, {
        responseType: 'json', // Specify the expected response type
      }).toPromise();

      // Handle the JSON response from the server
      console.log(response);

      // Additional actions after file processing...

      return response;
    } catch (error) {
      // Handle errors
      console.error(error);
      throw error;
    }
  }

  async uploadFile(file: File): Promise<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'fileName': file.name
    });
  
    try {
      const response = await this.http.post<any>(`${this.baseUrl}/upload`, formData, {headers}).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
