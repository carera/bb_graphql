import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime'
import config from '../config'

const fetchQuery = async (
  operation,
  variables,
) => {
  const response = await fetch(config.graphql_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',

    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  })
  const result = await response.json()
  return result
}

const source = new RecordSource()
const store = new Store(source)
const network = Network.create(fetchQuery)

const environment = new Environment({
  network,
  store,
})

export default environment