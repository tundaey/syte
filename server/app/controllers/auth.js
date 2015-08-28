/**
 * Created by Tundaey on 6/24/2015.
 */

var User = require('../models/users');
var util = require('../utils/util');
var Company = require('../models/company');
var jwt = require('jsonwebtoken');
var config = require('../../config');
//var util = require('../utils/util');
var twilio = require('twilio')( config.twilio_account_sid, config.twilio_auth_token);
var twilio_number = config.twilio_number;
module.exports = {
    send: function(req, res){
        twilio.sendSms({
            to:'+23408030580058',
            from:twilio_number,
            body:'ahoy hoy! Testing Twilio and node.js'
        }, function(error, message) {
            if (!error) {
                console.log(message);
                res.send('sent')
            } else {
                console.log('Oops! There was an error.');
                res.send(error);
            }
        });

    },


    register: function(req, res, next){
        Company.findOne({email: req.body.email}, function(err, company){
            if(err) return next(err);
            if(company){
                res.status(401).send({message: 'Sorry, there is an existing company with this email address'});
            }else {

                var verification_code = util.generateVerificationCode();
                var company = new Company();
                company.email = req.body.email;
                company.company_name = req.body.company_name;
                company.employees = req.body.employees;
                company.company_code = util.generateCompanyCode();
                var user = new User();
                var phone_number = '+234' + req.body.phone_number;
                user.phone = phone_number;
                user.verification_code = verification_code
                user.full_name = req.body.full_name;
                user.job_title = req.body.job_title;
                user.password = req.body.password;
                twilio.sendSms({
                    to: user.phone,
                    from: twilio_number,
                    body: verification_code
                }, function (error, message) {
                    if (!error) {
                        console.log('Success! The SID for this SMS message is:');
                        console.log(message.sid);
                        console.log('Message sent on:');
                        console.log(message.dateCreated);
                        company.save(function(err, com){
                            if(err) return res.send(err);
                            user.save(function(error, savedUser){
                                savedUser.company = com._id;
                                com.admin = savedUser._id;
                                com.users.push(savedUser._id);
                                savedUser.save();
                                com.save();
                            })
                        })
                        res.json({message: 'Admin and Company saved', sms: 'Sms sent', phone: user.phone});
                    } else {
                        console.log('Oops! There was an error.');
                        res.send(error);
                    }
                });
            }
        });
    },

    verify: function(req, res, next){
        var verification_code = req.body.verification_code;
        User.findOne({verification_code: verification_code}, function(err, user){
            if(err) return next(err);
            if(!user){
                return res.send("no user found");
            }
            if(user){
                //return res.send('logged');
                user.verified = true;
                user.verification_code = '';
                var token = user.generateJWT();
                user.save(function(err){
                    if(err) return next(err);
                    res.json({token: token, message: "User has been Verified"});
                })
            }

        })
    },

    invite: function(req, res, next){
        var phone_number = '+234' + req.body.phone_number;
        Company.findOne({company_code: req.body.company_code}, function(err, company){
            if(err) return next(err);
            if(!company){
                return res.status(404).send({message: 'Company not found'})
            }else{
                User.findOne({phone: phone_number}, function(err, existingUser){
                    if(err) return next(err);
                    if(existingUser){
                        res.status(403).send({message: 'User Exists already'})
                    }else{
                        var newUser = new User();
                        newUser.phone = phone_number;
                        newUser.verification_code = util.generateVerificationCode();
                        newUser.save(function(err, savedUser){
                            company.users.push(savedUser._id);
                            company.save();
                            res.json({message: 'Invitation Successfully sent'})
                        })
                        /*twilio.sendSms({
                            to: newUser.phone,
                            from: twilio_number,
                            body: 'You have been invited to syte. Sign up with ' + newUser.verification_code + ' and company code ' + company.company_code
                        }, function(error, message){
                            if (!error) {
                                console.log('Success! The SID for this SMS message is:');
                                console.log(message.sid);
                                console.log('Message sent on:');
                                console.log(message.dateCreated);
                                newUser.save(function(err, savedUser){
                                    company.users.push(savedUser._id);
                                    company.save();
                                    res.json({message: 'Invitation Successfully sent'})
                                })
                            }
                        })*/

                    }
                })
            }

        })
    },

    signup: function(req, res, next){
        Company.findOne({company_code: req.body.company_code}, function(err, company){
        if(err) return next(err);
        if(!company){
            return res.status(404).json({message: 'Sorry, Wrong Credentials'})
        }else{
            User.findOne({verification_code : req.body.verification_code}, function(err, user){
                if(err) return next(err);
                if(!user){
                    return res.status(404).json({message: 'Sorry, wrong credentials'})
                }else{
                    user.full_name = req.body.full_name;
                    user.password = req.body.password;
                    user.verification_code = '';
                    user.verified = true;
                    user.save();
                    var token = user.generateJWT();
                    res.json({token: token, message: "Successfully signed up"});
                }
            })
        }


        })

    },

    login: function(req, res, next){
        var phone_number = '+234' + req.body.phone_number;
        User.findOne({phone: phone_number}, function(err, user){
            if(err) return next(err);
            if(!user){
                res.status(403).json({message: 'Incorrect Username or Password'})
            }else if(user){

                var validPassword = user.comparePassword(req.body.password);
                //return res.send(req.body.password);
                if(!validPassword){
                    return res.status(403).send({message: 'Username or Password incorrect', status: false});
                }
                var token = user.generateJWT();
                return res.send({token:token, status: true, role: user.role, user_details: user_details})
            }
        })
    }
}
