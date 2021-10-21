const { gql } = require('apollo-server')
const Timerequest = 86400

const typeDefs = gql`
  type Query {

    opportunities(startDate: String endDate: String): [Opportunities]
  }

  type Opportunities @cacheControl(maxAge: ${Timerequest}, scope: PRIVATE) {
    id: String
    name: String
    amount: Float
    closeDate: String
    isWon: Boolean
    stageName: String
  }
`

module.exports = typeDefs
