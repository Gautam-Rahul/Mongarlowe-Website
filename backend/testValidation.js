const http = require('http');

const data = JSON.stringify({
  firstName: 'Test',
  lastName: 'User2',
  email: 'test2@example.com',
  password: 'Password123'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/users/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let responseData = '';
  
  res.on('data', chunk => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response data:');
    console.log(responseData);
    
    try {
      const parsedData = JSON.parse(responseData);
      console.log('Parsed response:', parsedData);
    } catch (e) {
      console.error('Could not parse response as JSON');
    }
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();

console.log('Request sent. Waiting for response...'); 