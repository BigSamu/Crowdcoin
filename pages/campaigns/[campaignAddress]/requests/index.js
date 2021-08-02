import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { Button} from 'react-bootstrap';

import Campaign from '../../ethereum/campaign'

export const getServerSideProps = async (context) => {
  const { campaignAddress } = context.query;
  const campaign = Campaign(campaignAddress);
  
  return {
    props: {
      campaignAddress: campaignAddress
    },
  };
};

const RequestPage = (props) => {

  const {campaignAddress} = props;

  return (
    <>
      <Head>
        <title> Crowdcoin | Requests </title>
      </Head>

      <div className="d-flex">
        <h3 className="flex-grow-1"> Requests </h3>
        <Link href={`/campaigns/${campaignAddress}/requests/new`} passHref>
          <Button variant="primary">  
            New Request
          </Button>
        </Link>
      </div>

      <div className="mt-4">
      
      </div>

      <div className="mt-4">
        <Link href={`/campaigns/${campaignAddress}`}>
          Go back
        </Link>
      </div>
    </>
  )
}

export default RequestPage
