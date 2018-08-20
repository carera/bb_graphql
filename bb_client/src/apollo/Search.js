import React, { Component } from 'react'
import ApolloClient from "apollo-client"
import gql from "graphql-tag"
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { buildQuery } from './querybuilder'
import config from '../config'
import PropTypes from 'prop-types'

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      result: undefined,
      isLoading: false,
      query: 'repos:>5 location:"czech republic" language:"Javascript"'
    }

    const httpLink = new HttpLink({
      uri: config.graphql_url,
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      }
    })

    this.client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache()
    })
  }

  handleQueryChange = (e) => {
    this.setState({query: e.target.value})
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.setState({
      isLoading: true,
      result: undefined
    })
    const query = buildQuery(this.state.query)
    const result = await this.client
    .query({
      query: gql(query)
    })
    if (result.data) {
      this.setState({result: result.data.search.edges})
    }
    this.setState({isLoading: false})
  }


  renderResult() {
    if (!this.state.result) {
      return null
    }
    return this.state.result.map(({node}) => (
      <div key={node.login}>{node.name} ({node.login}), {node.location}</div>
    ))
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.query}
            onChange={this.handleQueryChange}
            style={{
              width:400,
              height: 30
            }}
          />
          <input type="submit" name="go"/>
        </form>
        <div>
          {this.state.isLoading && 'Loading...'}
        </div>
        <div>
          {this.renderResult()}
        </div>
      </div>
    )
  }
}

Search.propTypes = {
  token: PropTypes.string
}