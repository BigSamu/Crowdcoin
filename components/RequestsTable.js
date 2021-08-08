import React, {useState} from 'react'
import { useRouter } from 'next/router'

import {Table, Alert} from 'react-bootstrap';

import LoadingButton from './LoadingButton'

import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3';

const RequestsTable = (props) => {

  const { campaignAddress, requests, approversCount } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingApproveArray, setIsLoadingApproveArray] = useState(Array(parseInt(requests.length)).fill(false));
  const [isLoadingFinalizeArray, setIsLoadingFinalizeArray] = useState(Array(parseInt(requests.length)).fill(false));
  

  const [errorMessages, setErrorMessages] = useState('');
  const [isSuccesfulApprove, setIsSuccesfulApprove] = useState(false);
  const [isSuccesfulFinalize, setIsSuccesfulFinalize] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState('');
  
  const router = useRouter();

  const handleApproveRequest = async (e, requestId) => {
    
    let campaign = Campaign(campaignAddress);
    let auxIsLoadingApproveArray = [...isLoadingApproveArray]
    
    setIsSuccesfulApprove(false);
    auxIsLoadingApproveArray[requestId] = true;
    setIsLoadingApproveArray(auxIsLoadingApproveArray);
    setIsLoading(true);
    setErrorMessages('');
    
    try {
      let accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(requestId).send({
        from: accounts[0]
      });
      setIsSuccesfulApprove(true);

    } catch (err) {
      setIsSuccesfulApprove(false);
      setErrorMessages(err.message);
    }

    auxIsLoadingApproveArray[requestId] = false;
    setIsLoadingApproveArray(auxIsLoadingApproveArray);
    setIsLoading(false);

    setCurrentRequestId(requestId);
    
    router.replace(`/campaigns/${campaignAddress}/requests`)
  }

  const handleFinalizeRequest = async (e, requestId) => {
    
    let campaign = Campaign(campaignAddress);
    let auxIsLoadingFinalizeArray = [...isLoadingFinalizeArray]
    
    setIsSuccesfulFinalize(false);
    setIsSuccesfulApprove(false);
    auxIsLoadingFinalizeArray[requestId] = true;
    setIsLoadingFinalizeArray(auxIsLoadingFinalizeArray);
    setIsLoading(true);
    setErrorMessages('');
    
    try {
      let accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(requestId).send({
        from: accounts[0]
      });
      setIsSuccesfulFinalize(true);

    } catch (err) {
      setIsSuccesfulFinalize(false);
      setErrorMessages(err.message);
    }

    auxIsLoadingFinalizeArray[requestId] = false;
    setIsLoadingFinalizeArray(auxIsLoadingFinalizeArray);
    setIsLoading(false);

    setCurrentRequestId(requestId);
    
    router.replace(`/campaigns/${campaignAddress}/requests`)
  }

  return (
    <>
      {errorMessages !== '' ? (
        <Alert variant="danger">
          <Alert.Heading as="h5"> Error</Alert.Heading>
          <small className="my-0">{errorMessages}</small>
        </Alert>
      ) : (
        ''
      )}
      {isSuccesfulApprove && !isLoading ? (
        <Alert variant="success">
          <Alert.Heading as="h5"> Great!</Alert.Heading>
          <small className="my-0"> Request # {currentRequestId} receive your approval!</small>
        </Alert>
      ) : (
        ''
      )}
      {isSuccesfulFinalize && !isLoading ? (
        <Alert variant="success">
          <Alert.Heading as="h5"> Great!</Alert.Heading>
          <small className="my-0"> Request # {currentRequestId} has been finalize! Funds transfered</small>
        </Alert>
      ) : (
        ''
      )}

      <Table bordered size="sm">
        <thead className="align-middle">
          <tr className="table-secondary">
            <th className="text-center">ID</th>
            <th>Description</th>
            <th className="text-center">Amount (Ether)</th>
            <th>Recipient</th>
            <th className="text-center">Approval Count</th>
            <th className="text-center">Actions</th>
            <th className="text-center">Status</th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {
            requests && requests.map((request,index) => 
              <tr key={index} className={request.complete ? "table-warning" : ""}>
                <td className="text-center">{index+1}</td>
                <td>{request.description}</td>
                <td className="text-center">{web3.utils.fromWei(request.value, 'ether')}</td>
                <td>{request.recipient}</td>
                <td className="text-center">{request.approvalCount}/{approversCount}</td>
                <td className="text-center">
                  
                  <div className="mx-1">
                    <LoadingButton 
                      buttonTitle="Approve"
                      buttonVariant="outline-success" 
                      buttonType="button" 
                      isLoading={isLoadingApproveArray[index]}
                      buttonDisabled = {request.complete}
                      buttonSize="sm"
                      nonPaddingY = {true}
                      callback = {(e) => {handleApproveRequest(e, index)}}
                    />
                  </div>

                  <div className="mx-1">
                    <LoadingButton 
                      buttonTitle="Finalize"
                      buttonVariant="outline-danger" 
                      buttonType="button" 
                      isLoading={isLoadingFinalizeArray[index]}
                      buttonDisabled = {request.complete}
                      buttonSize="sm"
                      nonPaddingY = {true}
                      callback = {(e) => {handleFinalizeRequest(e, index)}}
                    />
                  </div>
                 
                </td>
                <td className="text-center"> {request.complete ? "Complete" : "Waiting Approval"}</td>
              </tr>
            )
          }
        </tbody>
      </Table>
    </>
  )
}

export default RequestsTable
