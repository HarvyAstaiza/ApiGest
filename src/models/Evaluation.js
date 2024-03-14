const { Schema, model } = require('mongoose');

const EvaluationSchema = new Schema({
  evaluationEnabled: Boolean, 
}, {
  timestamps: true
});

module.exports = model('Evaluation', EvaluationSchema, 'Evaluation');
