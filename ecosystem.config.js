module.exports = {
    apps: [
        {
            name: "bot.knotters.org",
            script: "./server.js",
            instances: "max",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};