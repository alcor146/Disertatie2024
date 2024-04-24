// metamask.service.ts

import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  private provider: any;

  constructor() { // Inject HttpClient
    this.initializeMetamask();
  }

  private async initializeMetamask() {
    if (window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum)
      await window.ethereum.enable();
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        // Time to reload your interface with accounts[0]!
        console.log(accounts[0]);
      });
    } else {
      console.warn("Metamask not found");
    }
  }

  async getCurrentAccount(): Promise<string> {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts[0];
    } catch (error) {
      console.error('Error fetching account: ', error);
      return '';
    }
  }
}
