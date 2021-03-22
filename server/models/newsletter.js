const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let newsletterSchema = new Schema({
    email: { type: String, unique: true, required: [true, 'El email es necesario'] }
});

newsletterSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Newsletter', newsletterSchema);