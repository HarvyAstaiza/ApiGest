const { Schema, model } = require('mongoose');

const Semi_annual_cut_offSchema = new Schema({
    name: String,
    percentage: String,
    description: String,
    id_Subject:String
}, {
    timestamps: true
});

module.exports = model('Semi_annual_cut_off', Semi_annual_cut_offSchema, 'Semi_annual_cut_off');