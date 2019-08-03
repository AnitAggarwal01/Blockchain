const Block = require('./block');
const hexToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const cryptoHash = require('../util/crypto-hash');
describe('Block', ()=>{
    const timestamp = 2000;
    const lastHash = 'foo-hash';
    const data = ['blockchain', 'data'];
    const difficulty = 1;
    const nonce = 0;
    const hash = cryptoHash(data, lastHash, timestamp, nonce, difficulty);
    const block = new Block({timestamp,lastHash,hash,data, nonce, difficulty});
    it('has a timestamp, lastHash, hash, data, nonce, difficulty', ()=>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.difficulty).toEqual(difficulty);
        expect(block.nonce).toEqual(nonce);
    });
    describe('genesis()', ()=>{
        const genesisBlock = Block.genesis();
        it('returns a block instance',()=>{
            expect(genesisBlock instanceof Block).toBe(true);
        });
        it('is same as GENESIS_DATA', ()=>{
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });
    describe('mineBlock()', ()=>{
        const lastBlock = Block.genesis();
        const data = 'mined-Data';
        const minedBlock = Block.mineBlock({lastBlock, data});

        it('returns an instance of Block', ()=>{
            expect(minedBlock instanceof Block).toBe(true);
        });
        it(`it has 'lastHash' equal to 'hash' of the lastBlock'`, ()=>{
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });
        it('has defined data', ()=>{
            expect(minedBlock.data).toEqual(data);
        })
        it('has defined timestamp',()=>{
            expect(minedBlock.timestamp).not.toEqual(undefined);
        })
        it('returns SHA-256 hash based on proper input', ()=>{
            expect(minedBlock.hash)
            .toEqual(
                cryptoHash(
                    minedBlock.timestamp,
                    minedBlock.nonce,
                    minedBlock.difficulty,
                    lastBlock.hash,
                    minedBlock.data
                )
            );
        })
        it('sets the mined block with `hash` as same difficulty as expected',()=>{
            expect(hexToBinary(minedBlock.hash).substring(0,minedBlock.difficulty))
            .toEqual('0'.repeat(minedBlock.difficulty));
        });
        it('adjusts the difficulty of the minedBlock',()=>{
            const possibleResults = [block.difficulty+1,block.difficulty-1];
            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });
    });
    describe('adjustDifficulty()', ()=>{
        it('decreases difficulty of slowly mined block', ()=>{
            expect(Block.adjustDifficulty({originalBlock : block, timestamp: block.timestamp + MINE_RATE + 100 }))
            .toEqual(block.difficulty-1);
        });
        it('raises difficulty of easily mined block', ()=>{
            expect(Block.adjustDifficulty({originalBlock : block, timestamp : block.timestamp + MINE_RATE -100 }))
            .toEqual(block.difficulty+1);
        });
        it('has a lower limit of 1',()=>{
            block.difficulty = -1;
            expect(Block.adjustDifficulty({originalBlock : block})).toEqual(1);
        });
    });

});