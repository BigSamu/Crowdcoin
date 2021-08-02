import React, { useState } from 'react';

import {
  Form,
  Button,
  InputGroup,
  Row,
  Col,
  Alert,
  Spinner,
} from 'react-bootstrap';

import factory from '../ethereum/factory';
import web3 from '../ethereum/web3';

import _ from 'lodash';

const NewCampaignForm = (props) => {


  const { minimumContribution, setMinimumContribution } = props;

  const [errorMessages, setErrorMessages] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccesful, setIsSuccesful] = useState(false);

  const handleOnChangeMinimumContribution = (e) => {
    setMinimumContribution(e.target.value);
  };

  const handleOnSubmitMinimumContribution = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessages('');
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });
      setIsSuccesful(true);
      
    } catch (err) {
      setIsSuccesful(false);
      setErrorMessages(err.message);
    }

    setIsLoading(false);
    setMinimumContribution('');
  };


  return (
    <> 
       <h5 className="mb-3"> Create a campaign: </h5>
      {errorMessages !== '' ? (
        <Alert variant="danger">
          <Alert.Heading as="h5"> Error</Alert.Heading>
          <small className="my-0">{errorMessages}</small>
        </Alert>
      ) : (
        ''
      )}
      {isSuccesful && !isLoading ? (
        <Alert variant="success">
          <Alert.Heading as="h5"> Nice!</Alert.Heading>
          <small className="my-0">Your new campaign has been created!</small>
        </Alert>
      ) : (
        ''
      )}

      <Form className="my-2" onSubmit={handleOnSubmitMinimumContribution}>
        <Form.Group as={Row} className="mb-2">
          <Form.Label column sm="auto">
            Minimum Contribution
          </Form.Label>
          <Col sm="auto">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="100000"
                value={minimumContribution}
                onChange={handleOnChangeMinimumContribution}
              />
              <InputGroup.Text>wei</InputGroup.Text>
            </InputGroup>
          </Col>
        </Form.Group>

        <Button variant="success" type="submit" disabled={isLoading} className="mt-1">
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span> Loading</span>
            </>
          ) : (
            <span>Create</span>
          )}
        </Button>
      </Form>
    </>
  );
};

export default NewCampaignForm;
