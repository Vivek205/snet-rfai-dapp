import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import { useStyles } from "./styles";

//components
import ProgressBar from "../common/ProgressBar";
import StyledButton from "../common/StyledButton";
import AccountBalance from "./AccountBalance";
import Details from "./Details";
import Summary from "./Summary";

class CreateRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: 1,
      progressText: ["Overview", "Details", "Summary"],
      accountBalance: false,
      overViewCompleted: false,
      detailsCompleted: false,
    };
    this.showAccountBalance = this.showAccountBalance.bind(this);
    this.showDetailsContent = this.showDetailsContent.bind(this);
  }

  showAccountBalance = () => {
    this.setState({ accountBalance: true });
  };

  showDetailsContent = () => {
    this.setState({
      overViewCompleted: true,
      activeSection: 2,
    });
  };

  showSummaryContent = () => {
    this.setState({
      detailsCompleted: true,
      activeSection: 3,
    });
  };

  render() {
    const { classes } = this.props;
    const { progressText, accountBalance, overViewCompleted, detailsCompleted, activeSection } = this.state;

    return (
      <Grid container spacing={24} className={classes.createRequestMainContainer}>
        <Grid item xs={12} sm={12} md={8} lg={8} className={classes.createRequestContainer}>
          <h3>Create Request</h3>
          <ProgressBar activeSection={activeSection} progressText={progressText} />
          {overViewCompleted ? (
            <Details showSummaryContent={this.showSummaryContent} />
          ) : detailsCompleted ? (
            <Summary />
          ) : (
            <div className={classes.createRequestContent}>
              <Typography>
                You can request for any AI Service that would like to see built on top of the SingularityNet platform.
                Requests should be detailed enough to allow discussion and development. Requests accepted by the
                foundation will be raised as a github pull request to the RFAI repository.
              </Typography>
              <span>
                We would like to have an objective and measurable acceptance criteria (get accuracy above X% of this
                data, etc).
              </span>
              <ul>
                <p>The foundation will review all requests and will approve them. In general we look for</p>
                <li>* Clear problem description</li>
                <li>* Relevant problem which if solved will help the community</li>
                <li>* Quantitative evaluation criteria</li>
                <li>* Provide a title and description along with acceptance criteria</li>
              </ul>
              <StyledButton
                btnText={accountBalance ? "continue" : "connect metamask"}
                onClick={accountBalance ? this.showDetailsContent : this.showAccountBalance}
                type="blue"
              />
            </div>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} className={classes.accountBalanceContainer}>
          <h3>Account Balance</h3>
          {accountBalance ? (
            <AccountBalance />
          ) : (
            <div className={classes.warningBox}>
              <span>You need Metamask wallet to create requests.</span>
              <Typography>
                Please Login or Install to your Metamask wallet account and connect to SingularityNet.{" "}
              </Typography>
              <Typography>
                <a href="#">Click here </a>to install and learn more about how to use Metamask and your AGI credits with
                SinguarlityNet AI Marketplace.
              </Typography>
            </div>
          )}
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(useStyles)(CreateRequest);
