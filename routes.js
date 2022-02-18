const Blockchain = require('./blockchain');
const uuid4 = require("uuid4");
const express = require('express');
const app = express();
const router = express.Router();

const nodeIdentifier = uuid4().toString().replace("-","");
const blockchain = new Blockchain();

// Routes

router.get('/blockchain', (req, res) => {
  let response = {
    'chain': blockchain.chain,
    'length': blockchain.chain.length,
  };
  res.status(200).json(response);
});

router.get('/mine', (req, res) => {
  blockchain.addTransaction(
    sender="0",
    recipient=nodeIdentifier,
    amount=1
  );

  let lastBlockHash = blockchain.hashBlock(blockchain.lastBlock);
  let index = blockchain.chain.length;
  let nonce = blockchain.proofOfWork(index, lastBlockHash, blockchain.currentTransaction);
  let block = blockchain.appendBlock(nonce, lastBlockHash);
  let response = {
    'message': 'New Block Added',
    'index': block['index'],
    'hashOfPreviousBlock': block['hashOfPreviousBlock'],
    'nonce': block['nonce'],
    'transaction': block['transaction'],

  };
  res.status(200).json(response);
})

router.post('/transactions/new', (req, res) => {
  const values = req.body;
  const required = ['sender','recipient','amount'];
  required.map(function(data){
    if(values[data] === undefined){
      return res.status(400).json(`Missing field ${data}`);
    }
  });

  let index = blockchain.addTransaction(
    values.sender,
    values.recipient,
    values.amount
  );
  let response = {
    'message': `transaction will be add to index ${index}`,
  };

  res.status(201).json(response);
});

module.exports = router;