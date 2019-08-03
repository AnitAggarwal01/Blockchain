const Block = require('./block');
const cryptoHash = require('../util/crypto-hash');
class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }
    // addBlock isn't a static method as it alters the property chain of the an instance of blockchain class
    addBlock({data}){
        // console.log(`data is ${data}`);
        const lastBlock = this.chain[this.chain.length-1];
        const newBlock = Block.mineBlock({lastBlock, data});
        this.chain.push(newBlock);
        // console.log(this.chain.length);
    }
    static isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
        for(let i=1;i<chain.length;i++){
            const {timestamp, lastHash, hash, data, nonce, difficulty} = chain[i];
            const actualLastHash = chain[i-1].hash;
            if(actualLastHash !== lastHash)
                return false;
            if(cryptoHash(timestamp,lastHash,data, nonce, difficulty ) !== hash )
                return false;
            if(Math.abs(difficulty - chain[i-1].difficulty) > 1)
                return false;
        }
        return true;
    }
    replaceChain(newChain){
        if(this.chain.length >= newChain.length) return ;
        if(Blockchain.isValidChain(newChain) === false) return ;
        this.chain = newChain ; 
    }
}
module.exports = Blockchain;