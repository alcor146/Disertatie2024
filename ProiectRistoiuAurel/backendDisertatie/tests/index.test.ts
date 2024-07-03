import { describe, expect, it, test, jest, beforeAll } from '@jest/globals';
import frisby from 'frisby';
import axios from 'axios';

const instance = axios.create({timeout: 100000});
jest.setTimeout(100000)

let admin = '0x568f2D6eB23cbF65D56cC004f9CDB26AEfbCf244'
let user1 = '0xB933e866bB3F1601CE55ABDcd7E26362EE8C2e85'
let user2 = '0x510F0A55f962EB67dAa8a20553fa897157466f9F'
let baseUrl = "http://localhost:3001/api"

//let fileNameT = "Etica_Ristoiu_George-Aurel_MPI.docx"
//let fileNameT = "ReferatTest.pdf"
//let fileNameT = "accounts.txt"
//let fileNameT = "Ethereum Blockchain1.pptx"
//let fileNameT = "Etica_Ristoiu_George-Aurel_MPI_1mb.docx"
let fileNameT = "test.txt"

describe("Test suite", () => {

  // beforeAll(async () => {
  //   const headers =  {
  //     'filename': 'ReferatTest.pdf',
  //     'currentaccount': admin
  //   };
  // const data = {}; // Replace with actual data if needed  
  // const response = await instance.post(`${baseUrl}/upload/test`, data, { 
  //     headers
      
  // }).then(response => {
  //     //console.log("test1: ", response)
  //     expect(response.data.success).toBe(true);
  //   })
  //   .catch(error => {
  //     //console.log("test1: ", error)
  //     expect(error).toBe(true);
  //   });
  // });

  


    it('2) should upload a file and store its shares on IPFS', async () => {
        let start = Date.now();
        const headers =  {
            'filename': fileNameT,
            'currentaccount': admin
          };
        const data = {}; // Replace with actual data if needed  
        const response = await instance.post(`${baseUrl}/upload/test`, data, { 
            headers
            
        }).then(response => {
            //console.log("test1: ", response)
            let timeTaken = Date.now() - start;
            console.log("Total time taken : " + timeTaken+ " milliseconds");
            expect(response.data.success).toBe(true);
            
          })
    });

    it('22) should  retrieve existent file', async () => {
      console.log("\n");
      let start = Date.now();
  
      let filename = fileNameT
  
      const headers = {
        'currentaccount': admin,
      };
  
      // this.http.get(`${this.baseUrl}/documents/${record.name}`,  { headers, responseType: "blob" })
      //   .subscribe((blob ) => {
      //     console.log(`${this.baseUrl}/documents/${record.name}`)
      //     saveAs(blob, record.name);
      //   })
      const response = await instance.post(`${baseUrl}/download/test/${filename}`, {}, {headers});
      console.log("test11: ", response.status)
  
      let timeTaken = Date.now() - start;
      console.log("Total time taken : " + timeTaken+ " milliseconds");
  
      expect(response.status).toBe(200);
    });

    it('8) should get files from owner', async () => {
      let start = Date.now();
        const headers =  {
            'currentAccount': admin
          };
        const response = await instance.get(`${baseUrl}/files`, { headers });
        //console.log("test2: ", response.data.data, response.data.data.length)
  
        let timeTaken = Date.now() - start;
            console.log("Total time taken : " + timeTaken+ " milliseconds");
  
  
        expect(response.data.data.length).toBeGreaterThan(0);
    });

    
    it('4) should share access to a file', async () => {
      let start = Date.now();
      const headers =  {
          'currentAccount': user1
        };
      const body = {
            "name": fileNameT,
            "account": user1,
            "currentAccount": admin 
      };
      const response = await instance.post(`${baseUrl}/documents/share`, {body});
      const response1 = await instance.get(`${baseUrl}/files`, { headers });
      console.log("test31: ", response1.data.data)

      let timeTaken = Date.now() - start;
            console.log("Total time taken : " + timeTaken+ " milliseconds");

            
      expect(response1.data.data.length).toBeGreaterThan(0);
  });

  it('20) should revoke access to shared file', async () => {
    let start = Date.now();

    const body = {
          "name": fileNameT,
          "currentAccount": admin,
          "account": user1
    };
    const response = await instance.post(`${baseUrl}/documents/deny`, {body});
    console.log("test20: ", response.status)

    let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken+ " milliseconds");


    expect(response.status).toBe(200);
  });

  it('14) should not allow sharing access to non-existent file', async () => {
    let start = Date.now();
          
    const body = {
          "name": "nonexistents",
          "account": user1,
          "currentAccount": admin 
    };
    const response = await instance.post(`${baseUrl}/documents/share`, {body});
    console.log("test14: ", response.status)

    let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken+ " milliseconds");

    expect(response.status).toBe(201);
    
});

    it('5) should not allow non-owner to share access', async () => {
      let start = Date.now();
      const headers =  {
          'currentAccount': user1
        };
      const body = {
            "name": fileNameT,
            "account": user1,
            "currentAccount": user2 
      };
      const response = await instance.post(`${baseUrl}/documents/share`, {body});
      console.log("test5: ", response.status)

      let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken+ " milliseconds");


      expect(response.status).toBe(201);
  });

  it('6) should not allow non-owner to remove a file', async () => {
    let start = Date.now();
    const body = {
          "name": fileNameT,
          "currentAccount": user2 
    };
    const response = await instance.delete(`${baseUrl}/documents`,{
      data: body
    });
    console.log("test6: ", response.status)

    let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken+ " milliseconds");

    
    expect(response.status).toBe(201);
  });

  it('7) should allow owner to remove a file', async () => {
    let start = Date.now();
    const body = {
          "name": fileNameT,
          "currentAccount": admin 
    };
    const response = await instance.delete(`${baseUrl}/documents`,{
      data: body
    });
    console.log("test7: ", response.status)

    let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken+ " milliseconds");

    expect(response.status).toBe(200);
  });

  it('9) should not retrieve files for non-owner', async () => {
    let start = Date.now();
    const headers =  {
      'currentAccount': user2
    };
  const response = await instance.get(`${baseUrl}/files`, { headers });
  //console.log("test2: ", response.data.data, response.data.data.length)
  
  let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken+ " milliseconds");


  expect(response.data.data.length).toBe(0);
  });

 
  it('11) should not retrieve non-existent file', async () => {
    let start = Date.now();

    let filename = "nonexistent"

    const headers = {
      'currentaccount': admin,
    };

    // this.http.get(`${this.baseUrl}/documents/${record.name}`,  { headers, responseType: "blob" })
    //   .subscribe((blob ) => {
    //     console.log(`${this.baseUrl}/documents/${record.name}`)
    //     saveAs(blob, record.name);
    //   })
    const response = await instance.post(`${baseUrl}/download/test/${filename}`, {}, {headers});
    console.log("test11: ", response.status)

    let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken+ " milliseconds");

    expect(response.status).toBe(201);
  });

  


  


  it('16) should not add a file with an empty name', async () => {
    let start = Date.now();
    const headers =  {
        'filename': "",
        'currentaccount': admin
      };
    const data = {}; // Replace with actual data if needed  
    const response = await instance.post(`${baseUrl}/upload/test`, data, { headers }).then(response => {
        //console.log("test1: ", response)

        let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken+ " milliseconds");

        expect(response.status).toBe(201);
      })
  });


  it('19) should not revoke access to a file not shared', async () => {
    let start = Date.now();

    const body = {
          "name": "accounts1.txt",
          "currentAccount": admin,
          "account": user1
    };
    const response = await instance.post(`${baseUrl}/documents/deny`, {body});
    console.log("test19: ", response.status)

    let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken+ " milliseconds");

    expect(response.status).toBe(201);
  });

 
  
});






