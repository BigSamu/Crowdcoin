import React,{ useState } from 'react'
import { useRouter } from 'next/router'

import {
  Form,
  Button,
  InputGroup,
  Row,
  Col,
  Alert,
  Spinner,
} from 'react-bootstrap';

import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3';

const NewContributeForm = (props) => {

  const {campaignSummary} = props;

  const [contribution, setContribution] = useState('');
  const [lastContribution, setLastContribution] = useState('');
  const [errorMessages, setErrorMessages] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccesful, setIsSuccesful] = useState(false);

  const router = useRouter();

  const handleOnChangeContribution = (e) => {
    setContribution(e.target.value);
    
  };

  const handleOnSubmitContribution = async (e) => {
    e.preventDefault();
    
    const campaign = Campaign(campaignSummary.campaignAddress);
    setLastContribution(contribution);
    setIsLoading(true);
    setErrorMessages('');
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution,'ether'),
      });
      setIsSuccesful(true);
      
    } catch (err) {
      setIsSuccesful(false);
      setErrorMessages(err.message);
    }

    setIsLoading(false);
    setContribution('');

    router.replace(`/campaigns/${campaignSummary.campaignAddress}`)

  };

  return (
    <>
      <h5 className="mb-1"> Make a contribution: </h5>

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
          <Alert.Heading as="h5"> Thank you!</Alert.Heading>
          <small className="my-0">You contribute {lastContribution} ether to our campaign!</small>
        </Alert>
      ) : (
        ''
      )}
      
      <Form onSubmit={handleOnSubmitContribution}>
        <Form.Group as={Row} className="mb-2">
          <Form.Label column sm="auto">
            Amount to Contribute
          </Form.Label>
          <Col sm="auto">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="100000"
                value={contribution}
                onChange={handleOnChangeContribution}
              />
              <InputGroup.Text>ether</InputGroup.Text>
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
            <span>Contribute</span>
          )}
        </Button>
        
      </Form>
    </>
  )
}

export default NewContributeForm
