const { Schema, model } = require('mongoose');

const StudentSchema = new Schema({
    code_Student: String,
    name_Student: String,
    document_Student: String,
    subjects:[{
        id_Subject:String
    }],
    Enrollment_Status:String,
    //asistencia: String,
}, {
    timestamps: true
});

module.exports = model('Student', StudentSchema, 'Student');