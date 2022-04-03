const express = require("express");
const { Client, Intents } = require("discord.js");

const { HOST, PORT, TOKEN } = require("./config");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const app = require("./app");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

client.once("ready", async () => {
    console.log("Bot Ready!");
});

app.listen(PORT, HOST, async () => {
    console.log("listening ", PORT, HOST);
    await client.login(TOKEN);
    app.use("/discord", require("./discord")(client));
});
