import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INSIGHTS_FILE = path.join(__dirname, '..', 'insights.json');

export const withMetrics = async (operationName, asyncFunction) => {
    const startTime = performance.now();
    const timestamp = new Date().toISOString(); 
    
    try {
        const result = await asyncFunction();
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        
        let data = {};
        if (fs.existsSync(INSIGHTS_FILE)) {
            const fileContent = fs.readFileSync(INSIGHTS_FILE, 'utf-8');
            if (fileContent) data = JSON.parse(fileContent);
        }
        
        if (!data[operationName]) data[operationName] = [];
        if (data[operationName].length >= 50) data[operationName].shift(); 
        
        data[operationName].push({
            date: timestamp,
            startMs: Number(startTime.toFixed(2)),
            endMs: Number(endTime.toFixed(2)),
            durationMs: Number(duration)
        });
        
        fs.writeFileSync(INSIGHTS_FILE, JSON.stringify(data, null, 2));
        return result;
    } catch (error) {
        console.error(`\n[Metrics Error] Failed on ${operationName}:`, error.message, `\n`);
        throw error; 
    }
};

export const morganStream = {
    write: (message) => {
        const cleanMessage = message.trim();
        console.log(`\n[MORGAN API LOG] ${cleanMessage}\n`);

        try {
            let data = {};
            if (fs.existsSync(INSIGHTS_FILE)) {
                const fileContent = fs.readFileSync(INSIGHTS_FILE, 'utf-8');
                if (fileContent) data = JSON.parse(fileContent);
            }
            
            if (!data["API_Requests"]) data["API_Requests"] = [];
            
            // Cap at 50 to prevent unbounded file growth
            if (data["API_Requests"].length >= 50) {
                data["API_Requests"].shift();
            }
            
            data["API_Requests"].push(cleanMessage);
            fs.writeFileSync(INSIGHTS_FILE, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error(`\n[Metrics Error] Failed to write Morgan log to insights.json:`, err.message, `\n`);
        }
    }
};