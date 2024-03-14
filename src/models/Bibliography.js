const { Schema, model } = require('mongoose');

const BibliographySchema = new Schema({
    author: String,
    title: String,
    editorial: String,
    edition: String,
    year: String,
    id_Subject:String,
    status:String
}, {
    timestamps: true
});

module.exports = model('Bibliography', BibliographySchema, 'Bibliography');