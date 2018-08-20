import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { QueryRenderer} from 'react-relay'
import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime'
import config from '../config'
import { buildQuery } from '../apollo/querybuilder'
import graphql from 'graphql-anywhere'

const prepareFetchQuery = token => async (
  operation,
  variables,
) => {
  const response = await fetch(config.graphql_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  })
  const result = await response.json()
  return result
}


export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      environment: undefined,
      result: undefined,
      isLoading: false,
      userInput: 'repos:>5 location:"czech republic" language:"Javascript"'
    }
  }

  handleQueryChange = async (e) => {
    const userInput = e.target.value
    const query = buildQuery(userInput)
    this.setState({userInput, query})
  }

  // handleSubmit = async (e) => {
  //   e.preventDefault()
  // }

  componentDidMount() {
    
    const source = new RecordSource()
    const store = new Store(source)
    const network = Network.create(prepareFetchQuery(this.props.token))

    const environment = new Environment({
      network,
      store,
    })

    this.setState({environment})
  }

  render() {
    if (!this.state.environment) return null
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.userInput}
            onChange={this.handleQueryChange}
            style={{
              width:400,
              height: 30
            }}
          />
          {/* <input type="submit" name="go"/> */}
        </form>
        <QueryRenderer
          environment={this.state.environment}
          query={graphql`
            query SearchQuery($query: String!) { 
              search(type: USER query: $query first:100) {
                userCount
                pageInfo {
                  endCursor
                  hasNextPage
                }
                edges {
                  node {
                    ... on User {
                      login
                      location
                      name
                    }
                  }
                }
              }
            }
          `}
          variables={{query: this.state.userInput}}
          render={({error, props}) => {
            if (error) {
              return <div>Error!</div>
            }
            if (!props) {
              return <div>Loading...</div>
            }
            if (props.search) {
              const list = props.search.edges.map(({node}) => (
                <div key={node.login}>{node.name} ({node.login}), {node.location}</div>
              ))
              return <div>{list}</div>
            }
          }}
        />
      </div>
    )
  }
}

Search.propTypes = {
  token: PropTypes.string.isRequired
}