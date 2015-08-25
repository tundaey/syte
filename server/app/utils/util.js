/**
 * Created by Tundaey on 8/11/2015.
 */
var config = require('../../config');
var twilio = require('twilio')( config.twilio_account_sid, config.twilio_auth_token);
var twilio_number = config.twilio_number;
module.exports = {
    generateCompanyCode: function(){
        var code = Math.round((Math.random()* 9000) + 1000);
        return code;
    },

    generateVerificationCode: function(){
        var code = Math.round((Math.random()* 900000) + 100000);
        return code;
    }
}