import User from '../models/user.js';
import { roles } from './roles.js';
import bcrypt from 'bcrypt';
import Messages from '../models/messages.js';



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
        const hash = await bcrypt.hash(password, 10);
        const admin = await User.create({
            username,
            password: hash,
            email,
            role: roles.admin
        });

        console.log('Admin user created successfully:', admin);

    
        // const messageTypes = ['errors', 'warnings', 'success'];
        // for (const messageType of messageTypes) {
        //     const messages = [];

        //     for (let i = 1; i <= 1000; i++) {
        //         const msgTypeValue = getMessageTypeValue(messageType);
        //         messages.push({
        //             msgType: msgTypeValue , // Replace with actual value
        //             msgnum: i,
        //             msgtext: 'msgtext value', // Replace with actual value
        //         });
        //     }

        //     await Messages.create({
        //         type: messageType,
        //         messages: messages,
        //     });

        //     console.log(`Object with type "${messageType}" created successfully`);
        // }
    } catch (error) {
        console.error('Error:', error);
    }
    
   
};
// const getMessageTypeValue = (messageType) => {
//     switch (messageType) {
//         case 'errors':
//             return 'error';
//         case 'warnings':
//             return 'warning';
//         case 'success':
//             return 'success';
//         default:
//             return '';
//     }
// }

export default adminSeeder;
