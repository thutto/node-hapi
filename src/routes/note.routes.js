const Hapi = require("hapi");
const Joi = require("joi");
const find = require("lodash.find");
const messages = [];

module.exports = (function() {
    return [
        {
            method: "GET",
            path: "/",
            handler: (request, h) => {
                return "Hello, world!";
            }
        },
        {
            method: "GET",
            path: "/messages",
            handler: (request, h) => {
                request.logger.info("In GET %s", request.path);
                console.log(constants);
                return {
                    totalCount: messages.length,
                    count: messages.length,
                    limit: messages.length,
                    offset: 0,
                    messages: messages
                };
            }
        },
        {
            method: "GET",
            path: "/message/{id}",
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: (request, h) => {
                request.logger.info("In GET By Id %s", request.path);
                const message = find(constants.messages, [
                    "id",
                    request.params.id
                ]);
                return message ? message : {};
            }
        },
        {
            method: "POST",
            path: "/message",
            config: {
                validate: {
                    payload: {
                        id: Joi.string().required(),
                        message: Joi.string().required(),
                        createDate: Joi.date()
                            .forbidden()
                            .default(new Date())
                    }
                }
            },
            handler: (request, h) => {
                request.logger.info("In Post %s", request.path);
                messages.push(request.payload);
                return request.payload;
            }
        }
    ];
})();
