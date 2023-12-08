// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract VoteWithWhitelist {
    // Mapping of addresses to whether they are whitelisted or not
    mapping(address => bool) public isWhitelisted;

    // Mapping of addresses to the number of votes they have cast
    mapping(address => uint256) public votes;

    // Merkle root hash
    bytes32 public merkleRoot;

    // Event emitted when a vote is cast
    event VoteCasted(address indexed voter);

    // Event emitted when an address is whitelisted
    event Whitelisted(address indexed account);

     function whitelistAddresses(address[] calldata accounts) external  {
        for (uint256 i = 0; i < accounts.length; i++) {
            address account = accounts[i];
            require(account != address(0), "Invalid address");
            isWhitelisted[account] = true;

            emit Whitelisted(account);
        }
    }

    // Cast a vote (only whitelisted addresses can vote)
    function vote() external {
        require(isWhitelisted[msg.sender], "Address is not whitelisted");

        // Increment the vote count for the sender
        votes[msg.sender]++;

        // Emit an event
        emit VoteCasted(msg.sender);
    }

    // Verify if an address is whitelisted based on the Merkle proof
    function verifyWhitelist(bytes32[] calldata proof, address account)
        public
        view
        returns (bool)
    {
        bytes32 leaf = keccak256(abi.encodePacked(account));
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }

    function merkleVote(bytes32[] calldata proof) external {
        bool isWhiteList = verifyWhitelist(proof, msg.sender);
        require(isWhiteList,"Address is not whitelisted"
        );

        // Increment the vote count for the sender
        votes[msg.sender]++;

        // Emit an event
        emit VoteCasted(msg.sender);
    }

    // Set the Merkle root hash
    function setMerkleRoot(bytes32 _merkleRoot) external {
        merkleRoot = _merkleRoot;
    }
}
