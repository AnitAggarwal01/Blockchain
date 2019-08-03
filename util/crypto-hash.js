const sha256 = require('js-sha256');
const cryptoHash = (...inputs)=>{
    return sha256(inputs.map(input => JSON.stringify(input)).sort().join(''));
}
module.exports = cryptoHash;