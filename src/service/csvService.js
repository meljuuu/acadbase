import axios from 'axios';
import MasterlistService from './MasterlistService';

const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const lines = text.split(/\r\n|\n/);
      if (lines.length < 2) return resolve([]);
      
      const headers = lines[0].split(',').map(h => h.trim());
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
        const student = {};
        
        headers.forEach((header, j) => {
          let value = values[j] ? values[j].trim().replace(/^"|"$/g, '') : '';
          
          // Fix scientific notation for LRN
          if (header === 'LRN' && value.includes('E+')) {
            value = value.includes('.') 
              ? value.replace('.', '').split('E+')[0] 
              : value;
          }
          
          student[header] = value || null;
        });
        
        result.push(student);
      }
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const uploadCSV = async (file) => {
  try {
    await MasterlistService.processCsvAndAddStudents(file);
  } catch (error) {
    throw new Error("CSV upload failed: " + error.message);
  }
};

export default {
  parseCSV,
  uploadCSV,
};
