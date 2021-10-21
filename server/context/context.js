// module.exports = async ({ req }) => {
//   const ctx = {}
//   const hapikey = req.headers.hapikey
//   if (hapikey) {
//     Object.assign(ctx, { hapikey })
//   }
//   return ctx
// }

module.exports = async ({ req, res }) => {
  const ctx = {}
  const { authorization, id } = req.headers
  if (!authorization && !id) throw new Error('Token required')
  const accessToken = authorization.slice(7)
  Object.assign(ctx, {
    accessToken: { accessToken, id, ip: req.ip },
  })
  return ctx
}
