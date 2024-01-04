import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent {
  records: any = []



  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getClients()
  }

  openCreateDialog(){
  
    console.log("buton")
    // this.http.post(`http://localhost:3001/api/clients`, body)
    // .subscribe((res) =>{
    //   console.log(res)
    //   this.getClients()
    // })

      
  }

  getClients(){
    
    this.http.get('http://localhost:3001/api/rentals/getRentals') //analog componentei pentru xml
    .subscribe((res) => {
      let result = JSON.parse(JSON.stringify(res))
      this.records = result.data.rentals.rental
      console.log(this.records)
    })
   
  }


}
