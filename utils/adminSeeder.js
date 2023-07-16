import User from '../models/user.js';
import { roles } from './roles.js';

const adminSeeder = async () => {
    try {
        const email = `admin@example.com`; // Generate a random email address
        const username = 'admin';
        const password = 'adminpassword'; // You can set a desired password here

        // Check if an admin user already exists
        const adminUser = await User.findOne({ username: 'admin' });
        if (adminUser) {
            console.log('Admin user already exists');
            return;
        }

        // Create a new admin user
        const admin = await User.create({
            email,
            username,
            password,
            role: roles.admin,
        });

        console.log('Admin user created successfully:', admin);
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};


export default adminSeeder;
