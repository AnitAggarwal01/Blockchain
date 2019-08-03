const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const request = require('request');
const TransactionPool = require('./transaction/transaction-pool'); 
const Wallet = require('./wallet');
const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const pubsub = new PubSub({blockchain, transactionPool});
const wallet = new Wallet();
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

const syncWithRootState = () => {
    request({url:`${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body)=>{
        if(!error && response.statusCode === 200){
            const rootChain = JSON.parse(body);
            console.log('replace chain on a sync with',rootChain);
            blockchain.replaceChain(rootChain);
        }
    });
    request({url:`${ROOT_NODE_ADDRESS}/api/transaction-pool-map`}, (error, response, body)=>{
        if(!error && response.statusCode === 200){
            const rootMap = JSON.parse(body);
            console.log('replace chain on a sync with',rootMap);
            transactionPool.setMap(rootMap);
        }
    });

};

app.use(bodyParser.json());

setTimeout(()=> pubsub.broadcastChain(),1000);

app.get('/api/blocks',(req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine',(req, res) => {
    const {data} = req.body;
    blockchain.addBlock({data});
    pubsub.broadcastChain();    
    console.log(req);
    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const {amount , recipient} = req.body;
    let transaction = transactionPool.existingTransaction({inputAddress:wallet.publicKey});
    try{
        if(transaction){
            transaction.update({senderWallet : wallet, recipient, amount})
        }
        else{
            transaction = wallet.createTransaction({recipient, amount});
        }                   
    }catch(error){
        return res.status(400).json({ type:'error', message:error.message });
    }
    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction();
    console.log(`transactionPool`, transactionPool);
    res.json({type:'success', transaction});
});
app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap); 
});

let PEER_PORT ; 
if(process.env.GENERATE_PEER_PORT === 'true')
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);

const PORT = PEER_PORT || DEFAULT_PORT ;

app.listen(PORT,() =>{
    console.log(`listening at port:${PORT}`);
    syncWithRootState();
});
