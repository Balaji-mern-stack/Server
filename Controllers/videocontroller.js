const Video = require('../Models/videomodel');
const multer = require('multer');
const path = require('path');

// Multer storage configuration for video uploads
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const videoDir = path.join(__dirname, 'Data', 'Videos');
        cb(null, videoDir);  // Save video files to the 'Data/Videos' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);  // Create a unique filename for the uploaded video
    }
});

const uploadVideo = multer({
    storage: videoStorage,
    limits: { fileSize: 1024 * 1024 * 1024 }  
}).single('video');

// Video upload function
exports.uploadVideo = (req, res) => {
    uploadVideo(req, res, async (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: "File size exceeds 1 GB limit" });
            }
            return res.status(500).json({ error: "Error uploading video", err });
        }

        const { videoName, description, duration, uploadedBy } = req.body;

       
        const newVideo = {
            videoName,
            description,
            video: `/api/Data/Videos/${req.file.filename}`,
            duration
        };

        try {
            // Check if a document for the user already exists
            let userVideos = await Video.findOne({ uploadedBy });

            if (userVideos) {
                // If the user has an existing document, append the new video
                userVideos.videos.push(newVideo);
            } else {
                // If no document exists, create a new one with the first video
                userVideos = new Video({
                    uploadedBy,
                    videos: [newVideo]
                });
            }

            await userVideos.save();
            return res.status(201).json({ message: "Video uploaded successfully", userVideos });

        } catch (error) {
            console.error("Error saving video", error);
            return res.status(500).json({ error: 'Error saving video', error });
        }
    });
};

// Function to get all videos
exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        return res.status(200).json({ videos });
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching videos', error });
    }
};

// Function to get videos by uploader
exports.getVideosByUploader = async (req, res) => {
    try {
        const { uploadedBy } = req.params;  // Get the uploadedBy from request params
        const userVideos = await Video.findOne({ uploadedBy });  // Find the document for this uploader

        if (!userVideos) {
            return res.status(404).json({ message: 'No videos found for this user' });
        }

        return res.status(200).json({ videos: userVideos.videos });
    } catch (error) {
        console.error("Error fetching videos by uploader", error);
        return res.status(500).json({ error: 'Error fetching videos by uploader' });
    }
};
