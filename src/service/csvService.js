import MasterlistService from './MasterlistService';
import * as XLSX from 'xlsx'; // Use a library like SheetJS

const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const lines = text.split(/\r\n|\n/).filter(line => line.trim());
      
      if (lines.length < 2) return resolve([]);
      
      // Parse headers and clean them
      const headers = lines[0].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
        .map(h => h.trim().replace(/^"|"$/g, ''));
      
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        // Split CSV line properly handling quoted values
        const values = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
        const student = {};
        
        headers.forEach((header, j) => {
          let value = values[j] ? values[j].trim().replace(/^"|"$/g, '') : '';
          
          // Handle LRN scientific notation
          if (header.toLowerCase().includes('lrn') && value) {
            if (value.includes('E+')) {
              // Convert scientific notation to regular number
              value = parseFloat(value).toFixed(0);
            }
            value = value.replace(/\./g, '');
          }
          
          // Map headers to expected field names
          let fieldName = header;
          switch (header.toLowerCase().replace(/\s+/g, '_')) {
            case 'student_name':
            case 'name':
              fieldName = 'Name';
              break;
            case 'lrn':
              fieldName = 'LRN';
              break;
            case 'academic_track':
            case 'track':
              fieldName = 'AcademicTrack';
              break;
            case 'curriculum':
              fieldName = 'Curriculum';
              break;
            case 'batch':
            case 's.y_batch':
            case 'sy_batch':
            case 'school_year':
              fieldName = 'syBatch';
              break;
            case 'birthday':
            case 'birthdate':
            case 'birth_date':
              fieldName = 'Birthdate';
              break;
          }
          
          student[fieldName] = value || '';
        });
        
        // Only add if we have required fields
        if (student.LRN && student.Name) {
          result.push(student);
        }
      }
      
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      // Process and format the data
      const processedData = jsonData.map(row => {
        // Handle birthdate formatting
        let birthdate = row.birthdate || row.birthday || row.birth_date;
        if (birthdate) {
          // If it's an Excel date number
          if (typeof birthdate === 'number') {
            const date = new Date(Math.round((birthdate - 25569) * 86400 * 1000));
            birthdate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          } else if (typeof birthdate === 'string') {
            // Try to parse the string date
            try {
              const date = new Date(birthdate);
              if (!isNaN(date.getTime())) {
                birthdate = date.toISOString().split('T')[0];
              }
            } catch (e) {
              console.error('Error parsing date:', e);
              birthdate = null;
            }
          }
        }

        return {
          ...row,
          birthdate: birthdate,
          status: 'Not-Applicable'
        };
      });
      
      resolve(processedData);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const uploadCSV = async (file) => {
  try {
    const response = await MasterlistService.processCsvAndAddStudents(file);
    // Ensure we return a properly structured response even if stats are missing
    return {
      stats: {
        total: response.data?.stats?.total || 0,
        imported: response.data?.stats?.imported || 0,
        updated: response.data?.stats?.updated || 0,
        skipped: response.data?.stats?.skipped || 0
      }
    };
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to upload file");
    }
    throw new Error("Network error occurred");
  }
};

export default {
  parseCSV,
  parseExcel,
  uploadCSV,
};