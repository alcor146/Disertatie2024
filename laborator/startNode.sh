./go-ethereum/build/bin/geth --datadir lab_datadir/node1 --networkid 12345 \
--http --http.api 'web3,eth,net,miner,personal' \
--http.corsdomain=* \
--http.vhosts=* \
--http.port 30304 \
--port 30314 \
--authrpc.port 8552 \
--allow-insecure-unlock --unlock "0x568f2d6eb23cbf65d56cc004f9cdb26aefbcf244,0x510f0a55f962eb67daa8a20553fa897157466f9f,0xe2c17ef972951095173d2470d9cd34449f3d4b09" \
--password "lab_datadir/node1/keystore/pass.txt" \
--mine \
--miner.etherbase=0x568f2d6eb23cbf65d56cc004f9cdb26aefbcf244 \
--netrestrict="127.0.0.1/8" 