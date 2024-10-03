const { Schema, model } = require('mongoose');

const adminSchema = new Schema({
    username: { type: String },
    password: { type: String }
})

module.exports = model('admin', adminSchema );
