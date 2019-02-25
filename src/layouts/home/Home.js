import React, { Component } from 'react'
import PropTypes from 'prop-types'

// import components
import LandingPage from './components/LandingPage'
import RequestList from './components/RequestList'
import RequestsTab from './components/RequestsTab'
import CreateRequest from './components/CreateRequest'
import MyAccount from './components/MyAccount'
import Administration from './components/Administration'

class Home extends Component {

  constructor(props, context) {
    super(props)

    this.contracts = context.drizzle.contracts

    this.handleHomeButton = this.handleHomeButton.bind(this)
    
    this.handleCreateRequest= this.handleCreateRequest.bind(this)
    this.handleAdmin= this.handleAdmin.bind(this)
    this.handleAccount= this.handleAccount.bind(this)
    this.handleViewRequest = this.handleViewRequest.bind(this)


    this.state = {
      showLandingPage: true,
      showViewPage: false,
      readonly: true,
      currentViewPage: 'ViewRequests'
    }

  }

  handleHomeButton() {
    //this.setState({ showLandingPage: true, showViewPage: false })
  }

  handleCreateRequest() {
    //this.setState({ showLandingPage: false, showViewPage: true })
    this.setState({currentViewPage: 'CreateRequests'})
  }
  handleAdmin() {
    //this.setState({ showLandingPage: false, showViewPage: true })
    this.setState({currentViewPage: 'Admin'})
  }
  handleAccount() {
    //this.setState({ showLandingPage: false, showViewPage: true })
    this.setState({currentViewPage: 'Account'})
  }
  handleViewRequest() {
    //this.setState({ showLandingPage: false, showViewPage: true })
    this.setState({currentViewPage: 'ViewRequests'})
  }

  renderContextComponent() {
    if(this.state.currentViewPage === 'CreateRequests') {
      return(
        <div className="main-content"><CreateRequest /></div>
      )
    }
    if(this.state.currentViewPage === 'Admin') {
      return(
        <div className="main-content"><Administration /></div>
      )
    }
    if(this.state.currentViewPage === 'Account') {
      return(
        <div className="main-content"><MyAccount /></div>
      )
    }
    if(this.state.currentViewPage === 'ViewRequests') {
      return(
        <div className="main-content"><RequestsTab /></div>
      )
    }
  }

  render() {

    return (
      <main >
        <LandingPage handleCreateRequest={this.handleCreateRequest} handleAdmin={this.handleAdmin} handleAccount={this.handleAccount} handlerViewPage={this.handleViewRequest} />
        {/* The following component is only for Temp Transfers during testing */}
        {/* <RequestList />  */}
        { /*
        { this.state.showViewPage === true && <div className="main-content"><RequestsTab /></div>}
        */ }

        {this.renderContextComponent()}

      </main>
    )
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object
}

export default Home
