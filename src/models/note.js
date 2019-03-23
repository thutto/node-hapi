import { number, string, date } from "joi";

function NoteModel() {
    this.schema = {
        noteId: number().integer(),
        description: string().max(255),
        archived: date()
    };
}

export default NoteModel;
