const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    stockChannel: {
        type: String,
        default: "",
        required: false,
    }
})

module.exports = model("GuildData",guildSchema);