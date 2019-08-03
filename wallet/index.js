const { STARTING_BALANCE } = require('../config');
const { ec, verifySignature } = require('../util');
const cryptoHash = require('../util/crypto-hash');
const Transaction = require('../transaction');
class Wallet{
    constructor(){
        this.balance = STARTING_BALANCE ;
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }
    // data is signed using the keyPair but it is verified using the public key part of the keyPair
    // refer the oficial documentation of elliptic ya 'npm elliptic' search maar lio google pe 
    // data hex form ya array form mei hona chahiye for this function to work
    sign(data){
        return this.keyPair.sign(cryptoHash(data));
    }
    createTransaction({amount, recipient}){
        if(amount > this.balance){
            throw new Error('Amount Exceeds Balance');
        }
        return new Transaction({senderWallet: this, recipient, amount });
    }
}
module.exports = Wallet;