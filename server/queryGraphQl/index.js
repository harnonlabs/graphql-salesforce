require('dotenv').config()
const axios = require('axios')

async function queryGraphQL(requestBody, options) {
  try {
    return await axios.post(
      `${process.env.URLAPI_GRAPHQL}`,
      requestBody,
      options
    )
  } catch (err) {
    console.log(err.response)
    throw new Error(err.response.data.errors[0].message)
  }
}

exports.queryGraphQL = queryGraphQL
