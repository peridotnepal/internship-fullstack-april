const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUsers =  async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({message: "here are the users" , users});
}

const createUser = async (req, res) => {
  const { name, email, age } = req.body;
  const user = await prisma.user.create({ data: { name, email, age }});
  res.json({user, message: "user created " });
}

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  const user = await prisma.user.update({ where: { id: parseInt(id) }, data: { name, email, age } });
  res.json({user, message: 'user updated successfully'});
}

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({ where: { id: parseInt(id) } });
  res.json({user, message: "user deleted"});
}

module.exports = {getUsers, createUser, deleteUser, updateUser}