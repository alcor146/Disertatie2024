import { describe, expect, it, test } from '@jest/globals';
import frisby from 'frisby';
import axios from 'axios';

let account = '0x568f2D6eB23cbF65D56cC004f9CDB26AEfbCf244'
let baseUrl = "http://localhost:3001/api"

describe("Test suite", () => {

    it('should upload a file and store its shares on IPFS', async () => {
        const headers =  {
            'filename': 'accounts.txt',
            'currentaccount': account
          };
        const data = {}; // Replace with actual data if needed  
        const response = await axios.post(`${baseUrl}/upload/test`, data, { 
            headers,
            timeout: 10000 // 10 seconds timeout
        });
        console.log("test1: ", response)
        expect(response.data.success).toBe(true);
    });

    it('should get files from owner', async () => {
        const headers =  {
            'currentAccount': account
          };
        const response = await axios.get(`${baseUrl}/files`, { headers });
        console.log("test2: ", response.data.data, response.data.data.length)
        expect(response.data.data.length).toBeGreaterThan(0);
    });
});

