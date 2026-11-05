// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long']
    }
}, { timestamps: true });

// 🛡️ REMODEL PRE-SAVE HOOK: Pure async function execution without the trailing next parameters!
UserSchema.pre('save', async function () {
    // Only scramble the password block if it has been freshly modified or created
    if (!this.isModified('password')) return;

    // Generate a high-entropy salt factor of 10 rounds and overwrite plain text natively
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 🔬 CRYPTO METHOD: Compare typed incoming text password against our stored database hash
UserSchema.methods.comparePassword = async function (incomingPassword) {
    return await bcrypt.compare(incomingPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
