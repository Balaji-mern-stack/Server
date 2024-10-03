const UserModel = require('../Models/usersmodels');
const multer = require('multer');
const path = require('path');

// Create User

exports.create = async (req, res, next) => {
    try {
        const { username, password, email, phonenumber, skills, googleId, image } = req.body;

        // For Google sign-up: Allow only email, googleId, and optionally other info
        if (googleId) {
            // Check if the user already exists with the Google ID
            const existingGoogleUser = await UserModel.findOne({ googleId });
            if (existingGoogleUser) {
                return res.status(400).json({ message: 'User already exists with this Google account' });
            }

            // If user is signing up with Google, create a new user without username/password
            const newGoogleUser = new UserModel({
                username: username || email.split('@')[0], // Default username to part of the email if not provided
                email,
                phonenumber,
                googleId,
                skills, 
                image // Store the Google profile image
            });

            await newGoogleUser.save();
            return res.status(201).json({ message: 'Google user created successfully', data: newGoogleUser });

        } else {
            // For regular sign-up: Validate required fields
            if (!username || !password || !email || !phonenumber) {
                return res.status(400).json({ message: 'All fields (username, password, email, phonenumber) are required for manual sign-up' });
            }

            // Check for existing user by username, email, or phone number
            const existingUser = await UserModel.findOne({
                $or: [
                    { username: username },
                    { email: email },
                    { phonenumber: phonenumber }
                ]
            });

            if (existingUser) {
                return res.status(400).json({ message: 'User already exists with this username, email, or phone number' });
            }

            // Create new user for manual sign-up
            const newUser = new UserModel({
                username,
                password,  // Optionally hash the password before saving
                email,
                phonenumber,
                skills,
                image // Optionally store the user's image here if applicable
            });

            // Optionally hash the password if not using Google
            // newUser.password = await hashPassword(password);

            await newUser.save();
            return res.status(201).json({ message: 'User created successfully', data: newUser });
        }

    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong', message: err.message });
    }
};


