import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0xeadb15f70cae0718F1a7fBB799Af635579787463'
);

export default instance;
