const express = require('express');
const cors = require('cors');
const { processHierarchy } = require('./utils/processor');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - Make sure these are in the right order
app.use(cors());

// Parse JSON bodies - explicitly handle content type
app.use(express.json({
    type: ['application/json', 'application/json; charset=utf-8', 'text/plain']
}));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Logging middleware for debugging
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
});

// POST /bfhl endpoint
app.post('/bfhl', (req, res) => {
    console.log('Received POST request to /bfhl');
    console.log('Body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));
    
    try {
        const { data } = req.body;
        
        // Check if data exists
        if (!req.body || !data) {
            return res.status(400).json({
                error: "Invalid request body. Expected { data: string[] }",
                received: req.body,
                contentType: req.get('Content-Type')
            });
        }
        
        // Check if data is an array
        if (!Array.isArray(data)) {
            return res.status(400).json({
                error: "Invalid request body. 'data' must be an array",
                received: data
            });
        }

        const result = {
            user_id: "AdityaKumarSingh_09112005",
            email_id: "aa5527@srmist.edu.in",
            college_roll_number: "RA2311003010916",
            ...processHierarchy(data)
        };

        console.log('Sending response:', JSON.stringify(result, null, 2));
        res.json(result);
        
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
});

// Also handle /bhfl as a fallback (common typo)
app.post('/bhfl', (req, res) => {
    console.log('Received request to /bhfl (typo redirect)');
    const { data } = req.body;
    
    if (!data || !Array.isArray(data)) {
        return res.status(400).json({
            error: "Invalid request body. Expected { data: string[] }"
        });
    }

    const result = {
        user_id: "AdityaKumarSingh_09112005",
        email_id: "aa5527@srmist.edu.in",
        college_roll_number: "RA2311003010916",
        ...processHierarchy(data)
    };

    res.json(result);
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: "API is running" });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test the API at: http://localhost:${PORT}/bfhl`);
});