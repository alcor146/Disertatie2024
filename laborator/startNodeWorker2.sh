./go-ethereum/build/bin/geth --datadir lab_datadir/node3 --networkid 12345 \
--bootnodes 'enode://512e151590d7519121911091da54526b97fb5b82845b4cd21ebdbb0d9b462aa8221e151fb9ddf8669a4e4a796543d414a499d9af5d3dda353bcb9db10f17bfba@127.0.0.1:30314' \
--http --http.api 'web3,eth,net,personal' \
--http.port 30306 \
--port 30316 \
--authrpc.port 8554 


