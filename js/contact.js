// Contact Form Management
class ContactManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupMapInteractions()
  }

  setupEventListeners() {
    // Contact form submission
    const contactForm = document.getElementById("contact-form")
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleContactSubmission(e)
      })
    }

    // Form validation
    const formInputs = document.querySelectorAll("#contact-form input, #contact-form select, #contact-form textarea")
    formInputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input))
      input.addEventListener("input", () => this.clearFieldError(input))
    })
  }

  setupMapInteractions() {
    // Map marker interactions
    const mapMarkers = document.querySelectorAll(".map-marker")
    mapMarkers.forEach((marker) => {
      marker.addEventListener("click", () => {
        this.showLocationInfo(marker.dataset.location)
      })
    })
  }

  validateField(field) {
    const value = field.value.trim()
    let isValid = true
    let errorMessage = ""

    // Remove existing error styling
    this.clearFieldError(field)

    // Required field validation
    if (field.hasAttribute("required") && !value) {
      isValid = false
      errorMessage = "Este campo es obligatorio"
    }

    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        isValid = false
        errorMessage = "Ingresa un email válido"
      }
    }

    // Phone validation
    if (field.type === "tel" && value) {
      const phoneRegex = /^[+]?[0-9\s\-$$$$]{8,}$/
      if (!phoneRegex.test(value)) {
        isValid = false
        errorMessage = "Ingresa un teléfono válido"
      }
    }

    // Show error if validation fails
    if (!isValid) {
      this.showFieldError(field, errorMessage)
    }

    return isValid
  }

  showFieldError(field, message) {
    field.style.borderColor = "#dc3545"

    // Remove existing error message
    const existingError = field.parentNode.querySelector(".field-error")
    if (existingError) {
      existingError.remove()
    }

    // Add error message
    const errorElement = document.createElement("div")
    errorElement.className = "field-error"
    errorElement.textContent = message
    errorElement.style.cssText = `
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        `

    field.parentNode.appendChild(errorElement)
  }

  clearFieldError(field) {
    field.style.borderColor = ""
    const errorElement = field.parentNode.querySelector(".field-error")
    if (errorElement) {
      errorElement.remove()
    }
  }

  handleContactSubmission(e) {
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    // Validate all fields
    const form = e.target
    const fields = form.querySelectorAll("input[required], select[required], textarea[required]")
    let isFormValid = true

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isFormValid = false
      }
    })

    if (!isFormValid) {
      this.showNotification("Por favor corrige los errores en el formulario", "error")
      return
    }

    // Simulate form submission
    this.submitContactForm(data)
  }

  async submitContactForm(data) {
    // Show loading state
    const submitBtn = document.querySelector('#contact-form button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.textContent = "Enviando..."
    submitBtn.disabled = true

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save to localStorage for demo purposes
      const contacts = JSON.parse(localStorage.getItem("contactSubmissions") || "[]")
      contacts.push({
        ...data,
        id: Date.now(),
        date: new Date().toISOString(),
        status: "pending",
      })
      localStorage.setItem("contactSubmissions", JSON.stringify(contacts))

      // Show success message
      this.showNotification("¡Mensaje enviado exitosamente! Te contactaremos pronto.", "success")

      // Reset form
      document.getElementById("contact-form").reset()
    } catch (error) {
      this.showNotification("Error al enviar el mensaje. Inténtalo nuevamente.", "error")
    } finally {
      // Restore button state
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    }
  }

  showLocationInfo(locationId) {
    const locations = {
      santiago: {
        name: "Santiago Centro",
        address: "Av. Libertador Bernardo O'Higgins 1234",
        city: "Santiago, Región Metropolitana",
        phone: "+56 2 2345 6789",
        hours: "Lun-Vie: 8:00-18:00, Sáb: 9:00-14:00",
      },
      lascondes: {
        name: "Las Condes",
        address: "Av. Apoquindo 5678",
        city: "Las Condes, Región Metropolitana",
        phone: "+56 2 2345 6790",
        hours: "Lun-Vie: 8:00-18:00, Sáb: 9:00-14:00",
      },
      valparaiso: {
        name: "Valparaíso",
        address: "Av. Pedro Montt 9012",
        city: "Valparaíso, Región de Valparaíso",
        phone: "+56 32 234 5678",
        hours: "Lun-Vie: 8:30-17:30, Sáb: 9:00-13:00",
      },
      concepcion: {
        name: "Concepción",
        address: "Av. Colón 3456",
        city: "Concepción, Región del Biobío",
        phone: "+56 41 234 5678",
        hours: "Lun-Vie: 8:30-17:30, Sáb: 9:00-13:00",
      },
    }

    const location = locations[locationId]
    if (!location) return

    // Create and show location modal
    const modal = document.createElement("div")
    modal.className = "modal-overlay"
    modal.style.display = "flex"
    modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h3>${location.name}</h3>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 1rem;">
                        <strong>Dirección:</strong><br>
                        ${location.address}<br>
                        ${location.city}
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <strong>Teléfono:</strong><br>
                        ${location.phone}
                    </div>
                    <div>
                        <strong>Horarios:</strong><br>
                        ${location.hours}
                    </div>
                </div>
            </div>
        `

    document.body.appendChild(modal)

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove()
      }
    })
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    // Style the notification
    const bgColor = type === "success" ? "#d4edda" : type === "error" ? "#f8d7da" : "#d1ecf1"
    const textColor = type === "success" ? "#155724" : type === "error" ? "#721c24" : "#0c5460"
    const borderColor = type === "success" ? "#c3e6cb" : type === "error" ? "#f5c6cb" : "#bee5eb"

    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "1rem 1.5rem",
      backgroundColor: bgColor,
      color: textColor,
      border: `1px solid ${borderColor}`,
      borderRadius: "6px",
      zIndex: "10000",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      maxWidth: "400px",
    })

    document.body.appendChild(notification)

    // Remove after 5 seconds
    setTimeout(() => {
      notification.remove()
    }, 5000)
  }
}

// FAQ Toggle Function
function toggleFAQ(element) {
  const faqItem = element.closest(".faq-item")
  const isActive = faqItem.classList.contains("active")

  // Close all FAQ items
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active")
  })

  // Open clicked item if it wasn't active
  if (!isActive) {
    faqItem.classList.add("active")
  }
}

// Initialize contact manager when page loads
document.addEventListener("DOMContentLoaded", () => {
  new ContactManager()
})
