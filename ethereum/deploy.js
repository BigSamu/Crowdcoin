const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3'); // capital leter means variables is constructor
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  // i) Metamask account mnemonic
  'print inspire saddle easy fish siege draft planet have sudden degree bitter',
  // ii) Link to URL to Ethereum Network
  'https://rinkeby.infura.io/v3/6b5b2bd2fc5a4ff98399fbaa0544f93b'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts(); // web3 methods are async
  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: '10000000',
    });

  console.log('Contract deployed to ', result.options.address);
  provider.engine.stop();
};

deploy();
