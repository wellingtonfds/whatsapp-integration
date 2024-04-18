import fs from 'fs'

export default () => ({
    sicoob: {
        clientId: process.env.SICOOB_CLIENT_ID,
        sandBox: process.env.SICOOB_SANDBOX,
        apiUrl: process.env.SICOOB_API_URL,
        certificate: fs.readFileSync('./private_key.pem', 'utf8'),
    }

})