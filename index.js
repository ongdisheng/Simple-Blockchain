// import libraries
const SHA256 = require('crypto-js/sha256')

class Block {
  // block header
  constructor(timestamp, data, previousHash='') {
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  // calculate hash of current block
  calculateHash() {
    return SHA256(this.timestamp + this.data + this.previousHash + this.nonce)
      .toString()
  }

  // mine block
  mine(difficulty) {
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
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.mine(this.difficulty)
    this.chain.push(newBlock)
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

// TEST
let blockchain = new Blockchain()
blockchain.addBlock(new Block(Date.now(), { amount: 1 }))

// length of 2 (including genesis block)
console.log(blockchain.chain.length)
console.log(blockchain.isChainValid())