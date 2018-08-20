# BlueBerry GraphQL Assignment

A proof-of-concept that demonstrates tapping into GitHub graphQL using two different libraries. The purpose is to show how would one use Apollo or Relay libraries. It is not intended for production purposes at all as the codebase is not secure and the application is highly unstable.

### Apollo

Can be enabled by uncommenting `ApolloSearch` component in `./src/App.js`

GraphQL request is triggered upon hitting `Submit` button.

### Relay

Can be enabled by uncommenting `RelaySearch` component in `./src/App.js`

To obtain GitHub schema when it changes, run

    AUTH_TOKEN=<github-auth-token> yarn run get-schema

To regenerate schemas when query structures change, run

    yarn run relay

GraphQL request is triggered upon chaging the text in input field.

## TODOs and palces for improvement

### Test coverage
- Currently the codebase contains no tests
- At least business logic (query-builder) should be tested and basic react-component tests that cover full, empty, and error states would be worthwhile 
### User input validation
- User can now easily crash application by entering corrupt query
- We should also tell user that the query is either invalid or it returned 0 results
### "Componentization" and better structured code
- Currently both Apollo and Relay implementations are squeezed into single components. Both view and graphQL handling is in one place, making it hard to read.
- Also, the current state does not allow easy component-testing as the components are tightly coupled with Relay and Apollo libraries.
### Error handling
- App should not crash and user should be notified about errors around github authentication and graphQL error results and should allow to recover from these.
### Security
- Currently, as the app is client-only, the secrets (client_id, client_secret, username and password) are stored inside the codebase. This should be prevented by providing a backend-proxy that hides these from client.
- It would also be worth considering allowing the user to log in with his/her own GitHub account using GitHub OAuth flow, e.g. for identity audit purposes, or simply to avoid "non-person" account as man in the middle providing the data.
### Configuration
- Currently the app contains a hardcoded `config.js` file that needs to be filled in before running. This makes it harder to handle as the file is versioned. A local configuration overriding or a more sophisticated approach (e.g. Vault) recommended.


## Installation

    yarn

## Run

Open `src/config.js` and fill in `auth_client_id`, `auth_client_secret`, and `auth_base64_credentials` values

After that, run:

    yarn start

## Test

No tests :(