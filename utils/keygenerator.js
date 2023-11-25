// elliptic curve
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

// generate public and private keypairs
const key = ec.genKeyPair()
const publicKey = key.getPublic('hex')
const privateKey = key.getPrivate('hex')

// console.log('Public key:', publicKey)
// console.log('Private key:', privateKey)
module.exports = { privateKey }