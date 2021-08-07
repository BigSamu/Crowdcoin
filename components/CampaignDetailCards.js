import React from 'react'
import Head from 'next/head'

import {Card, Row, Col} from 'react-bootstrap';

import web3 from '../ethereum/web3'

const CampaignDetailCards = (props) => {

  const {campaignSummary} = props;
 
  return (
    <Row xs={1} md={2} className="g-2" >

      {/* Manager Address */}
      <Col>
        <Card bg={'light'} className="h-100">
          <Card.Body>
            <Card.Title>Manager Address</Card.Title>
            <Card.Subtitle className="text-muted">{campaignSummary.managerAddress}</Card.Subtitle>
            <Card.Text>
              The manager created this campaign and create requests to withdraw money.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      {/* Minimum Contribution */}
      <Col>
        <Card bg={'light'} className="h-100">
          <Card.Body>
            <Card.Title>Minimum Contribution (wei)</Card.Title>
            <Card.Subtitle className="text-muted">{campaignSummary.minimumContribution}</Card.Subtitle>
            <Card.Text>
              You must contribute at least this much wei to become an approver.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      {/* Number of Requests */}
      <Col>
        <Card bg={'light'} className="h-100">
          <Card.Body>
            <Card.Title>Number of Requests</Card.Title>
            <Card.Subtitle className="text-muted">{campaignSummary.requestsCount}</Card.Subtitle>
            <Card.Text>
              A request tries to withdraw money from the contract. Requests must be approved by approvers.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      {/* Number of Approvers */}
      <Col>
        <Card bg={'light'} className="h-100">
          <Card.Body>
            <Card.Title>Number of Approvers</Card.Title>
            <Card.Subtitle className="text-muted">{campaignSummary.approversCount}</Card.Subtitle>
            <Card.Text>
              Number of people who have already donated to this campaign.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>


      <Col>
        <Card bg={'light'} className="h-100">
          <Card.Body>
            <Card.Title>Campaign Balance (ether)</Card.Title>
            <Card.Subtitle className="text-muted">{web3.utils.fromWei(campaignSummary.balance, 'ether')}</Card.Subtitle>
            <Card.Text>
             Balance is how much money this campaign has left to spend.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    
    </Row>  
  );
}

export default CampaignDetailCards
