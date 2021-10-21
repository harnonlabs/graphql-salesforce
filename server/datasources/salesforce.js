const { RESTDataSource } = require('apollo-datasource-rest')
const axios = require('axios')
require('dotenv').config()
const { paginateCampaigns } = require('../resolvers/merge')
const { refreshToken } = require('../serverSecurity/refreshtoken')
const { decryptSecret } = require('../serverSecurity/security')

class HubspotAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = ''
  }

  // Refresh Token
  async getDataUsingRefreshToken(
    connectionId,
    userToken,
    query,
    baseURL,
    body
  ) {
    let response
    const getAccessToken = await refreshToken(connectionId, userToken)
    const url = `${baseURL}${query}`
    const accessTokenDecrypt = await decryptSecret(getAccessToken)
    const options = {
      headers: {
        Authorization: `Bearer ${accessTokenDecrypt.access_token}`,
      },
    }
    if (body) {
      response = await axios.post(url, body, options).then((res) => res.data)
    } else {
      response = await axios.get(url, options).then((result) => result.data)
    }

    let responseObject = {
      result: response,
      token: accessTokenDecrypt.access_token,
    }
    return responseObject
  }

  async opportunities(
    token,
    userToken,
    connectionId,
    startDate,
    endDate,
    urlBase
  ) {
    let response, messageError
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const query = `${urlBase}/services/data/v53.0/query/?q=Select+id,+name,+Amount,+CloseDate,+IsWon,+StageName+from+Opportunity+where+CloseDate+>+${startDate}+and+CloseDate+<+${endDate}`
    try {
      let res = await this.get(query, null, options)
      response = { result: res, token: token }
    } catch (err) {
      if (err.extensions.code === 'UNAUTHENTICATED') {
        messageError = 'UNAUTHENTICATED'
      }
    }

    if (messageError === 'UNAUTHENTICATED') {
      response = await this.getDataUsingRefreshToken(
        connectionId,
        userToken,
        query,
        urlBase
      )
    }
    return response.result.records.map((opportunity) => ({
      id: opportunity.Id,
      name: opportunity.Name,
      amount: opportunity.Amount,
      closeDate: opportunity.CloseDate,
      isWon: opportunity.IsWon,
      stageName: opportunity.StageName,
    }))
  }
}

module.exports = HubspotAPI
