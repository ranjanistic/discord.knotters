const router = require("express").Router();
const Joi = require("joi");
const { authorization } = require("./../middleware/authorization");
const { SERVER_ID } = require("./../config");

let client = null;

router.post("/create-channel", authorization, async (req, res) => {
    try {
        const { error, value } = Joi.object({
            channel_name: Joi.string()
                .lowercase()
                .max(50)
                .min(3)
                .trim()
                .required(),
            channel_type: Joi.string()
                .valid(
                    "GUILD_TEXT",
                    "GUILD_VOICE",
                    "GUILD_CATEGORY",
                    "DM",
                    "GROUP_DM",
                    "GUILD_NEWS",
                    "GUILD_STORE",
                    "GUILD_INVITE",
                    "GUILD_ANOUNCEMENTS",
                    "GUILD_DISCOVERY",
                    "GUILD_PARTNERED",
                    "GUILD_PUBLIC"
                )
                .default("GUILD_TEXT"),
            public: Joi.boolean().default(false).required(),
            channel_category: Joi.string()
                .valid("PROJECTS", "COMPETITIONS", null)
                .required(),
            message: Joi.string().default("Welcome everyone!"),
        })
            .options({ abortEarly: false })
            .validate(req.body);
        if (error) {
            return res.status(400).json({
                ok: false,
                messages: error.details.map((d) => d.message),
            });
        }
        const guild = client.guilds.cache.get(SERVER_ID);
        let channel = guild.channels.cache.find(
            (c) =>
                c.name === value.channel_name && c.type === value.channel_type
        );
        let permissionOverwrites = [];
        if (channel) {
            permissionOverwrites = channel.permissionOverwrites.cache;
            if (value.public) {
                await channel.permissionOverwrites.edit(guild.roles.everyone, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                });
            }
        } else {
            if (value.public) {
                permissionOverwrites.push({
                    id: guild.roles.cache.find((r) => r.name == "@everyone").id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                });
                permissionOverwrites.push({
                    id: guild.roles.cache.find((r) => r.name === "Mentor").id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                });
            } else {
                permissionOverwrites.push({
                    id: guild.id,
                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                });
                permissionOverwrites.push({
                    id: guild.roles.cache.find((r) => r.name === "Mentor").id,
                    allow: ["VIEW_CHANNEL"],
                });
            }
            permissionOverwrites.push({
                id: guild.roles.cache.find((r) => r.name === "admin").id,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            });
            permissionOverwrites.push({
                id: guild.roles.cache.find((r) => r.name === "moderator").id,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            });
            permissionOverwrites.push({
                id: guild.roles.cache.find((r) => r.name === "Knotters").id,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            });
            channel = await guild.channels.create(value.channel_name, {
                type: value.channel_type,
                permissionOverwrites,
            });
        }
        await channel.send(value.message);
        if (value.channel_category) {
            let parent = guild.channels.cache.find(
                (c) =>
                    c.name.toUpperCase() === value.channel_category &&
                    c.type === "GUILD_CATEGORY"
            );
            if (!parent) {
                parent = await guild.channels.create(value.channel_category, {
                    type: "GUILD_CATEGORY",
                    permissionOverwrites,
                });
            }
            if (channel.parentId !== parent.id) {
                await channel.setParent(parent.id);
            }
        }
        return res.json({
            ok: true,
            channelID: channel.id,
        });
    } catch (e) {
        console.log(e.stack);
        res.status(500).json({
            ok: false,
            error: e.message,
        });
    }
});

router.use("/", (req, res) => {
    res.json({
        ok: client ? true : false,
        message: client
            ? "Knotters Discord Bot is online. Thank you for checking up on us."
            : "There is a problem, we're not online! But thank you for checking up on us.",
    });
});

module.exports = (dclient) => {
    client = dclient;
    return router;
};
