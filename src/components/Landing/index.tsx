"use client";

import React, { useState } from "react";
import boolABI from "../../ABI/boolABI.json";
import { writeContract } from "@wagmi/core";

const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
import Web3 from "web3";
const web3 = new Web3();

const Landing: React.FC = () => {
  const contractAddress = "0x47131cc589D96E5C80B51D2B91064A2513DcC917";
  const [boolInputValue, setBoolInputValue]: any = useState("");
  const [whitelistAddress, setWhitelistAddress]: any = useState("");

  if (typeof localStorage !== "undefined") {
    let localData: any = localStorage.getItem("wagmi.store");
    localData = JSON.parse(localData);
    localData = localData?.state?.data?.account;
  }

  const booleanWhitelist = async () => {
    try {
      console.log(whitelistAddress);
      const { hash } = await writeContract({
        address: contractAddress,
        abi: boolABI,
        functionName: "whitelistAddresses",
        args: [whitelistAddress],
      });
    } catch (err: any) {
      alert(err);
    }
  };

  const merkleWhitelist = async () => {
    const leafNodes = whitelistAddress.map((addr: any) => keccak256(addr));
    const merkleTree = await new MerkleTree(leafNodes, keccak256, {
      sortPairs: true,
    });
    const rootHash = merkleTree.getRoot();

    let buf2hex = (x: any) => "0x" + x.toString("hex");
    console.log("Root", buf2hex(merkleTree.getRoot()));
    console.log(merkleTree.toString());
    const arrayIndex = whitelistAddress.indexOf(
      web3.utils.toChecksumAddress(whitelistAddress[0])
    );
    console.log(arrayIndex);

    const _claimingAddress = leafNodes[arrayIndex];

    const hexProof = merkleTree.getHexProof(_claimingAddress);
    console.log("leaf hash", hexProof);
    // this.leafHash = hexProof
    console.log(merkleTree.verify(hexProof, _claimingAddress, rootHash));
    try {
      const { hash } = await writeContract({
        address: contractAddress,
        abi: boolABI,
        functionName: "setMerkleRoot",
        args: [buf2hex(merkleTree.getRoot())],
      });
    } catch (err: any) {
      alert(err);
    }
  };

  const boolVote = async () => {
    try {
      const { hash } = await writeContract({
        address: contractAddress,
        abi: boolABI,
        functionName: "vote",
        args: [],
      });
    } catch (err: any) {
      alert(err);
    }
  };

  const merkleVote = async () => {
    const leafNodes = whitelistAddress.map((addr: any) => keccak256(addr));
    const merkleTree = await new MerkleTree(leafNodes, keccak256, {
      sortPairs: true,
    });
    const arrayIndex = whitelistAddress.indexOf(
      web3.utils.toChecksumAddress(whitelistAddress[0])
    );
    const _claimingAddress = leafNodes[arrayIndex];
    try {
      const { hash } = await writeContract({
        address: contractAddress,
        abi: boolABI,
        functionName: "merkleVote",
        args: [merkleTree.getHexProof(_claimingAddress)],
      });
    } catch (err: any) {
      alert(err);
    }
  };

  const createAccount = async () => {
    let addresses = [];
    addresses.push("0x577b282078912c354b3f4b503c97Bf2770eCe2cC");

    for (let i = 0; i < boolInputValue; i++) {
      const account = web3.eth.accounts.create();
      addresses.push(account.address);
    }

    setWhitelistAddress(addresses);

    // Use the join method to create a comma-separated string
    const dataArray = addresses.join(", ");
    console.log(dataArray);

    setBoolInputValue(dataArray);
  };

  return (
    <div className="flex gap-4 md:gap-12 justify-around p-24">
      <div className="mt-5 flex flex-col gap-4 w-1/4">
        <h1 className="text-amber-700 bg-clip-content p-6  border-4 border-red-700 border-dashed">
          Boolean whitelist{" "}
        </h1>
        <input
          onChange={(e) => setBoolInputValue(e.target.value)}
          className="border-2 border-black rounded-lg		"
          placeholder="Enter num"
          type="text"
        />
        <button
          onClick={createAccount}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Generate Address
        </button>
        <div className="flex gap-4 ">
          <button
            onClick={booleanWhitelist}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Add To whitelist
          </button>
          <button
            onClick={boolVote}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Vote
          </button>
        </div>
        <p className="break-all">Address: {boolInputValue}</p>
      </div>
      <div className="mt-5 gap-4 flex flex-col w-1/4">
        <h1 className="text-green-700 bg-clip-content p-6  border-4 border-green-700 border-dashed">
          Merkle Tree whitelist
        </h1>

        <div className="flex gap-4">
          <button
            onClick={merkleWhitelist}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Add To whitelist
          </button>
          <button
            onClick={merkleVote}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Vote
          </button>
        </div>
        <p className="break-all">Address: {boolInputValue}</p>
      </div>
    </div>
  );
};

export default Landing;
