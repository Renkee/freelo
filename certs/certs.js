const path = require('path')
const fs = require('fs')

module.exports = {
	cert: fs.readFileSync(path.resolve(__dirname, 'freelo.renkee.eu.pem'), 'utf8'),
	key: fs.readFileSync(path.resolve(__dirname, 'freelo.renkee.eu.key'), 'utf8')
}
