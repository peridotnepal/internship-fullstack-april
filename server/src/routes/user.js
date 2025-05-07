const { Router } = require("express");
const app = Router();
const { getUsers, createUser, deleteUser, updateUser } = require("../controllers/user");

app.get('/users', getUsers);

app.post('/users', createUser);

app.put('/users/:id', updateUser);

app.delete('/users/:id', deleteUser);

module.exports = app;