const mongoose = require('mongoose')

module.exports = {
  connect: async () => {
    let connect
    try {
      connect = await mongoose.connect(`mongodb+srv:`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      console.log('>>>👽 DB is connected')
    } catch (e) {
      console.log('Something goes  wrong!')
      console.log(e)
    }
    return connect
  }
}
