import React, {useState} from 'react'
import { useRouter } from 'next/router'

import {Button, Table} from 'react-bootstrap';

import LoadingButton from './LoadingButton'

import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3';

const RequestsTable = (props) => {

  const { campaignAddress, requests, approversCount } = props;

  const [isLoadingApproveArray, setIsLoadingApproveArray] = useState(Array(parseInt(requests.length)).fill(false));
  const [isLoadingFinalizeArray, setIsLoadingFinalizeArray] = useState(Array(parseInt(requests.length)).fill(false));

  const [errorMessages, setErrorMessages] = useState('');
  const [isSuccesful, setIsSuccesful] = useState(false);
  
  const router = useRouter();

  const handleApproveRequest = async (e, requestId) => {
    
    let campaign = Campaign(campaignAddress);
    let auxIsLoadingApproveArray = [...isLoadingApproveArray]
    
    auxIsLoadingApproveArray[requestId] = true;
    setIsLoadingApproveArray(auxIsLoadingApproveArray)
    
    try {
      let accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(requestId).send({
        from: accounts[0]
      });
      setIsSuccesful(true);

    } catch (err) {
      setIsSuccesful(false);
      setErrorMessages(err.message);
    }

    auxIsLoadingApproveArray[requestId] = false;
    setIsLoadingApproveArray(auxIsLoadingApproveArray)
    
    router.replace(`/campaigns/${campaignAddress}/requests`)
  }

  const handleFinalizeRequest = async (e, requestId) => {
    
    let campaign = Campaign(campaignAddress);
    let auxIsLoadingFinalizeArray = [...isLoadingFinalizeArray]
    
    auxIsLoadingFinalizeArray[requestId] = true;
    setIsLoadingFinalizeArray(auxIsLoadingFinalizeArray)
    
    try {
      let accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(requestId).send({
        from: accounts[0]
      });
      setIsSuccesful(true);

    } catch (err) {
      setIsSuccesful(false);
      setErrorMessages(err.message);
    }

    auxIsLoadingFinalizeArray[requestId] = false;
    setIsLoadingFinalizeArray(auxIsLoadingFinalizeArray)
    
    router.replace(`/campaigns/${campaignAddress}/requests`)
  }

  return (
    <>
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
              <tr key={index} className={request.complete ? "table-success" : ""}>
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
