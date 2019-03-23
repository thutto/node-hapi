const Hapi = require("hapi");
const routes = require("./routes");

//TODO:: Remove once testing complete
import "dotenv/config";
console.log(process.env.MY_SECRET);

const messages = [];

const server = Hapi.server({
    port: 3000,
    host: "localhost"
});

for (const route in routes) {
    console.log(route);
    server.route(routes[route]);
}

module.exports = server;

const init = async () => {
    await server.register({
        plugin: require("hapi-pino"),
        options: {
            prettyPrint: true,
            logEvents: ["response", "onPostStart"]
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
    console.log(err);
    process.exit(1);
});

init();
