const axios = require('axios')
require('dotenv').config()

const refreshToken = async (connectionId, token) => {
  const query = `${process.env.URLAPI}mhub-refreshSf`
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const body = {
    id: connectionId,
  }
  const response = await axios
    .post(query, body, options)
    .then((result) => result.data)

  return response
}

exports.refreshToken = refreshToken
