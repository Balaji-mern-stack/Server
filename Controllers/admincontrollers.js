const Admin = require('../Models/adminmodels');
const User = require('../Models/usersmodels')

exports.create = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Both username and password are required' });
        }

        const newAdmin = new Admin({ username, password });
        await newAdmin.save();

        return res.status(201).json({ message: 'Admin created successfully', data: newAdmin });
    } catch (err) {
        console.error('Error creating admin:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const admins = await Admin.find({});
        return res.status(200).json({ message: 'Admins retrieved successfully', data: admins });
    } catch (err) {
        console.error('Error retrieving admins:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        return res.status(200).json({ message: 'Admin retrieved successfully', data: admin });
    } catch (err) {
        console.error('Error retrieving admin:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password } = req.body;

        const updatedAdmin = await Admin.findByIdAndUpdate(id, { username, password }, { new: true });
        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        return res.status(200).json({ message: 'Admin updated successfully', data: updatedAdmin });
    } catch (err) {
        console.error('Error updating admin:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteone = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAdmin = await Admin.findByIdAndDelete(id);
        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        return res.status(200).json({ message: 'Admin deleted successfully', data: deletedAdmin });
    } catch (err) {
        console.error('Error deleting admin:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

       
        if (!username || !password) {
            return res.status(400).json({ message: 'Both username and password are required' });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (admin.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        return res.status(200).json({ message: 'Login successful', data: admin });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.Status = async (req, res) => {
    const { userId, skillId, status } = req.body; // Get user ID, skill ID, and new status from request body

    // Define allowed statuses based on the schema
    const allowedStatuses = ["Approved", "Pending", "Rejected"];

    // Validate the provided status
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status provided. Allowed statuses are: Approved, Pending, Rejected" });
    }

    try {
        // Find the user and the skill by skill ID using $elemMatch
        const user = await User.findOne({
            _id: userId,
            'skills._id': skillId, // Match the skill with the specific skillId
        });

        // If user or skill is not found, return 404 error
        if (!user) {
            return res.status(404).json({ message: "User or Skill not found" });
        }

        // Find the specific skill by its _id in the skills array
        const skillToUpdate = user.skills.id(skillId);

        // If skill not found, return 404 error
        if (!skillToUpdate) {
            return res.status(404).json({ message: "Skill not found" });
        }

        // Update the skill's status to the provided status
        skillToUpdate.status = status;

        // Save the updated user document
        await user.save();

        // Send a success response with the updated skill information
        return res.status(200).json({
            message: `Skill with ID '${skillId}' status updated to '${status}' successfully.`,
            skill: skillToUpdate,
        });
    } catch (error) {
        console.error("Error updating skill status:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


