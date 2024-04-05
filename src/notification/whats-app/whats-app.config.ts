export default () => ({
    whatsApp: {
        url: `https://graph.facebook.com/${process.env.WHATS_APP_API_VERSION}/${process.env.WHATS_APP_PHONE_NUMBER_ID}/messages`,
        apiKey: process.env.WHATS_APP_API_KEY
    }
})