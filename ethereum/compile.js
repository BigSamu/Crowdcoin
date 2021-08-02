const path = require('path'); // path module 9for interacting with File System)
const solc = require('solc'); // solidity compiler module
const fs = require('fs-extra'); // file system module

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

var input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

fs.ensureDirSync(buildPath);

if (output.errors) {
  output.errors.forEach((err) => {
    console.log(err.formattedMessage);
  });
} else {
  const contracts = output.contracts['Campaign.sol'];
  for (let contractName in contracts) {
    //const contract = contracts[contractName];
    fs.outputJsonSync(
      path.resolve(buildPath, `${contractName}.json`),
      contracts[contractName]
    );
  }
}

// const interface = output.contracts['Campaign.sol'].Campaign.abi;
// const bytecode = output.contracts['Campaign.sol'].Campaign.evm.bytecode.object;

// module.exports = {
//   interface,
//   bytecode,
// };
