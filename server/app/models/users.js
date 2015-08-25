/**
 * Created by Tundaey on 6/24/2015.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
//var jwt = require('jsonwebtoken');
var config = require('../../config');
var FirebaseTokenGenerator = require('firebase-token-generator');
var tokenGenerator = new FirebaseTokenGenerator(config.firebase_key);


var userSchema = new mongoose.Schema({
    phone: {type: String, unique: true},
    full_name: String,
    password: {type: String, select: false},
    job_title: {type:String},
    verified: {type: Boolean, default: false},
    verification_code: {type: String},
    company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'}
});

userSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

userSchema.methods.generateJWT = function(){
    var user_id = this._id;
    _id = user_id.toString();
    var token = tokenGenerator.createToken({uid: _id, data: this.phone});
    return token;
};


module.exports = mongoose.model('User', userSchema);
