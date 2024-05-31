import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse, HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import {saveAs} from "file-saver";
import { MetamaskService } from '../services/metamask.service';
import { DialogServiceShareFileService } from '../services/dialog.service.share-file.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent {
  records: any = []
  message = '';
  private baseUrl = 'http://localhost:3001/api';
  accountInfos: any[] = [];
  currentAccount: string = '';
  admin = '0x568f2D6eB23cbF65D56cC004f9CDB26AEfbCf244'

  public isVisible: boolean = false;
  getPrivateKey: boolean = false;
  accountExists: boolean = false;
  privateKey: string = "";
  errorMessage: string = "";




  constructor(private http: HttpClient, private metamaskService: MetamaskService, private dialogService: DialogServiceShareFileService) { }

  ngOnInit(): void {
    this.getAccounts()
  }

  showAlert() : void {
    if (this.isVisible) { // if the alert is visible return
      return;
    } 
    this.isVisible = true;
    setTimeout(()=> {
      this.isVisible = false
      if(this.getPrivateKey == true)
        this.getPrivateKey = false
      else if(this.accountExists == true)
        this.accountExists = false;
      
    },6000); // hide the alert after 2.5s
  }

  getAccounts(){
    this.metamaskService.getCurrentAccount().then(
      (res: any) => {
        this.currentAccount = res
        const headers =  {
          'currentAccount': this.currentAccount
        };
          let body = {
            currentAccount: this.currentAccount
          }

          this.http.post(`${this.baseUrl}/accounts/list`, {body})
            .subscribe((res ) => {
              let jsonString = JSON.stringify(res);
              let jsonDB = JSON.parse(jsonString);
              console.log(jsonDB);
              this.accountInfos = jsonDB.accounts;
              console.log("this.accountInfos: ", this.accountInfos)
              console.log("this.currentAccount",this.currentAccount)
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
                  let jsonString = JSON.stringify(res);
                  let jsonDB = JSON.parse(jsonString);
                  console.log("RESPONSE: ", jsonDB);
                  this.getAccounts()
                  if(jsonDB.success == true){
                    this.privateKey = jsonDB.key
                    this.getPrivateKey = true
                    this.showAlert()
                  } else{
                    this.errorMessage = jsonDB.message
                    this.accountExists = true
                    this.showAlert()
                  }
                })
        };
    });
  }

  deleteAccount(account: any) {
    
    
    console.log("account deleted");
    let body = {
      account : account.name,
      currentAccount: this.currentAccount
    }
    this.http.post(`${this.baseUrl}/accounts/delete`, {body})
      .subscribe((res ) => {
        console.log("res2: ", res)
        this.getAccounts()
      })
      
    
  }


}
