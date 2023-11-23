// import libraries
const SHA256 = require('crypto-js/sha256')

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
  }
}

class Block {
  // block header
  constructor(timestamp, transactions, previousHash='') {
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  // calculate hash of current block
  calculateHash() {
    return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce)
      .toString()
  }

  // mine block
  mine(difficulty) {
    // increment nonce until hash reaches target difficulty
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++
      this.hash = this.calculateHash()
    }

    console.log('Block mined:', this.hash)
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 2
    this.pendingTransactions = []
    this.miningReward = 100
  }

  // first block
  createGenesisBlock() {
    return new Block(Date.now(), 'Genesis block')
  }

  // retrieve latest block in the chain
  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  // add a new block to the chain
  minePendingTransactions(minerAddress) {
    let block = new Block(Date.now(), this.pendingTransactions)
    block.mine(this.difficulty)

    this.chain.push(block)

    // reset pending transactions
    this.pendingTransactions = [
      new Transaction(null, minerAddress, this.miningReward)
    ]
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction)
  }

  getBalanceOfAddress(address) {
    let balance = 0

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address) {
          balance -= tx.amount
        }

        if (tx.toAddress === address) {
          balance += tx.amount
        }
      }
    }

    return balance
  }

  isChainValid() {
    for(let i = 1; i < this.chain.length; i++) {
      const prevBlock = this.chain[i-1]
      const curBlock = this.chain[i]

      if (curBlock.hash !== curBlock.calculateHash()) {
        return false
      }

      if (prevBlock.hash !== curBlock.previousHash) {
        return false
      }
    }

    return true
  }
}

module.exports = { Blockchain, Transaction }