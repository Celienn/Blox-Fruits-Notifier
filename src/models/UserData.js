const { Schema, model } = require("mongoose");

const notifySchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    fruits: {
        type: Array,
        default: [],
        required: false,
    }
})

module.exports = model("UserData",notifySchema);