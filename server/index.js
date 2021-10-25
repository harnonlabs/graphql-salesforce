const { ApolloServer } = require('apollo-server')
const { GraphQLError } = require('graphql')
const typeDefs = require('./schema/schema')
const resolvers = require('./resolvers/resolvers')
const Salesforce = require('./datasources/salesforce')
const context = require('./context/context')
const responseCachePlugin = require('apollo-server-plugin-response-cache')
require('dotenv').config()
const depthLimit = require('graphql-depth-limit')
const { createComplexityLimitRule } = require('graphql-validation-complexity')
const { logger } = require('./services/customloggers')
const { loggerData } = require('./services/customloggers')
// const { connect } = require('./database/database')

// connect()

const ComplexityLimitRule = createComplexityLimitRule(1000, {
  createError(cost, documentNode) {
    const error = new GraphQLError('Query is too complex', [documentNode])
    error.meta = { cost }
    return error
  },
})

const systemLogger = {
  // request started
  requestDidStart(requestContext) {
    // console.log('request started')
    const id = requestContext.request.http.headers.get('id')
    const host = requestContext.request.http.headers.get('host')
    const method = requestContext.request.http.method
    const query = requestContext.request.query
    const ip = requestContext.context.accessToken.ip
    // console.log(requestContext.request.query)
    // console.log(requestContext.request.variables)
    return {
      // if error
      didEncounterErrors(requestContext) {
        let obj = {
          host,
          ip,
          method,
          id,
          query,
          error: requestContext.errors,
        }
        logger.error(`${JSON.stringify(obj)}`)
      },
      // successful response
      willSendResponse(requestContext) {
        let obj = {
          host,
          ip,
          method,
          id,
          query,
          response: 'successful',
        }
        loggerData.data(`${JSON.stringify(obj)}`)
        // console.log('response sent', requestContext.response)
      },
    }
  },
}

const server = new ApolloServer({
  cacheControl: true,
  context,
  typeDefs,
  resolvers,
  introspection: true,
  validationRules: [(depthLimit(7), ComplexityLimitRule)],
  plugins: [
    responseCachePlugin({
      sessionId: (requestContext) =>
        (requestContext.request.http.headers.get('authorization') &&
          requestContext.request.http.headers.get('id')) ||
        null,
    }),
    // systemLogger,
  ],
  dataSources: () => ({
    salesforce: new Salesforce(),
  }),
})
server
  .listen({ port: process.env.PORT || 4008 }, () =>
    console.log(`👽 Server ready at port 4008   `)
  )
  .then(({ url }) => {
    console.log(`👽 Server ready ${url}`)
  })
