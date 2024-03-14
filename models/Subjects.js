const { Schema, model } = require('mongoose');

const SubjectsSchema = new Schema({
    name: String,
    code_Subjects: String,
    semester: String,
    type_of_matter: String,
    id_teacher: String,    
    methodology:String,
    period:String,
    Assessment_Status:String,
    status:String,
    working_day:String,
    deleted: Boolean
}, {
    timestamps: true
});

module.exports = model('Subjects', SubjectsSchema, 'Subjects');
