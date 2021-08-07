// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    address[] public deployedCampaigns; // Addresses of all deployed campaigns

    // deploys a new instance of a Campaign and stores the resulting address
    function createCampaign(uint256 minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    // Return a list of all deployed campaigns
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description; // describes why the request is being cretaed
        uint256 value; // amount of money that the manager wants to the vendor
        address payable recipient; // address that the money will be sent to
        bool complete; // true if the eequest has already been processed (money sent)
        mapping(address => bool) approvals; // track who has voted
        uint256 approvalCount; // track number of approvals
    }

    mapping(uint256 => Request) public requests; // list of requests that the manager has created
    uint256 private resquestsCount = 0; // request index

    address public manager; // address of the person who is managing the fund rising campaign
    uint256 public minimumContribution; // Minimum donation required to be considered a contributor or 'approver'
    mapping(address => bool) public approvers; // list of addresses for every prson who has donated money
    uint256 public approversCount; // numbers of approvers in fund rising campaign

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // Constructor function that sets the minimumContribution and the owner of the contract
    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    // Called when someone wants to donate money to the campaign and become an 'approver'
    function contribute() public payable {
        require(msg.value > minimumContribution);
        if(approvers[msg.sender] == false){
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    // Called by the manager to create a new 'spending request'
    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public restricted {

        Request storage newRequest = requests[resquestsCount];

        // Notes: no need to init approvals mapping property
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;

        resquestsCount++;
    }

    // Called by each contributor to approve a spending request
    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]); // require this approver exist
        require(!request.approvals[msg.sender]); // require this person haven't vote yet

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    // After a request has gotten enough approvals, the manager can call this to get money sent to the vendor
    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2)); // require more than 50% approvals
        require(!request.complete); // require this request is not complete yet

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution, // minimum contribution for campaign
            address(this).balance, // current balance of the campaign (money available in contract)
            resquestsCount, // number of pending requests done by manager for approving a transaction
            approversCount, // number of contributors in campaing
            manager // address of manager of campaign
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return resquestsCount;
    }
}
