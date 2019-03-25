const Hapi = require("hapi");
const Joi = require("joi");
const find = require("lodash.find");
// const NoteModel = require("../models/note.model");

const Mongoose = require("mongoose");

const NoteModel = Mongoose.model("note", {
    id: String,
    note: String,
    createDate: Date,
    archived: Boolean
});

module.exports = (function() {
    return [
        {
            method: "GET",
            path: "/",
            handler: async (request, h) => {
                return "Hello, world!";
            }
        },
        {
            method: "GET",
            path: "/notes",
            handler: async (request, h) => {
                request.logger.info("In GET %s", request.path);
                const notesList = await NoteModel.find().exec();
                if (!notesList) {
                    notesList = [];
                }
                return {
                    totalCount: notesList.length,
                    count: notesList.length,
                    limit: notesList.length,
                    offset: 0,
                    notes: notesList
                };
            }
        },
        {
            method: "GET",
            path: "/note/{id}",
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request, h) => {
                request.logger.info("In GET By Id %s", request.path);
                console.log(request.params.id);
                const note = NoteModel.findById(request.params.id).exec();
                return note ? note : {};
            }
        },
        {
            method: "POST",
            path: "/note",
            config: {
                validate: {
                    payload: {
                        id: Joi.string().required(),
                        note: Joi.string().required(),
                        createDate: Joi.date()
                            .forbidden()
                            .default(new Date()),
                        archived: Joi.boolean().default(false)
                    }
                }
            },
            handler: async (request, h) => {
                request.logger.info("In Post %s", request.path);
                try {
                    const note = new NoteModel(request.payload);
                    const result = await note.save();
                    return result;
                } catch (error) {
                    return error;
                }
            }
        }
    ];
})();
