import { create } from 'ipfs-http-client';
import secrets from 'secrets.js-grempe';
import fs from 'fs';

const node1API = 'http://localhost:5002'; // Replace with the API address of your first node
const node1 = create({ url: node1API });

async function downloadFile(ipfs, hash) {
  try {
      const chunks = [];
      for await (const chunk of ipfs.cat(hash)) {
          chunks.push(chunk);
      }
      return Buffer.concat(chunks).toString('utf8');
  } catch (error) {
      console.error(`Error downloading file `, error);
      return null;
  }
}

async function saveFile() {
    
        let hash = "QmQkMf82N26RnMPBZcxxKLwiiHkZkeMby39WwMRECWcqDB"
        const reconstructedText = await downloadFile(node1, hash);
        const outputFilePath = 'ReconstructedFile.txt';

        fs.writeFileSync(outputFilePath, reconstructedText, 'utf8');
        console.log(`Text document successfully reconstructed and saved to ${outputFilePath}`);
}

saveFile();
