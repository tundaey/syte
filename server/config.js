/**
 * Created by Tundaey on 6/24/2015.
 */
module.exports = {
    jwtsecret : process.env.SECRET ||'sytejsonwebtokensecret',
    db_url: 'mongodb://localhost:27017/syte',
    port: process.env.PORT || 7000,
    twilio_account_sid: process.env.TWILIO_ACCOUNT_SID || 'AC7d46ed8779368932fcdb78466033893f',
    twilio_auth_token: process.env.TWILIO_AUTH_TOKEN || 'eb6cac4b667215214efd45f43f1140ec',
    twilio_number: process.env.TWILIO_NUMBER || '+12052240276',
    firebase_key: process.env.FIREBASE_KEY || 'aExvnYwZSUcFu2HmjLUMKHRfDkzMceOIeFcZmNYW'
}