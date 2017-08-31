const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  snippet: String,
  tags: [String],
  notes: String,
  language: String
})

const CodeSnippetSchema = mongoose.model('CodeSnippetSchema', snippetSchema);

module.exports = CodeSnippetSchema
