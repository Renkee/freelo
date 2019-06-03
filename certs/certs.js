import path from 'path'
import fs from 'fs'

module.exports = {
	cert: fs.readFileSync(path.resolve(__dirname, 'freelo.renkee.eu.pem'), 'utf8'),
	key: fs.readFileSync(path.resolve(__dirname, 'freelo.renkee.eu.key'), 'utf8')
}
