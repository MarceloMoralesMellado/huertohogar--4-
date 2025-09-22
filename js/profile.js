// Profile Page Management
class ProfileManager {
  constructor() {
    this.currentUser = null
    this.init()
  }

  init() {
    // Check if user is logged in
    if (window.authSystem) {
      this.currentUser = window.authSystem.getCurrentUser()
    }

    if (!this.currentUser) {
      // Redirect to home if not logged in
      window.location.href = "index.html"
      return
    }

    this.setupEventListeners()
    this.loadUserData()
    this.loadUserStats()
  }

  setupEventListeners() {
    // Navigation between sections
    const navItems = document.querySelectorAll(".profile-nav-item")
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const section = item.dataset.section
        this.showSection(section)

        // Update active nav item
        navItems.forEach((nav) => nav.classList.remove("active"))
        item.classList.add("active")
      })
    })

    // Form submissions
    document.addEventListener("submit", (e) => {
      if (e.target.id === "personalInfoForm") {
        e.preventDefault()
        this.updatePersonalInfo(e.target)
      }

      if (e.target.id === "preferencesForm") {
        e.preventDefault()
        this.updatePreferences(e.target)
      }

      if (e.target.id === "passwordForm") {
        e.preventDefault()
        this.changePassword(e.target)
      }
    })
  }

  showSection(sectionName) {
    console.log("[v0] Showing profile section:", sectionName)

    // Hide all sections
    const sections = document.querySelectorAll(".profile-section")
    sections.forEach((section) => section.classList.remove("active"))

    // Show selected section
    const targetSection = document.getElementById(`${sectionName}Section`)
    if (targetSection) {
      targetSection.classList.add("active")
    }

    // Load section-specific data
    if (sectionName === "orders") {
      this.loadOrders()
    } else if (sectionName === "addresses") {
      this.loadAddresses()
    }
  }

  loadUserData() {
    console.log("[v0] Loading user data for profile")

    if (!this.currentUser) return

    // Update profile header
    const profileTitle = document.getElementById("profileTitle")
    const profileSubtitle = document.getElementById("profileSubtitle")
    const profileAvatarLarge = document.getElementById("profileAvatarLarge")

    if (profileTitle) {
      profileTitle.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`
    }

    if (profileSubtitle) {
      profileSubtitle.textContent = this.currentUser.email
    }

    if (profileAvatarLarge) {
      profileAvatarLarge.textContent = this.getInitials(this.currentUser.firstName, this.currentUser.lastName)
    }

    // Fill personal info form
    const personalForm = document.getElementById("personalInfoForm")
    if (personalForm) {
      const formData = {
        firstName: this.currentUser.firstName || "",
        lastName: this.currentUser.lastName || "",
        email: this.currentUser.email || "",
        phone: this.currentUser.phone || "",
        birthDate: this.currentUser.birthDate || "",
      }

      Object.keys(formData).forEach((key) => {
        const input = personalForm.querySelector(`[name="${key}"]`)
        if (input) {
          input.value = formData[key]
        }
      })
    }

    // Load preferences
    this.loadPreferences()
  }

  loadUserStats() {
    console.log("[v0] Loading user statistics")

    if (!this.currentUser) return

    const orders = this.currentUser.orders || []
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const memberSince = new Date(this.currentUser.createdAt).getFullYear()

    // Update stats display
    const totalOrdersEl = document.getElementById("totalOrders")
    const totalSpentEl = document.getElementById("totalSpent")
    const memberSinceEl = document.getElementById("memberSince")

    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders
    if (totalSpentEl) totalSpentEl.textContent = `$${totalSpent.toLocaleString("es-CL")}`
    if (memberSinceEl) memberSinceEl.textContent = memberSince
  }

  loadPreferences() {
    console.log("[v0] Loading user preferences")

    const preferences = this.currentUser.preferences || {}

    // Load category preferences
    const categories = preferences.categories || []
    categories.forEach((category) => {
      const checkbox = document.getElementById(`pref${category.charAt(0).toUpperCase() + category.slice(1)}`)
      if (checkbox) {
        checkbox.checked = true
      }
    })

    // Load notification preferences
    const notifications = preferences.notifications || ["email", "orders"]
    notifications.forEach((notification) => {
      const checkbox = document.getElementById(`${notification}Notifications`)
      if (checkbox) {
        checkbox.checked = true
      }
    })
  }

  loadOrders() {
    console.log("[v0] Loading user orders")

    const ordersContent = document.getElementById("ordersContent")
    if (!ordersContent) return

    const orders = JSON.parse(localStorage.getItem("huertohogar-orders")) || []
    const userOrders = orders.filter((order) => order.customer && order.customer.email === this.currentUser.email)

    if (userOrders.length === 0) {
      ordersContent.innerHTML = `
        <p>No tienes pedidos aún. <a href="productos.html" style="color: var(--primary-green);">¡Haz tu primer pedido!</a></p>
      `
      return
    }

    const ordersHTML = userOrders
      .map(
        (order) => `
      <div class="order-card" style="border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: var(--spacing-4); margin-bottom: var(--spacing-4);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-3);">
          <div>
            <h4 style="margin: 0; color: var(--gray-800);">Pedido #${order.orderNumber}</h4>
            <p style="margin: 0; color: var(--gray-500); font-size: var(--font-size-sm);">${new Date(order.orderDate).toLocaleDateString("es-CL")}</p>
          </div>
          <div style="text-align: right;">
            <span style="background: var(--secondary-green); color: white; padding: var(--spacing-1) var(--spacing-2); border-radius: var(--radius-sm); font-size: var(--font-size-xs);">${order.status || "Confirmado"}</span>
            <p style="margin: var(--spacing-1) 0 0; font-weight: 600; color: var(--primary-green);">$${order.total.toLocaleString("es-CL")}</p>
          </div>
        </div>
        <div style="border-top: 1px solid var(--gray-200); padding-top: var(--spacing-3);">
          <p style="margin: 0; color: var(--gray-600); font-size: var(--font-size-sm);">
            ${order.items.length} producto${order.items.length > 1 ? "s" : ""} • 
            Entrega: ${order.customer.address}, ${order.customer.city}
          </p>
        </div>
      </div>
    `,
      )
      .join("")

    ordersContent.innerHTML = ordersHTML
  }

  loadAddresses() {
    console.log("[v0] Loading user addresses")

    const addressesContent = document.getElementById("addressesContent")
    if (!addressesContent) return

    // For now, show placeholder
    addressesContent.innerHTML = `
      <p>No tienes direcciones guardadas.</p>
      <button class="btn btn-primary" onclick="profileManager.addAddress()">Agregar Dirección</button>
    `
  }

  updatePersonalInfo(form) {
    console.log("[v0] Updating personal information")

    const formData = new FormData(form)
    const updatedData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      birthDate: formData.get("birthDate"),
    }

    // Update current user
    Object.assign(this.currentUser, updatedData)

    // Update in localStorage
    localStorage.setItem("huertohogar-user", JSON.stringify(this.currentUser))

    // Update users array
    const users = JSON.parse(localStorage.getItem("huertohogar-users")) || []
    const userIndex = users.findIndex((u) => u.id === this.currentUser.id)
    if (userIndex > -1) {
      Object.assign(users[userIndex], updatedData)
      localStorage.setItem("huertohogar-users", JSON.stringify(users))
    }

    // Update auth system
    if (window.authSystem) {
      window.authSystem.currentUser = this.currentUser
      window.authSystem.updateAuthUI()
    }

    // Update profile header
    this.loadUserData()

    this.showNotification("Información personal actualizada correctamente")
  }

  updatePreferences(form) {
    console.log("[v0] Updating user preferences")

    const formData = new FormData(form)

    // Get selected categories
    const categories = []
    const categoryCheckboxes = form.querySelectorAll('input[name="categories"]:checked')
    categoryCheckboxes.forEach((checkbox) => {
      categories.push(checkbox.value)
    })

    // Get notification preferences
    const notifications = []
    const notificationCheckboxes = form.querySelectorAll('input[name="notifications"]:checked')
    notificationCheckboxes.forEach((checkbox) => {
      notifications.push(checkbox.value)
    })

    // Update preferences
    this.currentUser.preferences = {
      categories,
      notifications,
    }

    // Save to localStorage
    localStorage.setItem("huertohogar-user", JSON.stringify(this.currentUser))

    // Update users array
    const users = JSON.parse(localStorage.getItem("huertohogar-users")) || []
    const userIndex = users.findIndex((u) => u.id === this.currentUser.id)
    if (userIndex > -1) {
      users[userIndex].preferences = this.currentUser.preferences
      localStorage.setItem("huertohogar-users", JSON.stringify(users))
    }

    this.showNotification("Preferencias guardadas correctamente")
  }

  changePassword(form) {
    console.log("[v0] Changing user password")

    const formData = new FormData(form)
    const currentPassword = formData.get("currentPassword")
    const newPassword = formData.get("newPassword")
    const confirmNewPassword = formData.get("confirmNewPassword")

    // Get user from users array to check current password
    const users = JSON.parse(localStorage.getItem("huertohogar-users")) || []
    const user = users.find((u) => u.id === this.currentUser.id)

    if (!user || user.password !== currentPassword) {
      this.showNotification("La contraseña actual es incorrecta", "error")
      return
    }

    if (newPassword !== confirmNewPassword) {
      this.showNotification("Las nuevas contraseñas no coinciden", "error")
      return
    }

    if (newPassword.length < 6) {
      this.showNotification("La nueva contraseña debe tener al menos 6 caracteres", "error")
      return
    }

    // Update password
    user.password = newPassword
    localStorage.setItem("huertohogar-users", JSON.stringify(users))

    // Clear form
    form.reset()

    this.showNotification("Contraseña cambiada correctamente")
  }

  addAddress() {
    console.log("[v0] Adding new address")
    this.showNotification("Gestión de direcciones - Próximamente disponible")
  }

  getInitials(firstName, lastName) {
    const first = firstName ? firstName.charAt(0).toUpperCase() : ""
    const last = lastName ? lastName.charAt(0).toUpperCase() : ""
    return first + last || "U"
  }

  showNotification(message, type = "success") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = "notification"
    notification.textContent = message

    const bgColor = type === "error" ? "#e74c3c" : "var(--primary-green)"

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
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
}

// Initialize profile manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Wait for auth system to initialize
  setTimeout(() => {
    window.profileManager = new ProfileManager()
  }, 100)
})
