import axios from 'axios';
import MasterlistService from './MasterlistService';

const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const lines = reader.result.split("\n");
      const headers = lines[0].split(",");
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(",");
        if (currentLine.length === headers.length) {
          const student = {};
          headers.forEach((header, j) => {
            student[header.trim()] = currentLine[j].trim();
          });
          result.push(student);
        }
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
