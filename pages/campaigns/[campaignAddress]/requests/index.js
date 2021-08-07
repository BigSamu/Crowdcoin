import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { Button } from 'react-bootstrap';

import RequestsTable from '../../../../components/RequestsTable';

import Campaign from '../../../../ethereum/campaign'

export const getServerSideProps = async (context) => {
  const { campaignAddress } = context.query;
  const campaign = Campaign(campaignAddress);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();
  
  const requestsRaw = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
    })
  );

  const requests = await JSON.parse(JSON.stringify(requestsRaw))

  return {
    props: { campaignAddress, requests, requestCount, approversCount }
  };
};

const RequestPage = (props) => {

  const {campaignAddress, requests, requestCount, approversCount} = props;
  
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
        <RequestsTable
          campaignAddress = {campaignAddress} 
          requests = {requests}
          approversCount = {approversCount} 
        />
      </div>

      <p> Found {requestCount} requests </p>
    </>
  )
}

export default RequestPage
