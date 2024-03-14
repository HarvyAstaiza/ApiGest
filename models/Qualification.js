const { Schema, model } = require('mongoose');

const QualificationSchema = new Schema({
    Qualification: String,
    commit_Qualification: String,
    Day:String,
    Time: String,
    id_Subject: String
}, {
    timestamps: true
});

module.exports = model('Qualification', QualificationSchema, 'Qualification');