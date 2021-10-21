const axios = require('axios')
require('dotenv').config()

const decryptSecret = async (secret) => {
  const decrypt = await axios
    .post(`${process.env.URLENCRYPT}decrypthub`, { secret: secret })
    .then((res) => res)
    .then((data) => data.data)
  return decrypt
}

exports.decryptSecret = decryptSecret
