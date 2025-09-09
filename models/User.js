// --- Module and Package Imports ---
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// --- User Schema Definition ---
const userSchema = new mongoose.Schema({
    // The email field is a string, required, and must be unique.
    // We trim whitespace and convert the email to lowercase for consistency.
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    
    password: {
        type: String,
        required: true
    }
}, {
    // Timestamps automatically add `createdAt` and `updatedAt` fields.
    timestamps: true
});

// --- Pre-Save Hook for Password Hashing ---
// This middleware runs before a new user document is saved to the database.
userSchema.pre('save', async function(next) {
    // If the password field hasn't been modified, move on.
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); // generates a unique, random salt for this specific user, in this case with the cost factor of ten
        // Hash the password with the generated salt.
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// --- Method to Compare Passwords ---

// A custom method to compare a given password with the hashed password in the database.
userSchema.methods.comparePassword = async function(candidatePassword) {
    // Use bcrypt's compare method to check the password.
    return await bcrypt.compare(candidatePassword, this.password);
};

// --- Model Creation and Export ---
// Create the User model from the schema.
const User = mongoose.model('User', userSchema);

// Export the User model for use in other parts of the application.
module.exports = User;