// Get All Users
exports.getAll = async (req, res, next) => {
    try {
        const users = await UserModel.find({});
        return res.status(200).json({ data: users });
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
};

// Get User by ID
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        return res.status(200).json({ data: user });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// Update User
exports.update = async (req, res, next) => {
    try {
        const { phonenumber } = req.body;  // Use phonenumber from URL params
        const { username, email } = req.body;  // Only username and email are considered for update

        // Create an object with fields that need to be updated
        const updatedFields = {};
        if (username) updatedFields.username = username;
        if (email) updatedFields.email = email;

        // Find the user by phone number and update
        const updatedUser = await UserModel.findOneAndUpdate(
            { phonenumber },  // Search criteria (find by phone number)
            updatedFields,    // Fields to update
            { new: true }     // Return the updated document
        );

        // If the user with the given phone number is not found
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If update is successful
        res.status(200).json({ message: "User Updated Successfully", data: updatedUser });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Delete User
exports.remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ message: "User deleted successfully", data: deletedUser });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Image Upload


// Image Upload by Phone Number
exports.imageUploadByPhone = async (req, res, next) => {
    try {
        const { phonenumber } = req.params;
        console.log(phonenumber);
        

        // Check if user exists with the provided phone number
        const user = await UserModel.findOne({ phonenumber });


        if (!user) {
            return res.status(404).json({ message: "User with this phone number not found" });
        }

        const filePath = path.join(__dirname + '/Data/Images');
        let uploadedFiles = [];

        const storage = multer.diskStorage({
            destination: filePath,
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const newFileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
                uploadedFiles.push('/Data/Images/' + newFileName);
                cb(null, newFileName);
            }
        });

        const upload = multer({
            storage: storage,
            fileFilter: (req, file, cb) => {
                const allowedTypes = ['image/jpeg', 'image/png'];
                if (!allowedTypes.includes(file.mimetype)) {
                    return cb(new Error('Only images are allowed'), false);
                }
                cb(null, true);
            }
        }).array('image', 5); 

        upload(req, res, async function (err) {
            if (err) {
                return res.status(500).json({ error: "Error uploading images", err });
            }

            // Update user's image field in the database
            user.image = uploadedFiles;
            await user.save();

            res.status(200).json({ message: "Images updated successfully", imagesUploaded: uploadedFiles });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};








const certificatesPath = path.join(__dirname, '../Data/Certificates');
const storage = multer.diskStorage({
    destination: certificatesPath,
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, newFileName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only PDFs or images (JPEG/PNG) are allowed'), false);
        }
        cb(null, true);
    }
}).array('certificates', 5);  // Maximum 5 files for certificates

// Update Skills and Upload Certificates by Phone Number
exports.updateSkills = async (req, res) => {
    try {
        const { phonenumber } = req.params;

        // Use Multer to handle file uploads and form-data parsing
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ error: "Multer error occurred during file upload", err });
            } else if (err) {
                return res.status(500).json({ error: "Error uploading certificates", err });
            }

            const { skillname, experiences, qualifications, languages } = req.body;

            // Validate required fields
            if (!skillname || !experiences || !qualifications) {
                return res.status(400).json({ error: "Missing required skill fields" });
            }

            // Find the user by phone number
            const user = await UserModel.findOne({ phonenumber });
            if (!user) {
                return res.status(404).json({ message: "User with this phone number not found" });
            }

            // If files were uploaded, map their paths
            let newCertificates = [];
            if (req.files && req.files.length > 0) {
                newCertificates = req.files.map(file => '/Data/Certificates/' + file.filename);
            }

            // Parse languages to ensure it's an array
            let languagesArray = [];
            if (languages) {
                if (Array.isArray(languages)) {
                    languagesArray = languages;
                } else if (typeof languages === 'string') {
                    languagesArray = languages.split(',').map(lang => lang.trim());
                }
            }

            // Find the index of the skill to update or add
            const skillIndex = user.skills.findIndex(skill => skill.skillname === skillname);

            if (skillIndex > -1) {
                // Update existing skill
                user.skills[skillIndex].skillname = skillname || user.skills[skillIndex].skillname;
                user.skills[skillIndex].experiences = experiences || user.skills[skillIndex].experiences;
                user.skills[skillIndex].qualifications = qualifications || user.skills[skillIndex].qualifications;
                user.skills[skillIndex].languages = languagesArray.length ? languagesArray : user.skills[skillIndex].languages;
                user.skills[skillIndex].certificates = Array.from(new Set([...user.skills[skillIndex].certificates, ...newCertificates]));
            } else {
                // Add new skill
                user.skills.push({
                    skillname,
                    experiences,
                    qualifications,
                    languages: languagesArray, // Use the parsed languages array
                    certificates: newCertificates,
                    status: "Pending" // Default status
                });
            }

            // Save updated user details
            await user.save();

            res.status(200).json({
                message: "Skills and certificates updated successfully",
                data: {
                    skills: user.skills,
                    certificates: newCertificates
                }
            });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.login = async (req, res, next) => {
    try {
        const { phonenumber, password } = req.body;

        // Find the user by phone number
        const user = await UserModel.findOne({ phonenumber });
        if (!user) {
            return res.status(404).json({ message: "User with this phone number not found" });
        }

       
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Successful login
        res.status(200).json({
            message: "Login successful",
            data: {
                userId: user._id,
                username: user.username,
                email: user.email,
                phonenumber: user.phonenumber,
                image: user.image,
                skills: user.skills
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// forget passowrd

exports.updatePassword = async (req, res, next) => {
    try {
        const { phonenumber, newPassword } = req.body;  // Extract phone number and new password from request body

        // Validate input
        if (!phonenumber || !newPassword) {
            return res.status(400).json({ error: 'Phone number and new password are required' });
        }

        // Find the user by phone number
        const user = await UserModel.findOne({ phonenumber });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's password
        user.password = newPassword;  // Set new password

        // Save the updated user details
        await user.save();

        res.status(200).json({ message: "Password updated successfully", data: user });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


// UpDatePhonenumber

exports.updatePhoneNumber = async (req, res, next) => {
    try {
        const { id } = req.params;  // Use id from URL params
        const { phonenumber } = req.body;  // Only phonenumber is considered for update

        // Validate that phonenumber is provided
        if (!phonenumber) {
            return res.status(400).json({ error: 'Phonenumber is required' });
        }

        // Find the user by id and update the phonenumber
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,                  // Search criteria (find by id)
            { phonenumber },     // Fields to update
            { new: true }        // Return the updated document
        );

        // If the user with the given id is not found
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If update is successful
        res.status(200).json({ message: "Phonenumber updated successfully", data: updatedUser });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// get by phonenumber

exports.getUserByPhoneNumber = async (req, res, next) => {
    try {
        const { phonenumber } = req.params;  // Get phone number from request parameters

        if (!phonenumber) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Find user by phone number
        const user = await UserModel.findOne({ phonenumber });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with the user data
        return res.status(200).json({ message: 'User found', data: user });
    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong', message: err.message });
    }
};

exports.getUserSkill = async (req, res, next) => {
    try {
        const { phonenumber } = req.params;  // Get phone number from request parameters
        const { skillname } = req.body;      // Get skill name from request body

        if (!phonenumber || !skillname) {
            return res.status(400).json({ error: 'Phone number and skill name are required' });
        }

        // Find user by phone number
        const user = await UserModel.findOne({ phonenumber });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the specific skill from the user's skills array
        const skill = user.skills.find(skill => skill.skillname.toLowerCase() === skillname.toLowerCase());

        if (!skill) {
            return res.status(404).json({ error: 'Skill not found for this user' });
        }

        // Respond with the specific skill data
        return res.status(200).json({ message: 'Skill found', skill });
    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong', message: err.message });
    }
};




