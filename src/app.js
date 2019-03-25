const Hapi = require("hapi");
const routes = require("./routes");
const Mongoose = require("mongoose");

//TODO:: Remove once testing complete
import "dotenv/config";
console.log(process.env.MY_SECRET);

Mongoose.connect("mongodb://localhost:5555/test");

var db = Mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    // we're connected!
    console.log("Mongo is going");
});

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
            prettyPrint: false,
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
