const Blockchain = require('../blockchain');
const Block = require('./block');
const cryptoHash = require('../util/crypto-hash');
describe('Blockchain', ()=>{
    let blockchain ,newChain, originalChain;
    beforeEach(()=>{
        blockchain = new Blockchain() ;
        newChain = new Blockchain();
        originalChain = blockchain;
    });

    it('blockchain is an instance of array',()=>{
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('has first block as GENESIS block',()=>{
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });
    
    describe('addBlock()',()=>{
        const newData = ['mydata'];
        it('adds a new block to the chain',()=>{
            blockchain.addBlock({data : newData});
            const lastBlock = blockchain.chain[blockchain.chain.length-1];
            expect(lastBlock.data).toEqual(newData);
        });
    });
    describe('isValidChain()', ()=>{
        describe('When Chain does not start with the genesis block', ()=>{
            it('returns false',()=>{    
                blockchain.chain[0] = 'nastyblock';
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });
        describe('When Chain starts with the genesis block and has multiple blocks', ()=>{
            beforeEach(()=>{
                    blockchain.addBlock({data:'data1'});
                    blockchain.addBlock({data:'data2'});
                    blockchain.addBlock({data:'data3'}); 
            })
            describe('a lasthash reference has been changed',()=>{
                it('returns false', ()=>{
                    blockchain.chain[2].lastHash = 'NastyHash';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe('The chain contains a block with an invalid field',()=>{
                it('returns false', ()=>{
                    blockchain.chain[2].data = 'NastyData';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe('There is a difficulty jump between the two blocks', ()=>{
                it('returns false',()=>{
                    const lastBlock = blockchain.chain[blockchain.chain.length-1];
                    const fakeDifficulty = lastBlock.difficulty -3 ;
                    const nonce = 0;
                    const timestamp = Date.now();
                    const data = [];
                    const lastHash = lastBlock.hash;
                    const hash = cryptoHash(data,fakeDifficulty,nonce,timestamp,lastHash);
                    const newBlock = new Block({timestamp, hash, lastHash, nonce, difficulty : fakeDifficulty, data});
                    blockchain.chain.push(newBlock);
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                    
                });
            });
            describe('The chain is valid',()=>{
                it('returns true',() =>{
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
    describe('replaceChain()',()=>{
        describe('The new chain is not longer',()=>{
            it('does not replace old chain',()=>{
                newChain.chain[0] = 'invalidchain';
                expect(blockchain).toEqual(originalChain);
            });
        });
        describe('The new chain is longer',()=>{
            describe('but is invalid', ()=>{
                it('does not replace old chain',()=>{
                    newChain.chain[0] = 'invalidchain';
                    blockchain.replaceChain(newChain.chain);
                    expect(blockchain).toEqual(originalChain);
                });
            });
            describe('and is valid', ()=>{
                it('replaces old chain',()=>{
                    newChain.addBlock({data:'valid'});
                    blockchain.replaceChain(newChain.chain);
                    expect(blockchain).toEqual(newChain);
                });
            });
        });
    });
});