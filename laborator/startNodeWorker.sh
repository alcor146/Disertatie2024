./go-ethereum/build/bin/geth --datadir lab_datadir/node2 --networkid 12345 \
--bootnodes 'enode://54e4bf88ae8ccbee7eb2d433c4b6fb0f11527c0128cef540108f0c076755f83a131274cb8830932b226cbd31b9610dcb13cc4c44743bf4e8fb05f0d961fd0372@127.0.0.1:30314' \
--http --http.api 'web3,eth,net,personal' \
--http.port 30305 \
--port 30315 \
--authrpc.port 8553


