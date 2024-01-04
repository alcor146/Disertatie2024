import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  records: any = []
  xmlData: any = []
  filterTerm: string = "";
  page: any;
  count:number = 0;
  tableSize:number = 7;
  tableSizes:Array<number> = [3, 6, 9, 12];


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getClients()
  }

  getClients(){
    
    this.http.get('http://localhost:3001/api/clients/getClients') //apel catre backend pentrucontinutul fiesierului xml
    .subscribe((res) => {
      let jsonString = JSON.stringify(res)
      let jsonDB = JSON.parse(jsonString) //object-> json
      this.records = jsonDB.db.rentals.rental
      this.xmlData = jsonDB.db

    })
   
  }

  onTableDataChange(event: any){
    this.page = event;
    this.getClients();
  }  

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getClients();
  }  

  //simpla paginare in angular

  
  

}
