// import libraries
require('dotenv').config()
const { Blockchain, Transaction } = require('./utils/blockchain')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const { privateKey } = require('./utils/keygenerator')

// retrieve wallet address (public key)
const myKey = ec.keyFromPrivate(privateKey)
const myWalletAddress = myKey.getPublic('hex')

// TEST
let blockchain = new Blockchain()
const tx1 = new Transaction(myWalletAddress, 'bob', 10)
tx1.signTransaction(myKey)
blockchain.addTransaction(tx1)
blockchain.minePendingTransactions(myWalletAddress)
console.log('My wallet balance:', blockchain.getBalanceOfAddress(myWalletAddress))
console.log('Is chain valid?', blockchain.isChainValid())