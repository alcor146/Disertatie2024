import { Component, OnInit } from '@angular/core';
import { MetamaskService } from '../services/metamask.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentAccount: string = '';
  admin = '0x568f2D6eB23cbF65D56cC004f9CDB26AEfbCf244'

  constructor(private metamaskService: MetamaskService, private router: Router) { }

  ngOnInit(): void {
    this.metamaskService.getCurrentAccount().then(
      (res: any) => {
        this.currentAccount = res
        console.log(this.currentAccount)
        // if(this.currentAccount != this.admin && this.router.url.includes("files")){
        //   this.router.navigate(["/upload"])
        // }
        
    })
  }

}
