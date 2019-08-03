const PubSub = require('./pubsub');
const Blockchain = require('../blockchain');
describe('pubsub',() => {
    const blockchain = new Blockchain();
    const pubsub = new PubSub({blockchain}); 
    it('has a Publisher,subscriber,blockchain',()=>{
        expect(pubsub.publisher).not.toEqual(undefined);
        expect(pubsub.subscriber).not.toEqual(undefined);
        expect(pubsub.blockchain).toEqual(blockchain);
    });
    describe('handeleMessage()',()=>{

    });
    describe('handleMessage()',()=>{
        
    });
    describe('subscribeToChannels()', ()=>{

    });
    describe('publish()',()=>{
        
    })
    describe('broadcastChain()',()=>{
        
    })
});