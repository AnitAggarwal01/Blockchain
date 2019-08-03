const TransactionPool = require('.');
const Transaction = require('..');
const Wallet = require('../../wallet')
describe('transactionPool', () => {
    let transactionPool, transaction, senderWallet;
    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet =  new Wallet();
        transaction = new Transaction({
            senderWallet,
            amount : 100,
            recipient : 'new-recipient'
        });
    });
    describe('setTransaction()', ()=> {
        it('adds a transaction', () => {
            transactionPool.setTransaction(transaction);
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);     
        })
    });
    describe('existingTransacation()', () => {
        it('returns an existing transaction given an input address', () => {
            transactionPool.setTransaction(transaction);
            expect(transactionPool.existingTransaction({inputAddress : senderWallet.publicKey}))
            .toBe(transaction);
        });
    });
});