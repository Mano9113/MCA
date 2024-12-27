const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/User'); 
const Employee = require('./models/Employee');
const sm = require('./models/StudentMarks');
const db = require('./db/dbConnection'); 
const { generateAuthToken, validateAuthToken } = require('./middleware'); 

const app = express();
app.use(express.json());
app.use(cors());
db(); 

app.post('/checkUser2', async (req, res) => {
  console.log("working...")
});


// Create a user (Signup)
app.post('/createSign', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username: email, password: hashedPassword });
    await newUser.save();

    res.send({ message: 'User Created Successfully' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send({ message: 'Error creating user', error: err.message });
  }
});

// User login (Check credentials and generate token)
app.post('/checkUser', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userC = await User.findOne({ username });
    if (!userC) {
      return res.status(401).send({ message: 'Credentials Are Wrong' });
    }

    const isPasswordValid = await bcrypt.compare(password, userC.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Credentials Are Wrong' });
    }

    const token = generateAuthToken(username);
    res.send({ message: 'User Checked Successfully', token });
  } catch (err) {
    console.error('Error checking user:', err);
    res.status(500).send({ message: 'An error occurred while checking the credentials', error: err.message });
  }
});

app.post('/addStudentsMarks', async (req, res) => {
  try {
    const { name, date, kannada, english, physics, chemistry, mathematics, biology } = req.body;
    const studentClass = req.body['class'];

    // Create a new record directly without duplicate checks
    const addStudents = new sm({
      Name: name,
      Date: date,
      Class: studentClass,
      KANNADA: kannada,
      ENGLISH: english,
      PHYSICS: physics,
      CHEMISTRY: chemistry,
      MATHEMATICS: mathematics,
      BIOLOGY: biology,
    });

    await addStudents.save();
    console.log('Student Marks Added:', addStudents);

    res.status(200).send({ message: 'Student Marks Added Successfully', addStudents });
  } catch (err) {
    console.error('Error adding student marks:', err.message);
    res.status(500).send({ message: 'Error adding student marks', error: err.message });
  }
});

// API to get distinct student names
app.get('/getDistinctNames',  async (req, res) => {
  try {
    const distinctNames = await sm.distinct('Name'); // Fetch distinct names
    if (!distinctNames || distinctNames.length === 0) {
      return res.status(404).send({ message: 'No student names found' });
    }
    res.status(200).json(distinctNames);
  } catch (err) {
    console.error('Error fetching distinct names:', err.message);
    res.status(500).send({ message: 'Error fetching distinct names', error: err.message });
  }
});

// API to get distinct classes
app.get('/getDistinctClasses',  async (req, res) => {
  try {
    const distinctClasses = await sm.distinct('Class'); // Fetch distinct classes
    if (!distinctClasses || distinctClasses.length === 0) {
      return res.status(404).send({ message: 'No classes found' });
    }
    res.status(200).json(distinctClasses);
  } catch (err) {
    console.error('Error fetching distinct classes:', err.message);
    res.status(500).send({ message: 'Error fetching distinct classes', error: err.message });
  }
});

app.get('/getChartData', async (req, res) => {
  try {
    const { name, startDate, endDate } = req.query;
    const studentClass = req.query.class; // Assuming 'class' is part of query params

    const filters = {};

    // Apply filters
    if (name) filters.Name = name; // Case-insensitive regex for Name
    if (studentClass) filters.Class = studentClass; // Case-insensitive regex for Class
    if (startDate && filters.Date < new Date(startDate)) return false;
    if (endDate && filters.Date > new Date(endDate)) return false;

    console.log('Filters:', filters);

    // Fetch data with timeout
    const studentData = await sm.find(filters).maxTimeMS(30000); // 30 seconds timeout

    if (!studentData || studentData.length === 0) {
      return res.status(404).send({ message: 'No data found matching the filters' });
    }

    res.status(200).json(studentData);
  } catch (err) {
    console.error('Error fetching chart data:', {
      message: err.message,
      // filters,
      stack: err.stack,
    });
    res.status(500).send({ message: 'Error fetching chart data', error: err.message });
  }
});

// Fetch filtered chart data
  // app.get('/getChartData', validateAuthToken(), async (req, res) => {
  //   try {
  //     const { gender, age, startDate, endDate } = req.query;

  //     const filters = {};
  //     if (gender) filters.Gender = gender;
  //     if (age) filters.Age = age;

  //     const employees = await Employee.find(filters);

  //     // Handle date filtering manually
  //     const filteredData = employees.filter((emp) => {
  //       if (startDate || endDate) {
  //         const empDate = new Date(emp.Day.split('/').reverse().join('-')); // Convert DD/MM/YYYY to Date
  //         if (startDate && empDate < new Date(startDate)) return false;
  //         // if (endDate && empDate > new Date(endDate)) return false;
  //       }
  //       return true;
  //     });

  //     console.log('Filtered data:', startDate, endDate);
  //     if (!filteredData || filteredData.length === 0) {
  //       return res.status(404).send({ message: 'No data found matching the filters' });
  //     }

  //     res.status(200).json(filteredData);
  //   } catch (err) {
  //     console.error('Error fetching chart data:', err.message);
  //     res.status(500).send('Error fetching chart data');
  //   }
  // });

// Verify token validity
app.get('/verifyToken', validateAuthToken(), async (req, res) => {
  res.status(200).send({ message: 'Token is valid' });
});

// Start the server
const PORT = 3002;
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
