const Transaction = require('.');
const Wallet = require('../wallet');
const {verifySignature} = require('../util');
describe('Transaction',()=>{
    let transaction, senderWallet, recipient , amount ;
        beforeEach(()=>{
            senderWallet = new Wallet();
            recipient = 'recipient-public-Key';
            amount = 50 ;
            transaction = new Transaction({senderWallet,recipient,amount});
        })
    it('has transactionID, outputMap',() => {
        expect(transaction).toHaveProperty('id');
        expect(transaction).toHaveProperty('outputMap');
        expect(transaction).toHaveProperty('input');
    });
    it('outputs the remaining balance for the sender wallet',()=>{
        expect(transaction.outputMap[senderWallet.publicKey])
        .toEqual(senderWallet.balance - amount);
    });
    describe('input',() => {
        it('has has a `timestamp`',()=>{
            expect(transaction.input).toHaveProperty('timestamp');
        });
        it('sets the amount to `senderWallet` Balance',() => {
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });
        it('it sets the `address` to the `senderWallet` `Publickey` ', () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });
        it('signs the input', () => {
            expect(verifySignature({
                publicKey : senderWallet.publicKey,
                data : transaction.outputMap,
                signature : transaction.input.signature
            })).toBe(true);
        });
    });
    describe('validTransaction()', () => {
        describe('when the transaction is valid', () => {
            it('returns true', () => {
                // console.log(transaction.outputMap);
                expect(Transaction.validTransaction(transaction)).toBe(true);
            })
        });
        describe('when the transaction is invalid', () => {
            describe('due to invalid outputMap ', () => {
                it('returns false', () => {
                    transaction.outputMap[senderWallet.publicKey] = 9999999;
                    expect(Transaction.validTransaction(transaction)).toBe(false);
                });
            });
            describe('due to invalid input signature ', () => {
                it('returns false', () => {
                    transaction.input.signature = new Wallet().sign('data');
                    expect(Transaction.validTransaction(transaction)).toBe(false);
                });
            });
        });
    });
    describe('update', () => {
        let originalSenderOutput, originalSignature, nextRecipient, nextAmount;
        describe('and the amount is invalid', () => {
            it('throws an error', () => {
                expect(() => {
                    transaction.update({senderWallet,recipient:'randomRecipient',amount : 999999})
                }).toThrow('Amount Exceeds Balance');
            });
        });
        describe('and the amount is valid', () => {
            beforeEach(() => {
                originalSignature = transaction.input.signature;
                originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
                nextRecipient = 'next-recipient';
                nextAmount = 50;
                transaction.update({
                  senderWallet, recipient: nextRecipient, amount: nextAmount
                });
              });
            
            it('outputs the amount to the next recipient', () => {
                expect(transaction.outputMap[recipient]).toEqual(nextAmount);
            });
            it('subtracts the amount from the original sender output amount', () => {
                expect(transaction.outputMap[senderWallet.publicKey])
                .toEqual(originalSenderOutput - nextAmount);
            });
            it('maintains a total output that matches the input amount', () => {
                expect(
                    Object.values(transaction.outputMap)
                      .reduce((total, outputAmount) => total + outputAmount)
                  ).toEqual(transaction.input.amount);
            });
            it('re-signs the transaction', () => {
                expect(transaction.input.signature).not.toEqual(originalSignature);
            });
            describe('and another update for the same recipient', () => {
                let addedAmount;
                beforeEach(() => {
                    addedAmount = 80 ;
                    transaction.update({senderWallet, recipient: nextRecipient, amount : addedAmount});
                });
                it('adds to the recipient amount', () => {
                    expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount + addedAmount);
                });
                it('subtracts that amount from the priginal sender output amount', () => {
                    expect(transaction.outputMap[senderWallet.publicKey])
                    .toEqual(originalSenderOutput - nextAmount -addedAmount);
                });
            });
        });
    });

});
