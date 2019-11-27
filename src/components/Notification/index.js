import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";

import { useStyles } from "./styles";
import { metamaskActions } from "../../Redux/actionCreators";
import { tokenActions } from "../../Redux/actionCreators";
import { rfaiContractActions } from "../../Redux/actionCreators";

import NotificationBar, { notificationBarTypes } from "../common/NotificationBar";
import NotificationIcon from "@material-ui/icons/Warning";

import { NetworkNames } from "../../utility/constants/NetworkNames";
import { toChecksumAddress } from "../../utility/GenHelperFunctions";

class Notification extends Component {
  connectMetamask = async () => {
    const { updateMetamaskDetails } = this.props;

    if (window.ethereum) {
      try {
        const ethereum = window.ethereum;
        window.web3 = new window.Web3(ethereum);

        // Enable Metamask for this Web Site
        //const accounts = await ethereum.enable();
        await ethereum.enable();

        window.web3.version.getNetwork(async (err, netId) => {
          const isTxnsAllowed =
            Boolean(window.web3.eth.defaultAccount) && netId.toString() === process.env.REACT_APP_ETH_NETWORK;
          await updateMetamaskDetails(
            Boolean(window.web3.eth.defaultAccount),
            toChecksumAddress(window.web3.eth.defaultAccount),
            netId,
            isTxnsAllowed
          );
        });

        // Subscribe to Metamask after connection
        this.subscribeToMetamask();
      } catch (error) {
        // User denied account access...
        updateMetamaskDetails(false, "0x0", 0, false);
      }
    }
  };

  subscribeToMetamask = () => {
    const { updateMetamaskDetails } = this.props;
    if (window.ethereum) {
      const ethereum = window.ethereum;
      window.web3 = new window.Web3(ethereum);

      try {
        window.web3.currentProvider.publicConfigStore.on("update", () => {
          window.web3.version.getNetwork(async (err, netId) => {
            const isTxnsAllowed =
              Boolean(window.web3.eth.defaultAccount) && netId.toString() === process.env.REACT_APP_ETH_NETWORK;
            await updateMetamaskDetails(
              Boolean(window.web3.eth.defaultAccount),
              toChecksumAddress(window.web3.eth.defaultAccount),
              netId,
              isTxnsAllowed
            );
          });
        });
      } catch (error) {
        // User denied account access...
        updateMetamaskDetails(false, "0x0", 0, false);
      }
    }
  };

  loadMetamaskDetails = () => {
    const {
      metamaskDetails,
      updateMetamaskDetails,
      updateTokenBalance,
      updateTokenAllowance,
      updateRFAITokenBalance,
      isLoggedIn,
    } = this.props;

    if (!isLoggedIn) {
      updateMetamaskDetails(false, "0x0", 0, false);
      return;
    }

    if (window.ethereum) {
      const ethereum = window.ethereum;
      window.web3 = new window.Web3(ethereum);

      try {
        window.web3.version.getNetwork(async (err, netId) => {
          const isTxnsAllowed =
            Boolean(window.web3.eth.defaultAccount) && netId.toString() === process.env.REACT_APP_ETH_NETWORK;
          await updateMetamaskDetails(
            Boolean(window.web3.eth.defaultAccount),
            toChecksumAddress(window.web3.eth.defaultAccount),
            netId,
            isTxnsAllowed
          );

          // Subscribe to Metamask for the connection already exists
          this.subscribeToMetamask();

          await updateTokenBalance(metamaskDetails);
          await updateTokenAllowance(metamaskDetails);
          await updateRFAITokenBalance(metamaskDetails);
        });
      } catch (error) {
        // User denied account access...
        updateMetamaskDetails(false, "0x0", 0, false);
      }
    }
  };

  generateNotificationMessage = () => {
    const { metamaskDetails, isLoggedIn } = this.props;

    var message = "";

    if (!isLoggedIn) {
      message = "User need to login to the RFAI DApp.";
      return message;
    }

    const networkName = NetworkNames.find(nw => nw.networkId.toString() === process.env.REACT_APP_ETH_NETWORK)
      .networkName;

    if (window.ethereum) {
      if (!metamaskDetails.isConnected) {
        message = (
          <span>
            Click to connect with Metamask <button onClick={this.connectMetamask}>Connect</button>
          </span>
        );
      } else if (metamaskDetails.networkId !== process.env.REACT_APP_ETH_NETWORK) {
        message = "Metamask needs to be connected to network " + networkName;
      } else if (metamaskDetails.account === null || metamaskDetails.account === "0x0") {
        message = "Click to connect with Metamask";
      } else {
        message = "Metamask connected successfully " + networkName;
      }
    } else {
      message = "Need to have Metamask enabled browser";
    }

    return message;
  };

  componentDidMount = async () => {
    await this.loadMetamaskDetails();
  };

  render() {
    const { metamaskDetails, isLoggedIn } = this.props;
    const message = this.generateNotificationMessage();

    // Metamask Notifications should be shown only after user is loggedIn
    let showNotificationBar = false;
    if (isLoggedIn && !metamaskDetails.isTxnsAllowed) showNotificationBar = true;

    return (
      <NotificationBar
        type={notificationBarTypes.WARNING}
        message={message}
        icon={NotificationIcon}
        showNotification={showNotificationBar}
        buttonClick={this.connectMetamask}
      />
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.userReducer.login.isLoggedIn,
  metamaskDetails: state.metamaskReducer.metamaskDetails,
});

const mapDispatchToProps = dispatch => ({
  updateMetamaskDetails: (isConnected, account, networkId, isTxnsAllowed) =>
    dispatch(metamaskActions.updateMetamaskDetails(isConnected, account, networkId, isTxnsAllowed)),
  updateTokenBalance: metamaskDetails => dispatch(tokenActions.updateTokenBalance(metamaskDetails)),
  updateTokenAllowance: metamaskDetails => dispatch(tokenActions.updateTokenAllowance(metamaskDetails)),
  updateRFAITokenBalance: metamaskDetails => dispatch(rfaiContractActions.updateRFAITokenBalance(metamaskDetails)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(useStyles)(Notification));
