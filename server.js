const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

// Predefined data
const users = [
  {
    userName: 'admin',
    password: '123'
  }
]

// API endpoint for login
app.post('/api/login', (req, res) => {
  const { userName, password } = req.body

  console.log('Login attempt:', { userName, password })

  // Check login credentials
  const user = users.find(
    u => u.userName === userName && u.password === password
  )

  if (user) {
    res.json({
      success: true,
      message: 'Login successful!',
      user: { userName: user.userName }
    })
  } else {
    res.status(401).json({
      success: false,
      message: 'Username or password is incorrect!'
    })
  }
})

// Serve Vue.js app for non-API routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/welcome', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
