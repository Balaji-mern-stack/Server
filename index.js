
const express = require('express');
const cors = require('cors');
const path = require('path');
require('./dbconfig');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Allow credentials (cookies, tokens, etc.)
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Static file handling for image uploads
const imagePath = path.join(process.cwd(), 'Controllers', 'Data', 'Images');
app.use('/api/Data/Images', express.static(imagePath));

// Static file handling for certificate uploads
const certificatePath = path.join(process.cwd(), 'Controllers', 'Data', 'Certificates');
app.use('/api/Data/Certificates', express.static(certificatePath));

// Static file handling for video uploads
const videoPath = path.join(process.cwd(), 'Controllers', 'Data', 'Videos');
app.use('/api/Data/Videos', express.static(videoPath));


// Routes
app.use('/', require('./app'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
