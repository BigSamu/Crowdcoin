import React from 'react';
import Head from 'next/head'
import Link from 'next/link'

import {Button, Row, Col} from 'react-bootstrap';

import CampaignDetailCards from '../../components/CampaignDetailCards';
import NewContributeForm from '../../components/NewContributionForm';

import Campaign from '../../ethereum/campaign'

export const getServerSideProps = async (context) => {
  const { campaignAddress } = context.query;
  const campaign = Campaign(campaignAddress);
  const summary = await campaign.methods.getSummary().call();
  
  return {
    props: {
      campaignSummary: {
        minimumContribution: summary[0],
        balance: summary[1],
        requestsCount: summary[2],
        approversCount: summary[3],
        managerAddress: summary[4],
        campaignAddress: campaignAddress
      }
    },
  };
};

const CampaignDetailsPage = (props) => {
  
  const {campaignSummary} = props;
  
  return (
    <>
      <Head>
        <title> Crowdcoin | Campaigns </title>
      </Head>

      <h3>Campaign Details </h3>
      <div className="mt-3">
        <Row className="g-4">
          <Col xs={12} md={8}>
            <CampaignDetailCards
              campaignSummary = {campaignSummary}
            />
          </Col>
          <Col xs ={12} md={4}>
            <NewContributeForm
              campaignSummary = {campaignSummary}
            />
          </Col>
        </Row>
      </div>

      <div>
        <Link href={`/campaigns/${campaignSummary.campaignAddress}/requests`} passHref>
          <Button variant="primary" className="mt-3">  
              Check Requests
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        <Link href="/" >
          Go Back
        </Link>
      </div>
    </>
  );
};

export default CampaignDetailsPage;
