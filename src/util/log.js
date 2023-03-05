const winston = require('winston')
const path = require('path')
const util = require('util')

const combineMessageAndSplat = () => {
  return {
    transform: (info, opts) => {
      //combine message and args if any
      info.message =  util.format(info.message, ...info[Symbol.for('splat')]  ||  [] )
      return info;
    }
  }
}

const logger = winston.createLogger({
  level: 'debug',
  // format: winston.format.json(),
  defaultMeta: { service: 'default' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
  format: winston.format.combine(
    combineMessageAndSplat(),
    winston.format.simple(),
  ),
})

if (`${process.env.NODE_ENV}`.toLocaleLowerCase() !== 'prod') {
  logger.add(new winston.transports.Console({
    format: winston.format.cli()
  }))
}

module.exports = logger
