const { Schema, model } = require('mongoose');

const thematicSchema = new Schema({
    name: String,
    description: String,
    id_Subject:String,
    status:String
}, {
    timestamps: true
});

module.exports = model('Thematic', thematicSchema, 'Thematic');