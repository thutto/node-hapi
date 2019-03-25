const Mongoose = require("mongoose");

const NoteModel = Mongoose.model("note", {
    id: String,
    note: String,
    createDate: Date,
    archived: Boolean
});
