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

import LoadingButton from './LoadingButton'

import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3';

const NewRequestForm = (props) => {

  const {campaignAddress} = props;

  const [newRequest, setNewRequest] = useState({
    description: '',
    amount: '',
    recipientAddress: ''
  });
  
  const [errorMessages, setErrorMessages] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccesful, setIsSuccesful] = useState(false);

  const router = useRouter();

  const handleOnChangeNewRequest = (e) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value});
    
  };

  const handleOnSubmitNewRequest = async (e) => {
    e.preventDefault();
    
    const campaign = Campaign(campaignAddress);
   
    setIsLoading(true);

    setErrorMessages('');
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.createRequest(
        newRequest.description,
        web3.utils.toWei(newRequest.amount,'ether'),
        newRequest.recipientAddress,
      ).send({
        from: accounts[0],
      });

      setIsSuccesful(true);
      setNewRequest({
        description: '',
        amount: '',
        recipientAddress: ''
      });
      
    } catch (err) {
      setIsSuccesful(false);
      setErrorMessages(err.message);
    }
    
    setIsLoading(false);
    
  };

  return (
    <>
      <h5 className="mb-3"> Create a request: </h5>
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
          <Alert.Heading as="h5"> Great!</Alert.Heading>
          <small className="my-0">You crearte a new request for your campaign!</small>
        </Alert>
      ) : (
        ''
      )}
      
      <Form onSubmit={handleOnSubmitNewRequest} className="w-50">

        <Form.Group as={Row} className="mb-2">
          <Form.Label column sm={2}>
            Description
          </Form.Label>
          <Col sm={10}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Lithium batteries for prototype"
                name = "description"
                value={newRequest.description}
                onChange={handleOnChangeNewRequest}
              />
            </InputGroup>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-2">
          <Form.Label column sm={2}>
            Amount
          </Form.Label>
          <Col sm={10}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="0.01"
                name = "amount"
                value={newRequest.amount}
                onChange={handleOnChangeNewRequest}
              />
              <InputGroup.Text>ether</InputGroup.Text>
            </InputGroup>
          </Col>
        </Form.Group>
        
        <Form.Group as={Row} className="mb-2">
          <Form.Label column sm={2}>
            Recipient
          </Form.Label>
          <Col sm={10}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="0xC9777A8e5a5026EE6a9a4E513Acc3Afd971B400e"
                name = "recipientAddress"
                value={newRequest.recipientAddress}
                onChange={handleOnChangeNewRequest}
              />
            </InputGroup>
          </Col>
        </Form.Group>
        
        <div className="mt-1">
          <LoadingButton 
            buttonTitle="Create"
            buttonVariant="success" 
            buttonType="submit" 
            isLoading={isLoading}
          />
        </div>
             
      </Form>
    </>
  )
}

export default NewRequestForm