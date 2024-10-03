const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    category: { type: String },
    description: { type: String }
})

module.exports = model('Category', categorySchema );
