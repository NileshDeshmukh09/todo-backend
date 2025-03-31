const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPIs() {
  try {
    console.log('Testing API endpoints...\n');

    // Test GET /api/todos
    console.log('Testing GET /api/todos');
    const todosResponse = await axios.get(`${BASE_URL}/todos`);
    console.log('Status:', todosResponse.status);
    console.log('Response:', todosResponse.data);
    console.log('\n');

    // Test POST /api/todos
    console.log('Testing POST /api/todos');
    const newTodo = {
      title: 'Test Todo',
      description: 'This is a test todo',
      priority: 'medium',
      tags: ['test'],
      assignedUsers: []
    };
    const createResponse = await axios.post(`${BASE_URL}/todos`, newTodo);
    console.log('Status:', createResponse.status);
    console.log('Response:', createResponse.data);
    console.log('\n');

    const todoId = createResponse.data._id;

    // Test GET /api/todos/:id
    console.log('Testing GET /api/todos/:id');
    const getTodoResponse = await axios.get(`${BASE_URL}/todos/${todoId}`);
    console.log('Status:', getTodoResponse.status);
    console.log('Response:', getTodoResponse.data);
    console.log('\n');

    // Test PUT /api/todos/:id
    console.log('Testing PUT /api/todos/:id');
    const updateTodo = {
      title: 'Updated Test Todo',
      completed: true
    };
    const updateResponse = await axios.put(`${BASE_URL}/todos/${todoId}`, updateTodo);
    console.log('Status:', updateResponse.status);
    console.log('Response:', updateResponse.data);
    console.log('\n');

    // Test POST /api/todos/:id/notes
    console.log('Testing POST /api/todos/:id/notes');
    const newNote = {
      content: 'This is a test note'
    };
    const noteResponse = await axios.post(`${BASE_URL}/todos/${todoId}/notes`, newNote);
    console.log('Status:', noteResponse.status);
    console.log('Response:', noteResponse.data);
    console.log('\n');

    // Test GET /api/todos/export/csv
    console.log('Testing GET /api/todos/export/csv');
    const exportResponse = await axios.get(`${BASE_URL}/todos/export/csv`);
    console.log('Status:', exportResponse.status);
    console.log('Response type:', typeof exportResponse.data);
    console.log('\n');

    // Test DELETE /api/todos/:id
    console.log('Testing DELETE /api/todos/:id');
    const deleteResponse = await axios.delete(`${BASE_URL}/todos/${todoId}`);
    console.log('Status:', deleteResponse.status);
    console.log('Response:', deleteResponse.data);
    console.log('\n');

    console.log('All API tests completed successfully!');
  } catch (error) {
    console.error('Error testing APIs:', error.response ? error.response.data : error.message);
  }
}

testAPIs(); 