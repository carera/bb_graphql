
export const buildQuery = (query) => {
  const q = query.replace(/"/g, '\\"')
  return `
    query { 
      viewer { 
        login
      }
      search(type: USER query:"${q}" first: 100) {
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
  `
}