const cryptoHash= require('./crypto-hash');

describe('cryptoHash()', ()=>{
    it('returns SHA-256 hashed value', ()=>{
        expect(cryptoHash('anit')).toEqual('83549424aab63c43c5fdd994c1458d3eed8c283f23de60ddf6b1edf293c68ebf');
    });
    it('returns same hash for same input irrespective of input order',()=>{
        expect(cryptoHash('one','two')).toEqual(cryptoHash('two','one'))
    });
    it('produces a unique hash when the properties have change in the input', () => {
        const randomObject = {};
        const previousHash = cryptoHash(randomObject);
        randomObject['a'] = 'a'; // adding a random property to mimic the changes which might occur in actual input
        const newHash = cryptoHash(randomObject);
        expect(newHash).not.toEqual(previousHash);
    });
});