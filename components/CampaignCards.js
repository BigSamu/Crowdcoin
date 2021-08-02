import React from 'react';
import Link from 'next/link';

import {Card} from 'react-bootstrap';

import _ from 'lodash';

const CampaignCards = (props) => {

  const { campaigns } = props;

  return (
    <>
      {!_.isEmpty(campaigns) &&
        campaigns.map((address, index) => (
          <Card key={index} className="mb-2">
            <Card.Body>
              <Card.Title>{address}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Campaign # {index+1}
              </Card.Subtitle>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
              <Link href={`/campaigns/${address}`} passHref>
                <Card.Link >View Campaign</Card.Link>
              </Link>
            </Card.Body>
          </Card>
        ))}
    </>
  );
};

export default CampaignCards;
