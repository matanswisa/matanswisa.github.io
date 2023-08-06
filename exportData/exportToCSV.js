
import { spawn } from 'child_process';
const localDB = `mongodb://127.0.0.1:27017/trading-journal`;


const exportToCSV = async (collectionName, fields) => {
    try {
        const currentDate = new Date().toLocaleString().replace(/[/:\s]/g, '-'); // Format the date and time to remove special characters
        const outputFileName = `utils/backup/${collectionName}_${currentDate}.csv`;
        const mongoExportPath = 'C:\\Program Files\\MongoDB\\Server\\6.0\\bin\\mongoexport.exe'; // On Windows
 
        const exportProcess = spawn(mongoExportPath, [
            '--uri', localDB,
            '--collection', collectionName,
            '--type', 'csv',
            '--fields', fields.join(','),
            '--out', outputFileName
        ]);

        exportProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        exportProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        exportProcess.on('close', (code) => {
            console.log(`Export for ${collectionName} completed with code ${code}`);
        });
    } catch (error) {
        console.error('Error exporting to CSV:', error);
    }
};

export default exportToCSV;


