const { GENESIS_DATA, MINE_RATE } = require('../config');
const hexToBinary = require('hex-to-binary');
const cryptoHash = require('../util/crypto-hash');
class Block{
    constructor({timestamp, lastHash, hash, data, nonce, difficulty}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }
    static genesis(){
        return new Block(GENESIS_DATA);
    }
    static mineBlock({lastBlock, data}){
        //const timestamp = new Date();
        let hash, timestamp, difficulty;
        const lastHash = lastBlock.hash;
        let nonce = 0;
        do{
            nonce++;
            timestamp = Date.now();
            difficulty = this.adjustDifficulty({originalBlock : lastBlock, timestamp})
            hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);
        }while(hexToBinary(hash).substr(0,difficulty) !== '0'.repeat(difficulty));
        const minedBlock = new this({   timestamp, lastHash, difficulty, nonce, hash, data});
        return minedBlock;
    }
    static adjustDifficulty({originalBlock, timestamp}){
        if(originalBlock.difficulty<1)
        return 1;
        const diff = timestamp - originalBlock.timestamp;
        if(diff > MINE_RATE) return originalBlock.difficulty-1 ;
        return originalBlock.difficulty+1;
    }
}
module.exports = Block;