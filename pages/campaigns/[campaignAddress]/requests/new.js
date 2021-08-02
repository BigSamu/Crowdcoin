import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

import NewRequestForm from '../../../../components/NewRequestForm';

export const getServerSideProps = async (context) => {
  const { campaignAddress } = context.query;
  
  return {
    props: {
      campaignAddress: campaignAddress
    },
  };
};

const NewRequestPage = (props) => {

  const {campaignAddress} = props;

  return (
    <>  
      <Head>
        <title> Crowdcoin | New Request </title>
      </Head>

      <h3> New Request </h3>
      <div className="mt-3">
        <NewRequestForm
          campaignAddress = {campaignAddress}
        />
      </div>

      <div className="mt-4">
        <Link href={`/campaigns/${campaignAddress}/requests`}>
          Go back
        </Link>
      </div>

    </>
  );
}

export default NewRequestPage
