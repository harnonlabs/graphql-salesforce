const axios = require('axios')
const { queryGraphQL } = require('../queryGraphQl/index')
const { decryptSecret } = require('../serverSecurity/security')

const hasCredentials = async (objectToken) => {
  // get token for this platform
  const options = {
    headers: {
      Authorization: `Bearer ${objectToken.accessToken}`,
    },
  }
  const requestBody = {
    query: `
              query
              {
                tokenByPlatform(ID: "${objectToken.id}") {
                  key
                }
              } 
          `,
  }
  const { data } = await queryGraphQL(requestBody, options)
  if (!data) throw new Error('Token is not valid')
  if (data.data.tokenByPlatform === null)
    throw new Error("Connection doesn't exist")
  const key = await data.data.tokenByPlatform.key
  const result = await decryptSecret(key)
  const accessToken = result.access_token
  return {
    accessToken,
    userToken: objectToken.accessToken,
    connectionId: objectToken.id,
    urlBase: result.instance_url,
  }
}

module.exports = {
  Query: {
    opportunities: async (_, { startDate, endDate }, { dataSources }) => {
      const dataSecurity = await hasCredentials(
        dataSources.salesforce.context.accessToken
      )
      const opportunities = await dataSources.salesforce.opportunities(
        dataSecurity.accessToken,
        dataSecurity.userToken,
        dataSecurity.connectionId,
        startDate,
        endDate,
        dataSecurity.urlBase
      )
      return opportunities
    },
  },
}
