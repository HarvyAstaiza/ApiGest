const { Schema, model } = require('mongoose');

const CybergraphySchema = new Schema({
    author_Cibergrafia: String,
    title_Cybergraphy: String,
    date_Cybergraphy: Date,
    Url_Cybergraphy: String,
    id_subject: String,
    status:String
}, {
    timestamps: true
});

module.exports = model('Cybergraphy', CybergraphySchema, 'Cybergraphy');