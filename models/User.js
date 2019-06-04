const mongoose = require('mongoose'),
      uniqueValidator = require('mongoose-unique-validator'),
      crypto = require('crypto');


const UserSchema = new mongoose.Schema({
    username: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"],
                              match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true },

    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"],
                           match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },

    bio: String,
    image: String,
    hash: String,
    salt: String
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });


/// Password

UserSchema.methods.validatePassword = function(pass) {
    const hash = crypto.pbkdf2Sync(pass, this.salt, 10000, 512, 'sha512').toString();
    return this.hash === hash;
};


UserSchema.methods.setPassword = function(pass) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(pass, this.salt, 10000, 512, 'sha512');
};

mongoose.model('User', UserSchema);