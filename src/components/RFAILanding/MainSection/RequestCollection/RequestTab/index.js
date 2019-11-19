import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/styles";

// Request Tabs Functionality
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { useStyles } from "./styles";
import RequestListView from "../RequestListView";
import { requestActions } from "../../../../../Redux/actionCreators";

class RequestTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 1,
      myRequestsFlag: false,
    };
  }

  componentDidMount = async () => {
    const { fetchRequestData } = this.props;

    // Need to set this value as per the Default Tab - Active
    const requestStatus = 1;
    await fetchRequestData(requestStatus);
  };

  handleChange = async (event, value) => {
    const { fetchRequestData } = this.props;
    this.setState({ selectedTab: value });
    const requestStatus = 1;
    await fetchRequestData(requestStatus);
  };

  render() {
    const { foundationMembers, metamaskDetails, requestDetails, requestSummary, classes } = this.props;
    const { selectedTab } = this.state;

    // eslint-disable-next-line no-unused-vars
    var isFoundationMember = false;

    if (metamaskDetails.isTxnsAllowed && Object.entries(foundationMembers).length > 0) {
      const mems = foundationMembers.filter(
        mem => mem.member_address.toLowerCase() === metamaskDetails.account.toLowerCase() && mem.active
      );
      if (mems.length > 0) isFoundationMember = true;
    }

    return (
      <Grid container spacing={24} className={classes.requestTabMainContainer}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <AppBar position="static" color="default" className={classes.header}>
            <Tabs value={selectedTab} onChange={this.handleChange} indicatorColor="primary" textColor="primary">
              {/* ---TBD--- {this.state.isFoundationMember === true && <Tab className="singularity-tab" label="Rejected" value={4}/> } */}
              <Tab className="singularity-tab" label={"Pending(" + requestSummary.Open + ")"} value={0} /> {/** Open */}
              <Tab className="singularity-tab" label={"Active(" + requestSummary.Active + ")"} value={1} />{" "}
              {/** Approved */}
              <Tab className="singularity-tab" label="Solution Vote" value={2} /> {/** Evaluation Phase*/}
              <Tab className="singularity-tab" label={"Completed(" + requestSummary.Completed + ")"} value={3} />{" "}
              {/** Completed */}
              <Tab className="singularity-tab" label={"In Complete(" + requestSummary.Expired + ")"} value={5} />{" "}
              {/** Expired */}
              <Tab className="singularity-tab" label="Closed" value={4} /> {/** Closed / Rejected */}
            </Tabs>
            <div className={classes.checkboxContainer}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.myRequestsFlag}
                    onChange={() => this.setState({ myRequestsFlag: !this.state.myRequestsFlag })}
                    color="primary"
                    disabled={metamaskDetails.isTxnsAllowed ? false : true}
                  />
                }
                label="Show my requests only"
              />
            </div>
          </AppBar>

          {selectedTab === 0 && (
            <Typography component="div" className={classes.requestTabDetailContainer}>
              <RequestListView requestListData={requestDetails} loading={true} />
            </Typography>
          )}
          {selectedTab === 1 && (
            <Typography component="div" className={classes.requestTabDetailContainer}>
              <RequestListView requestListData={requestDetails} loading={true} />
            </Typography>
          )}
          {selectedTab === 2 && (
            <Typography component="div" className={classes.requestTabDetailContainer}>
              <RequestListView requestListData={requestDetails} />
            </Typography>
          )}
          {selectedTab === 3 && (
            <Typography component="div" className={classes.requestTabDetailContainer}>
              <RequestListView requestListData={requestDetails} />
            </Typography>
          )}
          {/* {selectedTab === 4 && this.state.isFoundationMember === true && <Typography component="div" className={classes.requestTabDetailContainer} ><RequestListV2  compRequestStatus="2"/> </Typography>} */}
          {selectedTab === 5 && (
            <Typography component="div" className={classes.requestTabDetailContainer}>
              <RequestListView requestListData={requestDetails} />
            </Typography>
          )}
          {selectedTab === 6 && (
            <Typography component="div" className={classes.requestTabDetailContainer}>
              <RequestListView requestListData={requestDetails} />
            </Typography>
          )}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  requestDetails: state.requestReducer.requestDetails,
  foundationMembers: state.requestReducer.foundationMembers,
  metamaskDetails: state.metamaskReducer.metamaskDetails,
});

const mapDispatchToProps = dispatch => ({
  fetchRequestData: requestStatus => dispatch(requestActions.fetchRequestData(requestStatus)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(useStyles)(RequestTab));
