module.exports = {
    apps: [
        {
            name: "bot.knotters.org/discord",
            script: "./server.js",
            instances: "max",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
