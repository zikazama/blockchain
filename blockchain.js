const {
  createHash
} = require('crypto');
const _ = require('lodash');

module.exports = class Blockchain {
  constructor(difficultyTarget = '0000') {
    this.difficultyTarget = difficultyTarget;
    this.chain = [];
    this.currentTransaction = [];
    const genesisHash = this.hashBlock("genesis_block");
    this.appendBlock(
      this.proofOfWork(0, genesisHash, []),
      genesisHash
    );
  }

  hashBlock(block){
    const blockEncoded = _.sortBy(block, "key").toString();
    const digest = createHash('sha256').update(blockEncoded).digest('hex');
    return digest;
  }

  proofOfWork(index, hashOfPreviousBlock, transactions, nonce){
    nonce = 0;
    while(this.validProof(index, hashOfPreviousBlock, transactions, nonce) == false){
      nonce++;
    }
    return nonce;
  }

  validProof(index, hashOfPreviousBlock, transactions, nonce){
    const content = `${index}${hashOfPreviousBlock}${transactions}${nonce}`;
    const contentHash = createHash('sha256').update(content).digest('hex');
    return contentHash.slice(0,3);
  }

  appendBlock(nonce, hashOfPreviousBlock){
    const block = {
      'index': this.chain.length,
      'timestamp': new Date(),
      'transaction': this.currentTransaction,
      'nonce': nonce,
      'hashOfPreviousBlock': hashOfPreviousBlock,
    };
    this.currentTransaction = [];
    this.chain.push(block);
    return block;
  }

  addTransaction(sender, recipient, amount){
    this.currentTransaction.push({
      'amount': amount,
      'recipient': recipient,
      'sender': sender,
    });
    return this.lastBlock() + 1;
  }

  lastBlock(){
    return this.chain.length-1;
  }
}