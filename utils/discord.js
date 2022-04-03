const { SERVER_ID } = require("../config");

module.exports = (client) => ({
    createSpamInvite: (
        channelName = "spam",
        onSuccess = (invite) => {},
        onFailure = (error) => {
            console.log(error);
        }
    ) => {
        const guild = client.guilds.cache.get(SERVER_ID);
        guild.channels.cache
            .find((channel) => channel.name === channelName)
            .createInvite({ maxAge: 0 })
            .then((invite) => {
                onSuccess(invite);
            })
            .catch((err) => {
                onFailure(err);
            });
    },
});
