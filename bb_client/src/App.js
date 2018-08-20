import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

import ApolloSearch from './apollo/Search'
// import RelaySearch from './relay/Search'
import config from './config'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      token: ''
    }
  }

  async componentDidMount() {
    const fingerprint = Math.random()
    const url = `${config.auth_url}/${config.auth_client_id}/${fingerprint}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + config.auth_base64_credentials
      },
      body: JSON.stringify({
        client_secret: config.auth_client_secret,
        scopes: config.auth_scopes,
        note: 'bb'
      })
    })
    const result = await response.json()
    const token = result.token
    this.setState({token, isLoading: false})
  }

  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">GitHub user search</h1>
        </header>
        <ApolloSearch token={this.state.token}/>
        {/* <RelaySearch token={this.state.token}/> */}
      </div>
    )
  }
}

export default App
