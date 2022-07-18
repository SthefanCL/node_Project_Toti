const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize('postgres://postgres:example@db:5432/task-list')
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

app.get('/', (req, res) => {
  let carro = {
    ruedas: req.body.ruedas,
    color: req.body.color,
    tipo: req.body.tipo
  }
  res.json(carro)
})

// List tasks
app.get('/tasks', async (req, res) => {
  const listTasks = await tasks.findAll()
  res.json({ Tasks: listTasks })
})

// Create task
app.post('/tasks', async (req, res) => {
  const body = req.body
  const task = await tasks.create({ description: body.description , done: body.done });

  res.json({Task: task})
})

// Show task
app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const task = await tasks.findByPk(taskId)
  res.json({ Tasks: task })
})

// Update task
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const body = req.body
  await tasks.update({ description: body.description , done: body.done }, {
    where: {
      id: taskId
    }
  });
  res.send({ action: 'Updating task', taskId: taskId})
})

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  await tasks.destroy({
    where: {
      id: taskId
    }
  });
  res.send({ action: 'Deleting task', taskId: taskId })
})

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
