var mongoose = require("mongoose");

// Save a reference to the Schema constructor

var Schema = mongoose.Schema;

// creating a notes schema
var NotesSchema = new Schema({
    title: String,
    body: String
});

var Note = mongoose.model("Note",NotesSchema);

module.exports = Note;