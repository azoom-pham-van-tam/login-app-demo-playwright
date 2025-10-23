const { createApp } = Vue
const { createRouter, createWebHistory } = VueRouter

// Login Component
const LoginComponent = {
  template: `
        <div class="container">
            <form @submit.prevent="handleLogin" class="login-form">
                <h2>Login</h2>
                
                <div class="form-group">
                    <label for="userName">Username:</label>
                    <input 
                        type="text" 
                        id="userName"
                        v-model="formData.userName" 
                        required 
                        :disabled="isLoading"
                        placeholder="Enter username"
                    >
                </div>
                
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input 
                        type="password" 
                        id="password"
                        v-model="formData.password" 
                        required 
                        :disabled="isLoading"
                        placeholder="Enter password"
                    >
                </div>
                
                <button type="submit" class="btn" :disabled="isLoading">
                    {{ isLoading ? 'Logging in...' : 'Login' }}
                </button>
                
                <div v-if="isLoading" class="loading">
                    <p>Processing...</p>
                </div>
                
                <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 5px; font-size: 14px;">
                    <strong>Login Credentials:</strong><br>
                    Username: <code>admin</code><br>
                    Password: <code>123</code>
                </div>
            </form>
        </div>
    `,
  data() {
    return {
      formData: {
        userName: '',
        password: ''
      },
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const response = await axios.post('/api/login', this.formData)

        if (response.data.success) {
          // Save user info to localStorage
          localStorage.setItem('user', JSON.stringify(response.data.user))
          localStorage.setItem('isLoggedIn', 'true')

          // Redirect to home page
          this.$router.push('/welcome')
        } else {
          this.errorMessage = response.data.message
        }
      } catch (error) {
        console.error('Login error:', error)
        this.errorMessage =
          error.response?.data?.message || 'An error occurred during login!'
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted() {
    // Check if already logged in then redirect
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.$router.push('/welcome')
    }
  }
}

// Welcome Component
const WelcomeComponent = {
  template: `
        <div class="container">
            <div class="welcome-container">
                <h1>🎉 Welcome!</h1>
                
                <div v-if="user" class="user-info">
                    <strong>Hello, {{ user.userName }}!</strong><br>
                    <small>You have successfully logged into the system.</small>
                </div>
                
                <p>Welcome to the application homepage!</p>
                
                <button @click="handleLogout" class="btn logout-btn">
                    Logout
                </button>
            </div>
        </div>
    `,
  data() {
    return {
      user: null
    }
  },
  methods: {
    handleLogout() {
      // Remove login information
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')

      // Redirect to login page
      this.$router.push('/')
    }
  },
  mounted() {
    // Check login status
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')

    if (isLoggedIn === 'true' && userData) {
      this.user = JSON.parse(userData)
    } else {
      // If not logged in then redirect to login page
      this.$router.push('/')
    }
  }
}

// Configure routes
const routes = [
  {
    path: '/',
    component: LoginComponent,
    name: 'Login'
  },
  {
    path: '/welcome',
    component: WelcomeComponent,
    name: 'Welcome',
    meta: { requiresAuth: true }
  }
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (to.meta.requiresAuth && !isLoggedIn) {
    // If page requires login but user is not logged in
    next('/')
  } else if (to.path === '/' && isLoggedIn) {
    // If user is already logged in but still trying to access login page
    next('/welcome')
  } else {
    next()
  }
})

// Create Vue app
const app = createApp({})

// Use router
app.use(router)

// Mount app
app.mount('#app')
