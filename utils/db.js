import Mongoose from "mongoose";
import { spawn } from 'child_process';
import fs from 'fs';
import cron from 'node-cron';
import exportToCSV from '../exportData/exportToCSV.js';
const tradeFields = ['entryDate', 'symbol', 'status', 'netROI', 'longShort', 'contracts', 'entryPrice', 'stopPrice', 'exitPrice', 'duration', 'commission', 'netPnL', 'image', 'comments'];
const userFields = ['username', 'email', 'password', 'license', 'role'];
const localDB = `mongodb://127.0.0.1:27017/trading-journal`;
const connectDB = async () => {
    await Mongoose.connect(localDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
   // '* * * * *' each 1m for test
    console.log("MongoDB Connected");
    cron.schedule('0 0 * * *', async () => {
        try {
            // Call the export function for the 'accounts' collection
            await exportToCSV('accounts', ['AccountName', 'Label']);
            console.log('Export for accounts completed');
    
            // Call the export function for the 'trades' collection
            await exportToCSV('trades', tradeFields);
            console.log('Export for trades completed');
    
            // Call the export function for the 'users' collection
            await exportToCSV('users', userFields);
            console.log('Export for users completed');
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    });
}
export default connectDB;
