const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: { 
        type: String, 
        unique: true
    },
    password: { 
        type: String, 
    },
    email: { 
        type: String, 
        unique: true  
    },
    phonenumber: { 
        type: String, 
        unique: true  
    },
    image: { 
        type: [String] 
    },
    skills: [{
        skillname: { type: String },
        experiences: { type: String },
        qualifications: { type: String },
        languages: { type: [String] },
        certificates: { type: [String] },  
        status: { 
            type: String, 
            enum: ["Approved", "Rejected", "Pending"],
            default: "Pending"  // Default value is now "Pending"
        }
    }],
    googleId: { 
        type: String,
        unique: true,
        sparse: true 
    }
});

module.exports = model('User', UserSchema);
