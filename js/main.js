// HuertoHogar Main JavaScript
class HuertoHogar {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("huertohogar-cart")) || []
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.updateCartCount()
    this.loadFeaturedProducts()
    this.setupSmoothScrolling()
  }

  setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")
    const navMenu = document.getElementById("navMenu")

    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active")
        mobileMenuBtn.classList.toggle("active")
      })
    }

    // Search functionality
    const searchBtn = document.getElementById("searchBtn")
    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        this.toggleSearch()
      })
    }

    // Cart functionality - Updated to use new shopping cart system
    const cartBtn = document.getElementById("cartBtn")
    if (cartBtn) {
      cartBtn.addEventListener("click", () => {
        if (window.shoppingCart) {
          window.shoppingCart.toggleCart()
        } else {
          this.toggleCart()
        }
      })
    }

    // Login functionality
    const loginBtn = document.getElementById("loginBtn")
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        this.showLogin()
      })
    }

    // Newsletter form
    const newsletterForm = document.getElementById("newsletterForm")
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleNewsletterSignup(e)
      })
    }

    // Navigation links - updated to handle productos page
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href")
        if (href === "productos.html") {
          // Let the browser handle the navigation to productos.html
          return
        } else if (href.startsWith("#")) {
          e.preventDefault()
          this.scrollToSection(href)
        }
      })
    })

    const viewProductsBtn = document.querySelector(".hero-actions .btn-primary")
    if (viewProductsBtn) {
      viewProductsBtn.addEventListener("click", () => {
        window.location.href = "productos.html"
      })
    }
  }

  setupSmoothScrolling() {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = "smooth"
  }

  scrollToSection(sectionId) {
    const section = document.querySelector(sectionId)
    if (section) {
      const headerHeight = document.querySelector(".header").offsetHeight
      const sectionTop = section.offsetTop - headerHeight

      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      })

      // Update active nav link
      this.updateActiveNavLink(sectionId)
    }
  }

  updateActiveNavLink(activeSection) {
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === activeSection) {
        link.classList.add("active")
      }
    })
  }

  toggleSearch() {
    // Create search overlay if it doesn't exist
    let searchOverlay = document.getElementById("searchOverlay")

    if (!searchOverlay) {
      searchOverlay = this.createSearchOverlay()
      document.body.appendChild(searchOverlay)
    }

    searchOverlay.classList.toggle("active")

    if (searchOverlay.classList.contains("active")) {
      const searchInput = searchOverlay.querySelector("input")
      setTimeout(() => searchInput.focus(), 100)
    }
  }

  createSearchOverlay() {
    const overlay = document.createElement("div")
    overlay.id = "searchOverlay"
    overlay.className = "search-overlay"
    overlay.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <input type="text" placeholder="Buscar productos..." class="search-input">
                    <button class="search-close">&times;</button>
                </div>
                <div class="search-results">
                    <p class="search-placeholder">Escribe para buscar productos frescos...</p>
                </div>
            </div>
        `

    // Add styles
    const style = document.createElement("style")
    style.textContent = `
            .search-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 1000;
                display: none;
                align-items: flex-start;
                justify-content: center;
                padding-top: 100px;
            }
            .search-overlay.active {
                display: flex;
            }
            .search-container {
                background: white;
                border-radius: var(--radius-lg);
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow: hidden;
            }
            .search-header {
                display: flex;
                align-items: center;
                padding: var(--spacing-4);
                border-bottom: 1px solid var(--gray-200);
            }
            .search-input {
                flex: 1;
                border: none;
                outline: none;
                font-size: var(--font-size-lg);
                padding: var(--spacing-2);
            }
            .search-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                padding: var(--spacing-2);
                color: var(--gray-500);
            }
            .search-results {
                padding: var(--spacing-4);
                max-height: 400px;
                overflow-y: auto;
            }
            .search-placeholder {
                text-align: center;
                color: var(--gray-500);
                font-style: italic;
            }
        `
    document.head.appendChild(style)

    // Add event listeners
    const closeBtn = overlay.querySelector(".search-close")
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("active")
    })

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active")
      }
    })

    return overlay
  }

  toggleCart() {
    console.log("[v0] Cart toggled, items:", this.cart.length)
    // Fallback if shopping cart system isn't loaded
    if (window.shoppingCart) {
      window.shoppingCart.toggleCart()
    } else {
      alert("Carrito de compras cargando...")
    }
  }

  showLogin() {
    console.log("[v0] Login button clicked")
    // This will be implemented in the authentication phase                /*hacer el autenticador*/
    alert("Sistema de login - Próximamente en la siguiente fase")
  }

  updateCartCount() {
    const cartCount = document.getElementById("cartCount")
    if (cartCount) {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0)
      cartCount.textContent = totalItems
    }
  }

  loadFeaturedProducts() {
    const productsGrid = document.getElementById("productsGrid")
    if (!productsGrid) return

    // Sample featured products
    const featuredProducts = [
        {
        id: 1,
        name: "Tomates Cherry Orgánicos",
        price: 2500,
        image: "../img/tomates_cherry.jpg",
        category: "verduras",
        organic: true,
      },
      {
        id: 2,
        name: "Palta Hass Premium",
        price: 1800,
        image: "../img/palta.jpg",
        category: "frutas",
        organic: false,
      },
      {
        id: 3,
        name: "Lechuga Hidropónica",
        price: 1200,
        image: "../img/lechuga_hidroponica.jpg",
        category: "verduras",
        organic: true,
      },
      /* productos destacados adicionales
      {
        id: 14,
        name: "Frutillas del Sur",
        price: 3200,
        image: "../img/frutillas.jpg",
        category: "frutas",
        organic: true,
      },
      */
    ]


    productsGrid.innerHTML = featuredProducts
      .map(
        (product) => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.organic ? '<span class="organic-badge">Orgánico</span>' : ""}
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">$${product.price.toLocaleString("es-CL")}</div>
                    <button class="btn btn-primary product-add-btn" onclick="huertoHogar.addToCart(${product.id})">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `,
      )
      .join("")

    // Add product card styles
    this.addProductCardStyles()
  }

  addProductCardStyles() {
    const style = document.createElement("style")
    style.textContent = `
            .product-card {
                background: white;
                border-radius: var(--radius-lg);
                overflow: hidden;
                box-shadow: var(--shadow-sm);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                cursor: pointer;
            }
            .product-card:hover {
                transform: translateY(-4px);
                box-shadow: var(--shadow-lg);
            }
            .product-image {
                position: relative;
                height: 200px;
                overflow: hidden;
            }
            .product-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .organic-badge {
                position: absolute;
                top: var(--spacing-2);
                right: var(--spacing-2);
                background: var(--secondary-green);
                color: white;
                padding: var(--spacing-1) var(--spacing-2);
                border-radius: var(--radius-sm);
                font-size: var(--font-size-xs);
                font-weight: 600;
            }
            .product-info {
                padding: var(--spacing-4);
            }
            .product-category {
                color: var(--gray-500);
                font-size: var(--font-size-sm);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .product-name {
                font-size: var(--font-size-lg);
                font-weight: 600;
                color: var(--gray-800);
                margin: var(--spacing-2) 0;
            }
            .product-price {
                font-size: var(--font-size-xl);
                font-weight: 700;
                color: var(--primary-green);
                margin-bottom: var(--spacing-4);
            }
            .product-add-btn {
                width: 100%;
                justify-content: center;
            }
        `
    document.head.appendChild(style)
  }

  addToCart(productId) {
    console.log("[v0] Adding product to cart:", productId)

    if (window.shoppingCart) {
      // Find product data (this would normally come from an API)
      const featuredProducts = [
        {
          id: 1,
          name: "Tomates Cherry Orgánicos",
          price: 2500,
          image: "fresh-organic-cherry-tomatoes.jpg",
        },
        {
          id: 2,
          name: "Palta Hass Premium",
          price: 1800,
          image: "premium-hass-avocados.jpg",
        },
        {
          id: 3,
          name: "Lechuga Hidropónica",
          price: 1200,
          image: "fresh-hydroponic-lettuce.jpg",
        },
        {
          id: 4,
          name: "Frutillas del Sur",
          price: 3200,
          image: "fresh-southern-strawberries.jpg",
        },
      ]

      const product = featuredProducts.find((p) => p.id === productId)
      if (product) {
        window.shoppingCart.addItem(product)
      }
    } else {
      alert(`Producto ${productId} agregado al carrito - Sistema de carrito cargando...`)
    }
  }

  handleNewsletterSignup(e) {
    const formData = new FormData(e.target)
    const email = formData.get("email") || e.target.querySelector('input[type="email"]').value

    console.log("[v0] Newsletter signup:", email)

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert("Por favor ingresa un correo electrónico válido")
      return
    }

    // Simulate API call
    setTimeout(() => {
      alert("¡Gracias por suscribirte! Recibirás nuestras mejores ofertas.")
      e.target.reset()
    }, 500)
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.huertoHogar = new HuertoHogar()
})

// Handle scroll events for navigation
window.addEventListener("scroll", () => {
  const sections = ["inicio", "productos", "nosotros", "ubicaciones", "contacto"]
  const scrollPosition = window.scrollY + 100

  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      const sectionTop = section.offsetTop
      const sectionBottom = sectionTop + section.offsetHeight

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        window.huertoHogar?.updateActiveNavLink(`#${sectionId}`)
      }
    }
  })
})
