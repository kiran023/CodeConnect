const http = require('http');

// Create a server
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {

        // Handle GET request
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        
        res.end('This is a GET request. Welcome to the Home Page!\n');

    } else if (req.method === 'POST' && req.url === '/submit') {

        // Handle POST request
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString(); // Collect data from the request
        });


        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`This is a POST request. Received data: ${body}\n`);
        });

    } else {

        // Handle other routes or methods

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Not Found\n');
    }
});

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});