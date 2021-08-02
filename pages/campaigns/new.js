import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { Button } from 'react-bootstrap';

import NewCampaignForm from '../../components/NewCampaignForm';

const NewCampaignPage = () => {

  const [minimumContribution, setMinimumContribution] = useState('');
  return (
    <>
      <Head>
          <title> Crowdcoin | New Campaign </title>
        </Head>
      <h3> New Campaign </h3>
      <div className="mt-3">
        <NewCampaignForm
          minimumContribution = {minimumContribution}
          setMinimumContribution = {setMinimumContribution}
        />
      </div>

      <div className="mt-4">
        <Link href="/">
          Go Back
        </Link>
      </div>
    </>
  );
};

export default NewCampaignPage;
