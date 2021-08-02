import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link'

import { Button, Row, Col } from 'react-bootstrap';
import {PlusSquareFill } from 'react-bootstrap-icons';

import CampaignCards from '../components/CampaignCards';

import factory from '../ethereum/factory';
import _ from 'lodash';

export const getStaticProps = async () => {
  let campaigns = await factory.methods.getDeployedCampaigns().call();
  return {
    props: { campaigns },
  };
};

const LandingPage = (props) => {
  const { campaigns } = props;

  return (
    <>
      <Head>
        <title> Crowdcoin | Home </title>
      </Head>
     
      <h3>Open Campaigns</h3>
      <div className="mt-3">
        <Row className="align-items-start">
          <Col xs={8}>
            <CampaignCards
              campaigns = {campaigns}
            />
          </Col>
          
        </Row>
        <Row>
          <Col xs={4}>
            <Link href="/campaigns/new" passHref>
              <Button variant="success" className="mt-3">  
                <PlusSquareFill className="mb-1"/> <span className="ps-2">Create Campaign</span>
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    
    </>
  );
};

export default LandingPage;
