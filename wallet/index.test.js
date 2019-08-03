const Wallet = require('./index');
const { verifySignature } = require('../util');
const Transaction = require('../transaction');

describe('Wallet',()=>{
    let wallet;
    beforeEach(()=>{
        wallet = new Wallet();
    })
    it('has a property balance, publicKey', ()=>{
        expect(wallet).toHaveProperty('balance');
        expect(wallet).toHaveProperty('publicKey');
    })
    describe('signing data',()=>{
        const data = 'foo-bar';
        it('verifies signature',()=>{
            expect(
                verifySignature({
                    publicKey : wallet.publicKey,
                    data,
                    signature : wallet.sign(data)
                })
            ).toBe(true);
        });
        it('doesn\'t verifies signature',()=>{
            expect(
                verifySignature({
                    publicKey : wallet.publicKey,
                    data,
                    signature : new Wallet().sign(data)
                })
            ).toBe(false);
        });
    });
    describe('createTransaction()', ()=>{
        describe('and the amount exceeds the wallet balance', () => {
            it('throws error', () => {
                expect(() => wallet.createTransaction({amount : 999999, recipient : 'random-recipient'})).toThrow('Amount Exceeds Balance');
            });
        });
        describe('and the amount is valid', () => {
            let amount, transaction, recipient;
            beforeEach(()=>{
                amount = 50;
                recipient = 'random-recipient';
                transaction = wallet.createTransaction({amount, recipient});
            })
            it('creates an instance of transaction', () => {
                expect(transaction).toBeInstanceOf(Transaction);
            });
            it('matches the transaction input with the wallet', () => {
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });
            it('outputs the amount to the recipient', () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });
    })
});