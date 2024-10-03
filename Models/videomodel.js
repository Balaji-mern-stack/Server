const { Schema, model } = require('mongoose');

// Define the video schema
const videoSchema = new Schema({
    uploadedBy: { type: String, required: true },  // Unique identifier for the uploader (e.g., username or user ID)
    videos: [
        {
            videoName: { type: String },
            description: { type: String },
            video: { type: String },  // Path to the video file
            duration: { type: Number },
            uploadDate: { type: Date, default: Date.now }  // Timestamp for when the video was uploaded
        }
    ]
});

module.exports = model('Video', videoSchema);
