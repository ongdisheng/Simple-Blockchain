// import libraries
const { Blockchain, Transaction } = require('./utils/blockchain')

// TEST
let blockchain = new Blockchain()
blockchain.createTransaction(new Transaction('address 1', 'address 2', 100))
blockchain.createTransaction(new Transaction('address 2', 'address 1', 50))
blockchain.minePendingTransactions('wallet')
blockchain.minePendingTransactions('wallet')
console.log(blockchain.getBalanceOfAddress('wallet'))