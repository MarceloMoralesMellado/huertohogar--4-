// Authentication System
class AuthSystem {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem("huertohogar-user")) || null
    this.users = JSON.parse(localStorage.getItem("huertohogar-users")) || []
    this.isAuthModalOpen = false

    this.init()
  }

  init() {
    this.createAuthModal()
    this.setupEventListeners()
    this.updateAuthUI()
  }

  createAuthModal() {
    const modal = document.createElement("div")
    modal.className = "auth-modal"
    modal.id = "authModal"
    modal.innerHTML = this.getAuthModalHTML()
    document.body.appendChild(modal)
  }

  getAuthModalHTML() {
    return `
      <div class="auth-overlay" id="authOverlay"></div>
      <div class="auth-content">
        <div class="auth-header">
          <button class="auth-close" id="authClose">&times;</button>
          <img src="../img/huerto_hogar_1.png" alt="HuertoHogar" class="auth-logo">
          <h2 class="auth-title">Bienvenido a HuertoHogar</h2>
          <p class="auth-subtitle">Accede a tu cuenta para una mejor experiencia</p>
        </div>
        <div class="auth-body">
          <div class="auth-tabs">
            <button class="auth-tab active" data-tab="login">Iniciar Sesión</button>
            <button class="auth-tab" data-tab="register">Registrarse</button>
          </div>

          <!-- Login Form -->
          <form class="auth-form active" id="loginForm">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" name="email" required>
              <div class="form-error" id="loginEmailError"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-input" name="password" required>
              <div class="form-error" id="loginPasswordError"></div>
            </div>
            <div class="form-checkbox">
              <input type="checkbox" id="rememberMe" name="rememberMe">
              <label for="rememberMe">Recordarme</label>
            </div>
            <button type="submit" class="auth-submit">Iniciar Sesión</button>
            <div class="forgot-password">
              <a href="#" id="forgotPasswordLink">¿Olvidaste tu contraseña?</a>
            </div>
          </form>

          <!-- Register Form -->
          <form class="auth-form" id="registerForm">
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-input" name="firstName" required>
              <div class="form-error" id="registerFirstNameError"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Apellido</label>
              <input type="text" class="form-input" name="lastName" required>
              <div class="form-error" id="registerLastNameError"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" name="email" required>
              <div class="form-error" id="registerEmailError"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-input" name="password" required minlength="6">
              <div class="form-error" id="registerPasswordError"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Confirmar Contraseña</label>
              <input type="password" class="form-input" name="confirmPassword" required>
              <div class="form-error" id="registerConfirmPasswordError"></div>
            </div>
            <div class="form-checkbox">
              <input type="checkbox" id="acceptTerms" name="acceptTerms" required>
              <label for="acceptTerms">Acepto los <a href="#" style="color: var(--primary-green);">términos y condiciones</a></label>
            </div>
            <button type="submit" class="auth-submit">Crear Cuenta</button>
          </form>

          <div class="auth-divider">
            <span>o continúa con</span>
          </div>

          <div class="auth-social">
            <button class="social-btn" onclick="authSystem.socialLogin('google')">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
            <button class="social-btn" onclick="authSystem.socialLogin('facebook')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continuar con Facebook
            </button>
          </div>
        </div>
      </div>
    `
  }

  setupEventListeners() {
    // Auth modal events
    document.addEventListener("click", (e) => {
      if (e.target.id === "authClose" || e.target.id === "authOverlay") {
        this.closeAuthModal()
      }

      if (e.target.id === "loginBtn" && !this.currentUser) {
        this.openAuthModal("login")
      }
    })

    // Tab switching
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("auth-tab")) {
        this.switchTab(e.target.dataset.tab)
      }
    })

    // Form submissions
    document.addEventListener("submit", (e) => {
      if (e.target.id === "loginForm") {
        e.preventDefault()
        this.handleLogin(e.target)
      }

      if (e.target.id === "registerForm") {
        e.preventDefault()
        this.handleRegister(e.target)
      }
    })

    // Profile dropdown
    document.addEventListener("click", (e) => {
      if (e.target.closest(".profile-btn")) {
        this.toggleProfileDropdown()
      } else if (!e.target.closest(".profile-dropdown")) {
        this.closeProfileDropdown()
      }
    })

    // Logout
    document.addEventListener("click", (e) => {
      if (e.target.id === "logoutBtn") {
        this.logout()
      }
    })

    // Escape key to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAuthModal()
      }
    })
  }

  // Modal Management
  openAuthModal(tab = "login") {
    console.log("[v0] Opening auth modal, tab:", tab)

    const modal = document.getElementById("authModal")
    if (modal) {
      modal.classList.add("active")
      this.isAuthModalOpen = true
      document.body.style.overflow = "hidden"

      if (tab) {
        this.switchTab(tab)
      }
    }
  }

  closeAuthModal() {
    console.log("[v0] Closing auth modal")

    const modal = document.getElementById("authModal")
    if (modal) {
      modal.classList.remove("active")
      this.isAuthModalOpen = false
      document.body.style.overflow = ""
      this.clearFormErrors()
    }
  }

  switchTab(tabName) {
    console.log("[v0] Switching to tab:", tabName)

    // Update tab buttons
    const tabs = document.querySelectorAll(".auth-tab")
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabName)
    })

    // Update forms
    const forms = document.querySelectorAll(".auth-form")
    forms.forEach((form) => {
      form.classList.toggle("active", form.id === `${tabName}Form`)
    })

    this.clearFormErrors()
  }

  // Authentication Methods
  handleLogin(form) {
    console.log("[v0] Handling login")

    const formData = new FormData(form)
    const email = formData.get("email")
    const password = formData.get("password")
    const rememberMe = formData.get("rememberMe")

    // Clear previous errors
    this.clearFormErrors()

    // Validate inputs
    if (!this.validateEmail(email)) {
      this.showFormError("loginEmailError", "Por favor ingresa un email válido")
      return
    }

    if (!password) {
      this.showFormError("loginPasswordError", "La contraseña es requerida")
      return
    }

    // Check if user exists
    const user = this.users.find((u) => u.email === email)
    if (!user) {
      this.showFormError("loginEmailError", "No existe una cuenta con este email")
      return
    }

    // Check password (in a real app, this would be hashed)
    if (user.password !== password) {
      this.showFormError("loginPasswordError", "Contraseña incorrecta")
      return
    }

    // Login successful
    this.loginUser(user, rememberMe)
  }

  handleRegister(form) {
    console.log("[v0] Handling registration")

    const formData = new FormData(form)
    const firstName = formData.get("firstName")
    const lastName = formData.get("lastName")
    const email = formData.get("email")
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")
    const acceptTerms = formData.get("acceptTerms")

    // Clear previous errors
    this.clearFormErrors()

    // Validate inputs
    if (!firstName.trim()) {
      this.showFormError("registerFirstNameError", "El nombre es requerido")
      return
    }

    if (!lastName.trim()) {
      this.showFormError("registerLastNameError", "El apellido es requerido")
      return
    }

    if (!this.validateEmail(email)) {
      this.showFormError("registerEmailError", "Por favor ingresa un email válido")
      return
    }

    // Check if email already exists
    if (this.users.find((u) => u.email === email)) {
      this.showFormError("registerEmailError", "Ya existe una cuenta con este email")
      return
    }

    if (password.length < 6) {
      this.showFormError("registerPasswordError", "La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (password !== confirmPassword) {
      this.showFormError("registerConfirmPasswordError", "Las contraseñas no coinciden")
      return
    }

    if (!acceptTerms) {
      this.showFormError("registerConfirmPasswordError", "Debes aceptar los términos y condiciones")
      return
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase(),
      password: password, // In a real app, this would be hashed
      createdAt: new Date().toISOString(),
      orders: [],
      preferences: {},
    }

    this.users.push(newUser)
    localStorage.setItem("huertohogar-users", JSON.stringify(this.users))

    // Auto-login after registration
    this.loginUser(newUser, false)
  }

  loginUser(user, rememberMe = false) {
    console.log("[v0] Logging in user:", user.email)

    // Store user session
    this.currentUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      orders: user.orders || [],
      preferences: user.preferences || {},
    }

    localStorage.setItem("huertohogar-user", JSON.stringify(this.currentUser))

    if (rememberMe) {
      localStorage.setItem("huertohogar-remember", "true")
    }

    // Update UI
    this.updateAuthUI()
    this.closeAuthModal()

    // Show success message
    this.showNotification(`¡Bienvenido${user.firstName ? ", " + user.firstName : ""}!`)
  }

  logout() {
    console.log("[v0] Logging out user")

    this.currentUser = null
    localStorage.removeItem("huertohogar-user")
    localStorage.removeItem("huertohogar-remember")

    // Update UI
    this.updateAuthUI()
    this.closeProfileDropdown()

    // Redirect to home if on profile page
    if (window.location.pathname.includes("profile")) {
      window.location.href = "index.html"
    }

    this.showNotification("Sesión cerrada correctamente")
  }

  socialLogin(provider) {
    console.log("[v0] Social login with:", provider)

    // Simulate social login
    const mockUser = {
      id: Date.now(),
      firstName: provider === "google" ? "Usuario" : "Usuario",
      lastName: provider === "google" ? "Google" : "Facebook",
      email: `usuario@${provider}.com`,
      createdAt: new Date().toISOString(),
      orders: [],
      preferences: {},
    }

    // Check if user already exists
    let existingUser = this.users.find((u) => u.email === mockUser.email)
    if (!existingUser) {
      this.users.push(mockUser)
      localStorage.setItem("huertohogar-users", JSON.stringify(this.users))
      existingUser = mockUser
    }

    this.loginUser(existingUser, false)
  }

  // UI Management
  updateAuthUI() {
    const loginBtn = document.getElementById("loginBtn")
    const navActions = document.querySelector(".nav-actions")

    if (!loginBtn || !navActions) return

    if (this.currentUser) {
      // Replace login button with profile dropdown
      const profileHTML = `
        <div class="user-profile">
          <button class="profile-btn" id="profileBtn">
            <div class="profile-avatar">${this.getInitials(this.currentUser.firstName, this.currentUser.lastName)}</div>
            <span class="profile-name">${this.currentUser.firstName}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </button>
          <div class="profile-dropdown" id="profileDropdown">
            <div class="dropdown-header">
              <div class="dropdown-user-name">${this.currentUser.firstName} ${this.currentUser.lastName}</div>
              <div class="dropdown-user-email">${this.currentUser.email}</div>
            </div>
            <div class="dropdown-menu">
              <a href="profile.html" class="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Mi Perfil
              </a>
              <a href="#" class="dropdown-item" onclick="authSystem.showOrders()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 21h12"></path>
                </svg>
                Mis Pedidos
              </a>
              <a href="#" class="dropdown-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Configuración
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item danger" id="logoutBtn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      `

      loginBtn.outerHTML = profileHTML
    } else {
      // Show login button
      const currentProfile = document.querySelector(".user-profile")
      if (currentProfile) {
        currentProfile.outerHTML = '<button class="login-btn" id="loginBtn">Ingresar</button>'
      }
    }
  }

  toggleProfileDropdown() {
    const dropdown = document.getElementById("profileDropdown")
    if (dropdown) {
      dropdown.classList.toggle("active")
    }
  }

  closeProfileDropdown() {
    const dropdown = document.getElementById("profileDropdown")
    if (dropdown) {
      dropdown.classList.remove("active")
    }
  }

  showOrders() {
    // REDIRECCIÓN CORREGIDA
    // El archivo pedidos.html está en la misma carpeta que la página actual (ej. index.html o profile.html)
    window.location.href = "pedidos.html" 
    this.closeProfileDropdown() // Cierra el menú desplegable después de hacer clic
  }

  // Utility Methods
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  getInitials(firstName, lastName) {
    const first = firstName ? firstName.charAt(0).toUpperCase() : ""
    const last = lastName ? lastName.charAt(0).toUpperCase() : ""
    return first + last || "U"
  }

  showFormError(elementId, message) {
    const errorElement = document.getElementById(elementId)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.classList.add("show")

      // Also add error class to input
      const input = errorElement.previousElementSibling
      if (input && input.classList.contains("form-input")) {
        input.classList.add("error")
      }
    }
  }

  clearFormErrors() {
    const errors = document.querySelectorAll(".form-error")
    errors.forEach((error) => {
      error.classList.remove("show")
      error.textContent = ""
    })

    const inputs = document.querySelectorAll(".form-input.error")
    inputs.forEach((input) => {
      input.classList.remove("error")
    })
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-green);
      color: white;
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 1200;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  // Public API
  getCurrentUser() {
    return this.currentUser
  }

  isLoggedIn() {
    return !!this.currentUser
  }
}

// Initialize authentication system when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.authSystem = new AuthSystem()
})
