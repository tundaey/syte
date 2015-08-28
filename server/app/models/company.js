/**
 * Created by Tundaey on 8/11/2015.
 */
/**
 * Created by Tundaey on 6/24/2015.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var companySchema = new mongoose.Schema({
    email: {type: String, unique: true},
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    company_name: String,
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    employees: {type: String},
    verified: {type: Boolean, default: false},
    company_code: {type: Number},
    projects: [{
        name: String,
        project_type: String,
        admins : [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        collaborators : [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        start_date: Date,
        end_date: Date,
        location: String,
        completed: {type: Boolean, default: false}
    }]
});


module.exports = mongoose.model('Company', companySchema);
