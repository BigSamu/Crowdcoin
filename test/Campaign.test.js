const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // Working with constructor function
// By convetion variable is set with a capital letter
const web3 = new Web3(ganache.provider({ gasLimit: 10000000 })); // creates instance of Web3 and tells that
// instance to conect to ganache local network
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaing = require('../ethereum/build/Campaign.json');

// Auxiliar Variables
let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  // I) Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // II) Use one of those accounts to deploy factory contract
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({
      from: accounts[0],
      gas: '10000000',
    });

  // III) Use Factory contracts to create Campaign contracts

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000',
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(compiledCampaing.abi, campaignAddress);
});

describe('Campaigns Tests', () => {
  // Test I
  it('deploys a factory and a campaign contract', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  // Test II
  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(accounts[0], manager);
  });
  // Test III
  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1], // account number 2 out of 10 generated by ganache
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor); // assert that isContributor us true
  });
  // Test IV
  it('requires a minimum contribution', async () => {
    let executed;
    try {
      await campaign.methods.contribute().send({
        value: 5, // sending 50 wei (less than 100 wei - min contribution)
        from: accounts[1],
      });
      executed = 'success';
    } catch (err) {
      executed = 'fail';
    }
    assert.strictEqual('fail', executed);
  });
  // Test V
  it('allows a manager to make a payment request', async () => {
    await campaign.methods
      .createRequest('Buy Batteries', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      });

    //assume that this is the first request added (will be in index 0)
    const request = await campaign.methods.requests(0).call();
    assert.strictEqual('Buy Batteries', request.description);
  });
  // Test VI
  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });

    await campaign.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '10000000',
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '10000000',
    });

    let balance = await web3.eth.getBalance(accounts[1]); // return a string in wei
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);


    console.log('current balance in account 1: ' + balance);
    // Notes: Because we have been doing tests before in account 1, unforetunetely
    // it is not possible to know the exact amount of ether that that accounts hold.
    // (ganache drawback). However what it is possible is to guess that the amount will be
    // be roughtly below 105 ether (because transactions use gas). Wence, we use a test
    // saying that the balance have to be greater than 104
    assert(balance > 104);
  });
});
