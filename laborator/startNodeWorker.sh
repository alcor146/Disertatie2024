./go-ethereum/build/bin/geth --datadir lab_datadir/node2 --networkid 12345 \
--bootnodes 'enode://c6a6ced22ce8d30511d4a34260ab76fd744fde02f399ba56875dc670c682ea50847b51d5fa8babac3664511c4634047b2647839b4bff1a7337aec829d336d62c@127.0.0.1:30314' \
--http --http.api 'web3,eth,net,miner,personal' \
--http.port 30305 \
--port 30315 \
--authrpc.port 8553


