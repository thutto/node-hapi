const Hapi = require('hapi');
const Joi = require('joi');
const find = require('lodash.find');

const messages = [];

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {

        return 'Hello, world!';
    }
});

server.route({
    method: 'GET',
    path: '/messages',
    handler: (request, h) => {
        request.logger.info('In GET %s', request.path);
        return {
            totalCount: messages.length,
            count: messages.length,
            limit: messages.length,
            offset: 0,
            messages: messages
        };
    }
});

server.route({
    method: 'GET',
    path: '/message/{id}',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            }
        }
    },
    handler: (request, h) => {
        request.logger.info('In GET By Id %s', request.path);
        const message = find(messages,['id', request.params.id]);
        return message ? message : {};
    }
});

server.route({
    method: 'POST',
    path: '/message',
    config: {
        validate: {
            payload: {
                id: Joi.string().required(),
                message: Joi.string().required(),
                createDate: Joi.date().forbidden().default(new Date())
            }
        }
    },
    handler: (request, h) => {
        request.logger.info('In Post %s', request.path);
        messages.push(request.payload);
        return request.payload;
    }
});

const init = async () => {

    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: true,
            logEvents: ['response', 'onPostStart']
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();