const winston = require('winston')

// get date and apply format
dateFormat = () => {
  let date = new Date().toLocaleString()
  return new Date(new Date(date).toUTCString())
}

//
// Logging levels
//
const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
    custom: 7,
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta',
    custom: 'yellow',
  },
}

winston.addColors(config.colors)

const logger = winston.createLogger({
  levels: config.levels,
  // create format to log
  format: winston.format.combine(
    // winston.format.colorize({ all: true }),
    winston.format.label({ label: '[my-label]' }),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.json(),
    winston.format.printf((info) => {
      console.log(info.level)
      let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${
        info.level.toUpperCase() === 'ERROR' ? 'error.log' : 'logs.log'
      } | ${info.message} | `
      message = info.obj
        ? message + `data:${JSON.stringify(info.obj)} | `
        : message
      message = this.log_data
        ? message + `log_data:${JSON.stringify(this.log_data)} | `
        : message
      return message
    })
  ),
  transports: [
    // file to save info and error
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/logs.log', level: 'info' }),
  ],
})

const loggerData = winston.createLogger({
  levels: config.levels,
  // create format to log
  format: winston.format.combine(
    // winston.format.colorize({ all: true }),
    winston.format.label({ label: '[my-label]' }),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.json(),
    winston.format.printf((info) => {
      console.log(info.level)
      let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${
        info.level.toUpperCase() === 'ERROR' ? 'error.log' : 'logs.log'
      } | ${info.message} | `
      message = info.obj
        ? message + `data:${JSON.stringify(info.obj)} | `
        : message
      message = this.log_data
        ? message + `log_data:${JSON.stringify(this.log_data)} | `
        : message
      return message
    })
  ),
  transports: [
    // file to save data successful
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/res.log', level: 'data' }),
  ],
})

// logger.stream = {
//   write: function (message, encoding) {
//     // use the 'info' log level so the output will be picked up by both transports (file and console)
//     logger.info(message)
//   },
// }

exports.logger = logger
exports.loggerData = loggerData
