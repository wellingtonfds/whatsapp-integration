
export default () => ({
    sicoob: {
        clientId: process.env.SICOOB_CLIENT_ID,
        sandBox: process.env.SICOOB_SANDBOX,
        apiUrl: process.env.SICOOB_API_URL,
        cert: '',
        //cert: fs.readFileSync('/certs/server.crt'),
        key: ''
        //key: fs.readFileSync('/certs/server.key')
    }

})