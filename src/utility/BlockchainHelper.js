import Web3 from "web3";
import rfai from "../config/ServiceRequest.json";
import tokenABI from "singularitynet-token-contracts/abi/SingularityNetToken.json";
import tokenNetworks from "singularitynet-token-contracts/networks/SingularityNetToken.json";

export const waitForTransaction = async hash => {
  let receipt;

  const ethereum = window.ethereum;
  window.web3 = new window.Web3(ethereum);
  const web3 = new Web3(window.web3.currentProvider);

  while (!receipt) {
    // eslint-disable-next-line no-await-in-loop
    try {
      receipt = await web3.eth.getTransactionReceipt(hash);
      //console.log(" receipt - ", receipt);
    } catch (error) {
      // Do Nothing
      //console.log("error - ", error);
    }
  }

  return new Promise((resolve, reject) => {
    if (!receipt.status) {
      reject(receipt);
    }
    resolve(receipt);
  });
};

export const approveToken = (metamaskDetails, amount) => {
  const tokenContractAddress = getTokenContractAddress();
  const rfaiContractAddress = getRFAIContractAddress();
  const accountAddress = metamaskDetails.account;

  const ethereum = window.ethereum;
  window.web3 = new window.Web3(ethereum);

  const tokenInstance = window.web3.eth.contract(tokenABI).at(tokenContractAddress);

  return new Promise(async (resolve, reject) => {
    await tokenInstance.approve(rfaiContractAddress, amount, { from: accountAddress }, (err, hash) => {
      if (err) {
        reject(hash);
      }
      resolve(hash);
    });
  });
};

export const depositTokenToEscrow = (metamaskDetails, amount) => {
  const rfaiContractAddress = getRFAIContractAddress();
  const accountAddress = metamaskDetails.account;

  const ethereum = window.ethereum;
  window.web3 = new window.Web3(ethereum);

  const rfaiInstance = window.web3.eth.contract(rfai.abi).at(rfaiContractAddress);

  return new Promise(async (resolve, reject) => {
    await rfaiInstance.deposit(amount, { from: accountAddress }, (err, hash) => {
      if (err) {
        reject(hash);
      }
      resolve(hash);
    });
  });
};

export const withdrawTokenFromEscrow = (metamaskDetails, amount) => {
  const rfaiContractAddress = getRFAIContractAddress();
  const accountAddress = metamaskDetails.account;

  const ethereum = window.ethereum;
  window.web3 = new window.Web3(ethereum);

  const rfaiInstance = window.web3.eth.contract(rfai.abi).at(rfaiContractAddress);

  return new Promise(async (resolve, reject) => {
    await rfaiInstance.withdraw(amount, { from: accountAddress }, (err, hash) => {
      if (err) {
        reject(hash);
      }
      resolve(hash);
    });
  });
};

export const createRequest = (metamaskDetails, initialStakeBN, expiration, docURIinBytes) => {
  const rfaiContractAddress = getRFAIContractAddress();
  const accountAddress = metamaskDetails.account;

  const ethereum = window.ethereum;
  window.web3 = new window.Web3(ethereum);

  const rfaiInstance = window.web3.eth.contract(rfai.abi).at(rfaiContractAddress);

  return new Promise(async (resolve, reject) => {
    await rfaiInstance.createRequest(
      initialStakeBN.toString(),
      expiration,
      docURIinBytes,
      { from: accountAddress },
      (err, hash) => {
        if (err) {
          reject(hash);
        }
        resolve(hash);
      }
    );
  });
};

export const submitSolutionForRequest = (metamaskDetails, requestId, docURIinBytes) => {
  const rfaiContractAddress = getRFAIContractAddress();
  const accountAddress = metamaskDetails.account;

  const ethereum = window.ethereum;
  window.web3 = new window.Web3(ethereum);

  const rfaiInstance = window.web3.eth.contract(rfai.abi).at(rfaiContractAddress);

  return new Promise(async (resolve, reject) => {
    await rfaiInstance.createOrUpdateSolutionProposal(
      requestId,
      docURIinBytes,
      { from: accountAddress },
      (err, hash) => {
        if (err) {
          reject(hash);
        }
        resolve(hash);
      }
    );
  });
};

export const stakeForRequest = (metamaskDetails, requestId, stakeAmountBN) => {
  const rfaiContractAddress = getRFAIContractAddress();
  const accountAddress = metamaskDetails.account;

  const ethereum = window.ethereum;
  window.web3 = new window.Web3(ethereum);

  const rfaiInstance = window.web3.eth.contract(rfai.abi).at(rfaiContractAddress);

  return new Promise(async (resolve, reject) => {
    await rfaiInstance.addFundsToRequest(requestId, stakeAmountBN.toString(), { from: accountAddress }, (err, hash) => {
      if (err) {
        reject(hash);
      }
      resolve(hash);
    });
  });
};

export const voteForRequest = (metamaskDetails, requestId, votedForSubmitter) => {
  const rfaiContractAddress = getRFAIContractAddress();
  const accountAddress = metamaskDetails.account;

  const ethereum = window.ethereum;
  window.web3 = new window.Web3(ethereum);

  const rfaiInstance = window.web3.eth.contract(rfai.abi).at(rfaiContractAddress);

  return new Promise(async (resolve, reject) => {
    await rfaiInstance.vote(requestId, votedForSubmitter, { from: accountAddress }, (err, hash) => {
      if (err) {
        reject(hash);
      }
      resolve(hash);
    });
  });
};

export const claimRequest = (metamaskDetails, requestId) => {
  const rfaiContractAddress = getRFAIContractAddress();
  const accountAddress = metamaskDetails.account;

  const ethereum = window.ethereum;
  window.web3 = new window.Web3(ethereum);

  const rfaiInstance = window.web3.eth.contract(rfai.abi).at(rfaiContractAddress);

  return new Promise(async (resolve, reject) => {
    await rfaiInstance.requestClaim(requestId, { from: accountAddress }, (err, hash) => {
      if (err) {
        reject(hash);
      }
      resolve(hash);
    });
  });
};

export const claimBackRequest = (metamaskDetails, requestId) => {
  const rfaiContractAddress = getRFAIContractAddress();
  const accountAddress = metamaskDetails.account;

  const ethereum = window.ethereum;
  window.web3 = new window.Web3(ethereum);

  const rfaiInstance = window.web3.eth.contract(rfai.abi).at(rfaiContractAddress);

  return new Promise(async (resolve, reject) => {
    await rfaiInstance.requestClaimBack(requestId, { from: accountAddress }, (err, hash) => {
      if (err) {
        reject(hash);
      }
      resolve(hash);
    });
  });
};

export const getBlockNumber = () => {
  const ethereum = window.ethereum;
  window.web3 = new window.Web3(ethereum);

  // Return the Block Number
  return new Promise(async (reject, resolve) => {
    await window.web3.eth.getBlockNumber((err, blockNumber) => {
      if (err) {
        resolve(err);
      }
      resolve(blockNumber);
    });
  });
};

const getRFAIContractAddress = () => {
  return rfai.networks[process.env.REACT_APP_ETH_NETWORK].address;
};

const getTokenContractAddress = () => {
  return tokenNetworks[process.env.REACT_APP_ETH_NETWORK].address;
};
