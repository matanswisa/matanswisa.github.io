import User from '../models/user.js';
import { roles } from './roles.js';
import bcrypt from 'bcrypt';

const adminSeeder = async () => {
    try {
        const email = `admin@admin.com`; // Generate a random email address
        const username = 'admin';
        const password = 'adminpassword'; // You can set a desired password here

        // Check if an admin user already exists
        const adminUser = await User.findOne({ username: username });
        if (adminUser) {
            console.log('Admin user already exists');
            return;
        }

        // Create a new admin user
        bcrypt.hash(password, 10).then(async (hash) => {
            await User.create({
                username,
                password: hash,
                email,
                role: roles.basic
            })
        });

        console.log('Admin user created successfully:', admin);
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};


export default adminSeeder;
