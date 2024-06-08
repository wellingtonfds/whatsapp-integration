import fs from 'fs'

export default () => ({
    sicoob: {
        clientId: process.env.SICOOB_CLIENT_ID,
        sandBox: process.env.SICOOB_SANDBOX,
        apiUrl: process.env.SICOOB_API_URL,
        pixKey: process.env.SICOOB_PIX_KEY,
        cert: fs.readFileSync('./public_key.pem', 'utf-8'),
        key: fs.readFileSync('./private_key.pem', 'utf-8'),
        passphrase: process.env.SICOOB_PASS_PHRASE
    }
})