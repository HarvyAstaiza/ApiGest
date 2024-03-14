const { Schema, model } = require('mongoose');

const teacherSchema = new Schema({
    name: String,
    code_Teacher: String,
    identification: String
}, {
    timestamps: true
});

module.exports = model('Teacher', teacherSchema, 'Teacher');