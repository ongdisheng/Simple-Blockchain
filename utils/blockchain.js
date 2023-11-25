// import libraries
const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
  }

  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount)
      .toString()
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets!')
    }

    // sign transaction hash output using private key
    const hashTx = this.calculateHash()
    const sig = signingKey.sign(hashTx, 'base64')
    this.signature = sig.toDER('hex')
  }

  isValid() {
    // mining reward transaction
    if (this.fromAddress === null) {
      return true
    }

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction')
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
    return publicKey.verify(this.calculateHash(), this.signature)
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

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false
      }
    }

    return true
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
    const rewardTx = new Transaction(null, minerAddress, this.miningReward)
    this.pendingTransactions.push(rewardTx)

    let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
    block.mine(this.difficulty)
    this.chain.push(block)

    // reset pending transactions
    this.pendingTransactions = []
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address')
    }

    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to chain')
    }

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

      if (!curBlock.hasValidTransactions()) {
        return false
      }

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