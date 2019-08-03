const Blockchain = require('../blockchain');
const blockchain = new Blockchain();
blockchain.addBlock({data : 'initial'});

let prevTimestamp ,newBlock, nexTimestamp, sum = 0 ;
const times = [];
for(let i = 0; i<10000; i++){
    prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
    blockchain.addBlock({data : `block ${i}`});
    newBlock = blockchain.chain[blockchain.chain.length -1];
    nexTimestamp = newBlock.timestamp;
    timeDiff = nexTimestamp - prevTimestamp ;
    times.push(timeDiff);
    sum += timeDiff; 
    console.log(`Time for mining block : ${timeDiff}ms , Difficulty : ${newBlock.difficulty}, Running MineRate Average ${sum/(i+1)}ms `);
}