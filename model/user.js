const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_id: { type: String, unique: true  },
    organization_id: { type: String, default: null },
    roll_id: { type: String, default: null },
    user_full_name: { type: String, default: null },
    user_email_id: { type: String, unique: true },
    user_roll_name: { type: String, default: null },
    user_phone_num: { type: String, unique: true },
    user_password: { type: String },
    createdat: { type: String, default: null },
    updatedat: { type: String, default: null },
});

const sessionSchema = new mongoose.Schema({
    user_email_id: { type: String, unique: true },
    token: { type: String },
});

module.exports.user = mongoose.model("user", userSchema);
module.exports.session = mongoose.model("session", sessionSchema);
