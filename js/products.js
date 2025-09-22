// Products Page JavaScript
class ProductCatalog {
  constructor() {
    this.products = []
    this.filteredProducts = []
    this.currentPage = 1
    this.productsPerPage = 12
    this.currentView = "grid"
    this.filters = {
      categories: [],
      maxPrice: 10000,
      organic: false,
      available: false,
    }
    this.sortBy = "name"

    this.init()
  }

  init() {
    this.loadProducts()

    this.setupEventListeners()
    this.renderProducts()
  }

  loadProducts() {
    // Sample product data - in a real app, this would come from an API
    this.products = [
      {
        id: 1,
        name: "Tomates Cherry Orgánicos",
        category: "verduras",
        price: 2500,
        originalPrice: null,
        image: "../img/tomates_cherry.jpg",
        description:
          "Cultivados en invernaderos especializados. Perfectos para ensaladas y snacks saludables.",
        organic: true,
        available: true,
        features: [
          "100% Orgánico",
          "Cultivado localmente",
          "Rico en antioxidantes",
          "Perfecto para ensaladas",
          "Sin pesticidas",
          "Cosecha diaria",
        ],
        producer: "Huerto San José",
        region: "Valle de Casablanca, Región de Valparaíso",
      },
      {
        id: 2,
        name: "Palta Hass Premium",
        category: "frutas",
        price: 1800,
        originalPrice: 2200,
        image: "../img/palta.jpg",
        description:
          "Paltas de primera calidad, seleccionadas cuidadosamente por su textura cremosa y sabor excepcional.",
        organic: false,
        available: true,
        features: [
          "Textura cremosa",
          "Rico en grasas saludables",
          "Perfecto para desayunos",
          "Cosecha reciente",
          "Selección premium",
          "Maduración controlada",
        ],
        producer: "Frutales del Valle",
        region: "Quillota, Región de Valparaíso",
      },
      {
        id: 3,
        name: "Lechuga Hidropónica",
        category: "verduras",
        price: 1200,
        originalPrice: null,
        image: "../img/lechuga_hidroponica.jpg",
        description:
          "Cultivada en sistemas hidropónicos de última generación. Este método da hojas más crujientes y limpias.",
        organic: true,
        available: true,
        features: [
          "Cultivo hidropónico",
          "Libre de pesticidas",
          "Textura crujiente",
          "Larga duración",
          "Sin tierra",
          "Hojas perfectas",
        ],
        producer: "Hidropónicos Chile",
        region: "Rancagua, Región de O'Higgins",
      },
      {
        id: 4,
        name: "Frutillas del Sur",
        category: "frutas",
        price: 3200,
        originalPrice: null,
        image: "../img/frutillas2.jpg",
        description:
          "Cultivadas en los campos del sur de Chile. Ideales para postres, smoothies o mermeladas o snack saludable.",
        organic: true,
        available: true,
        features: [
          "Dulzor natural",
          "Rico en vitamina C",
          "Perfecto para postres",
          "Cosecha del día",
          "Clima ideal del sur",
          "Sin químicos",
        ],
        producer: "Berries del Sur",
        region: "Puerto Varas, Región de Los Lagos",
      },
      {
        id: 5,
        name: "Zanahorias Baby",
        category: "verduras",
        price: 1500,
        originalPrice: null,
        image: "../img/zanahoria.jpg",
        description:
          "Cosechadas en su punto óptimo de maduración. Su tamaño las hace ideales para guarniciones y preparaciones gourmet.",
        organic: false,
        available: true,
        features: [
          "Tamaño perfecto",
          "Dulzor natural",
          "Rico en betacaroteno",
          "Listo para consumir",
          "Textura tierna",
          "Ideal para niños",
        ],
        producer: "Verduras Frescas",
        region: "Curicó, Región del Maule",
      },
      {
        id: 6,
        name: "Manzanas Rojas",
        category: "frutas",
        price: 2200,
        originalPrice: 2800,
        image: "../img/manzanas_rojas.jpg",
        description:
          "Rojas, crujientes y dulces. Su equilibrio perfecto entre dulzor y acidez las convierte en la fruta ideal para toda la familia.",
        organic: false,
        available: false,
        features: [
          "Textura crujiente",
          "Dulzor equilibrado",
          "Rica en fibra",
          "Perfecta para snacks",
          "Cultivo tradicional",
          "Larga conservación",
        ],
        producer: "Pomáceas del Norte",
        region: "La Serena, Región de Coquimbo",
      },
      {
        id: 7,
        name: "Espinacas Orgánicas",
        category: "verduras",
        price: 1800,
        originalPrice: null,
        image: "../img/espinaca.jpg",
        description:
          "Cultivadas sin químicos ni pesticidas. Estas verduras de hoja verde son una excelente fuente de hierro, vitaminas y minerales.",
        organic: true,
        available: true,
        features: [
          "100% Orgánico",
          "Rico en hierro",
          "Hojas tiernas",
          "Perfecto para smoothies",
          "Sin químicos",
          "Cosecha fresca",
        ],
        producer: "Verdes Orgánicos",
        region: "Melipilla, Región Metropolitana",
      },
      {
        id: 8,
        name: "Pimientos Tricolor",
        category: "verduras",
        price: 2800,
        originalPrice: null,
        image: "../img/pimientos_tricolor3.jpg",
        description:
          "Mix colorido de pimientos rojos, amarillos y verdes, seleccionados por su frescura, apariencia y sabor dulce.",
        organic: false,
        available: true,
        features: [
          "Variedad de colores",
          "Rico en vitaminas",
          "Perfecto para cocinar",
          "Sabor dulce",
          "Textura crujiente",
          "Versátil en cocina",
        ],
        producer: "Hortalizas Premium",
        region: "Copiapó, Región de Atacama",
      },
      {
        id: 9,
        name: "Albahaca Fresca",
        category: "hierbas",
        price: 800,
        originalPrice: null,
        image: "../img/albahaca.jpg",
        description:
          "De aroma intenso, indispensable en la cocina. Cultivada para mantener su frescura y propiedades aromáticas.",
        organic: true,
        available: true,
        features: [
          "Aroma intenso",
          "100% Orgánico",
          "Perfecto para pasta",
          "Cultivado localmente",
          "Hojas perfectas",
          "Cosecha diaria",
        ],
        producer: "Hierbas del Campo",
        region: "San Antonio, Región de Valparaíso",
      },
      {
        id: 10,
        name: "Brócoli Verde",
        category: "verduras",
        price: 1900,
        originalPrice: null,
        image: "../img/brocoli.jpg",
        description:
          "Conocido como uno de los superalimentos más completos. Rico en vitaminas C y K, fibra y antioxidantes.",
        organic: false,
        available: true,
        features: [
          "Rico en vitaminas",
          "Textura firme",
          "Perfecto al vapor",
          "Cosecha reciente",
          "Superalimento",
          "Versátil en cocina",
        ],
        producer: "Verduras Nutritivas",
        region: "Los Ángeles, Región del Bío Bío",
      },
      {
        id: 11,
        name: "Cilantro Orgánico",
        category: "hierbas",
        price: 600,
        originalPrice: null,
        image: "../img/cilantro.jpg",
        description:
          "De hojas frescas y aroma característico. Cultivado sin químicos, mantiene todo su sabor natural y propiedades.",
        organic: true,
        available: true,
        features: [
          "100% Orgánico",
          "Aroma característico",
          "Perfecto para salsas",
          "Hojas frescas",
          "Sin químicos",
          "Cultivo natural",
        ],
        producer: "Hierbas Orgánicas",
        region: "Maipú, Región Metropolitana",
      },
      {
        id: 12,
        name: "Uvas Rojas",
        category: "frutas",
        price: 4200,
        originalPrice: 4800,
        image: "../img/uvas_rojas.jpg",
        description:
          "Sin semillas. Cultivadas en viñedos especializados, ofrecen un sabor excepcional y una textura perfecta.",
        organic: false,
        available: true,
        features: [
          "Dulzor natural",
          "Sin semillas",
          "Rico en antioxidantes",
          "Perfecto para snacks",
          "Textura jugosa",
          "Calidad premium",
        ],
        producer: "Viñedos Frescos",
        region: "Ovalle, Región de Coquimbo",
      },
    ]
    this.filterProducts()
  }

  setupEventListeners() {
    const productGrid = document.querySelector(".products-grid")
    const searchInput = document.getElementById("searchInput")
    const categoryCheckboxes = document.querySelectorAll("input[data-category]")
    const availableCheckbox = document.querySelector('input[value="available"]')
    const priceRange = document.getElementById("priceRange")
    const sortSelect = document.getElementById("sortSelect")
    const clearFiltersBtn = document.getElementById("clearFilters")
    const gridViewBtn = document.querySelector(".view-btn[data-view='grid']")
    const listViewBtn = document.querySelector(".view-btn[data-view='list']")

    if (productGrid) {
      this.setupProductCardEventListeners(productGrid)
    }

    if (categoryCheckboxes.length > 0) {
      categoryCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", this.handleFilterChange.bind(this))
      })
    }

    if (availableCheckbox) {
      availableCheckbox.addEventListener("change", this.handleFilterChange.bind(this))
    }

    if (priceRange) {
      priceRange.addEventListener("input", (e) => {
        this.filters.maxPrice = Number.parseInt(e.target.value)
        const maxPriceDisplay = document.getElementById("maxPrice")
        if (maxPriceDisplay) {
          maxPriceDisplay.textContent = `$${this.filters.maxPrice.toLocaleString("es-CL")}`
        }
        this.filterProducts()
        this.renderProducts()
      })
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value
        this.sortProducts()
        this.renderProducts()
      })
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", this.clearFilters.bind(this))
    }

    if (gridViewBtn) {
      gridViewBtn.addEventListener("click", () => {
        this.currentView = "grid"
        productGrid.classList.remove("list-view")
        gridViewBtn.classList.add("active")
        if (listViewBtn) listViewBtn.classList.remove("active")
      })
    }

    if (listViewBtn) {
      listViewBtn.addEventListener("click", () => {
        this.currentView = "list"
        productGrid.classList.add("list-view")
        listViewBtn.classList.add("active")
        if (gridViewBtn) gridViewBtn.classList.remove("active")
      })
    }
  }

  setupProductCardEventListeners(container) {
    container.addEventListener("click", (e) => {
      const viewDetailsBtn = e.target.closest(".view-details")
      const addToCartBtn = e.target.closest(".add-to-cart")

      if (viewDetailsBtn) {
        const productId = Number.parseInt(viewDetailsBtn.dataset.productId)
        this.showProductModal(productId)
      } else if (addToCartBtn) {
        const productId = Number.parseInt(addToCartBtn.dataset.productId)
        this.addItemToCart(productId)
      }
    })
  }

  showProductModal(productId) {
    const product = this.products.find((p) => p.id === productId)
    if (!product) return

    const modal = document.getElementById("productModal")
    const modalImage = document.getElementById("modalImage")
    const modalName = document.getElementById("modalName")
    const modalDescription = document.getElementById("modalDescription")
    const modalFeatures = document.getElementById("modalFeatures")
    const modalPrice = document.getElementById("modalPrice")
    const modalAddToCartBtn = document.getElementById("modalAddToCartBtn")
    const modalProducer = document.getElementById("modalProducer")
    const modalRegion = document.getElementById("modalRegion")
    const modalTags = document.getElementById("modalTags")
    const quantityInput = document.getElementById("quantityInput")

    modalImage.src = product.image
    modalImage.alt = product.name
    modalName.textContent = product.name
    modalDescription.textContent = product.description
    modalProducer.textContent = product.producer
    modalRegion.textContent = product.region

    if (product.originalPrice) {
      modalPrice.innerHTML = `
        <span class="product-original-price">$${product.originalPrice.toLocaleString("es-CL")}</span>
        <span class="price-current">$${product.price.toLocaleString("es-CL")}</span>
      `
    } else {
      modalPrice.innerHTML = `<span class="price-current">$${product.price.toLocaleString("es-CL")}</span>`
    }

    modalTags.innerHTML = ""
    if (product.organic) {
      modalTags.innerHTML += '<span class="tag organic-tag">Orgánico</span>'
    }
    if (product.available) {
      modalTags.innerHTML += '<span class="tag available-tag">Disponible</span>'
    } else {
      modalTags.innerHTML += '<span class="tag unavailable-tag">No Disponible</span>'
    }

    quantityInput.value = 1
    modalAddToCartBtn.dataset.productId = product.id

    modalFeatures.innerHTML = ""
    if (product.features && product.features.length > 0) {
      const featuresHtml = product.features.map((feature) => `<li>${feature}</li>`).join("")
      modalFeatures.innerHTML = `<ul>${featuresHtml}</ul>`
    }

    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  addItemToCart(productId, quantityFromModal = null) {
    const product = this.products.find((p) => p.id === productId)
    if (!product) return

    const quantityInput = document.getElementById("quantityInput")
    const quantity = quantityFromModal || (quantityInput ? Number.parseInt(quantityInput.value) : 1)

    // Usa la instancia global del carrito de compras creada en cart.js
    if (window.shoppingCart) {
      window.shoppingCart.addItem(product, quantity)
    } else {
      console.error("Shopping cart instance not found.")
      alert("Error: No se pudo agregar el producto al carrito.")
    }

    // Opcional: mostrar un mensaje de confirmación
    // Esto se puede reemplazar por una notificación más elegante
    console.log(`¡${product.name} agregado al carrito! Cantidad: ${quantity}`)

    const modal = document.getElementById("productModal")
    if (modal && modal.classList.contains("active")) {
      modal.classList.remove("active")
      document.body.style.overflow = "auto"
    }
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product) => {
      const passesCategory = this.filters.categories.length === 0 || this.filters.categories.includes(product.category)
      const passesPrice = product.price <= this.filters.maxPrice
      const passesOrganic = !this.filters.organic || product.organic
      const passesAvailability = !this.filters.available || product.available
      return passesCategory && passesPrice && passesOrganic && passesAvailability
    })
    this.sortProducts()
  }

  sortProducts() {
    this.filteredProducts.sort((a, b) => {
      if (this.sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (this.sortBy === "price-low") {
        return a.price - b.price
      } else if (this.sortBy === "price-high") {
        return b.price - a.price
      } else if (this.sortBy === "newest") {
        return b.id - a.id
      }
    })
    this.currentPage = 1
  }

  handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase()
    this.filteredProducts = this.products.filter((product) => product.name.toLowerCase().includes(searchTerm))
    this.sortProducts()
    this.renderProducts()
    this.renderPagination()
  }

  handleFilterChange(e) {
    const target = e.target
    if (target.type === "checkbox" && target.dataset.category) {
      if (target.checked) {
        this.filters.categories.push(target.dataset.category)
      } else {
        this.filters.categories = this.filters.categories.filter((cat) => cat !== target.dataset.category)
      }
    } else if (target.type === "checkbox" && target.value === "available") {
      this.filters.available = target.checked
    }
    this.filterProducts()
    this.renderProducts()
  }

  clearFilters() {
    this.filters.categories = []
    this.filters.maxPrice = 10000
    this.filters.organic = false
    this.filters.available = false
    this.sortBy = "name"

    document.querySelectorAll("input[data-category]").forEach((cb) => (cb.checked = false))
    document.querySelectorAll('input[value="available"]').forEach((cb) => (cb.checked = false))

    const priceRange = document.getElementById("priceRange")
    const maxPrice = document.getElementById("maxPrice")
    if (priceRange) priceRange.value = 10000
    if (maxPrice) maxPrice.textContent = "$10.000"

    const sortSelect = document.getElementById("sortSelect")
    if (sortSelect) sortSelect.value = "name"

    this.filterProducts()
    this.renderProducts()
  }

  renderProducts() {
    const productGrid = document.querySelector(".products-grid")
    const resultsCount = document.getElementById("resultsCount")
    if (!productGrid) return

    productGrid.innerHTML = ""

    const start = (this.currentPage - 1) * this.productsPerPage
    const end = start + this.productsPerPage
    const productsToRender = this.filteredProducts.slice(start, end)

    if (resultsCount) {
      resultsCount.textContent = `Mostrando ${productsToRender.length} de ${this.filteredProducts.length} productos`
    }

    if (productsToRender.length === 0) {
      productGrid.innerHTML = `
        <div class="no-results">
          <h3>No se encontraron productos</h3>
          <p>Intenta ajustar tus filtros o limpiar la búsqueda.</p>
        </div>
      `
      return
    }

    productsToRender.forEach((product) => {
      const productCard = document.createElement("div")
      productCard.className = "product-card"

      const badges = []
      if (product.organic) badges.push(`<span class="product-badge badge-organic">Orgánico</span>`)
      if (!product.available) badges.push(`<span class="product-badge badge-sale">No Disponible</span>`)
      if (product.originalPrice) badges.push(`<span class="product-badge badge-sale">Oferta</span>`)

      const priceHtml = product.originalPrice
        ? `
        <div class="product-price">
          <span class="price-original">$${product.originalPrice.toLocaleString("es-CL")}</span>
          <span class="price-current">$${product.price.toLocaleString("es-CL")}</span>
        </div>
      `
        : `
        <div class="product-price">
          <span class="price-current">$${product.price.toLocaleString("es-CL")}</span>
        </div>
      `

      const cartBtnHtml = product.available
        ? `
        <button class="btn-add-cart add-to-cart" data-product-id="${product.id}">
          Agregar al Carro
        </button>
      `
        : `
        <button class="btn-add-cart" disabled style="opacity: 0.5; cursor: not-allowed;">
          No Disponible
        </button>
      `

      productCard.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" />
          ${badges.length > 0 ? `<div class="product-badges">${badges.join("")}</div>` : ""}
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          ${priceHtml}
          <div class="product-actions">
            <button class="btn-quick-view view-details" data-product-id="${product.id}">👁</button>
            ${cartBtnHtml}
          </div>
        </div>
      `

      productGrid.appendChild(productCard)
    })

    this.renderPagination()
  }

  renderPagination() {
    const paginationContainer = document.getElementById("pagination")
    if (!paginationContainer) return

    paginationContainer.innerHTML = ""
    const pageCount = Math.ceil(this.filteredProducts.length / this.productsPerPage)

    if (pageCount <= 1) return

    if (this.currentPage > 1) {
      const prevBtn = document.createElement("button")
      prevBtn.className = "pagination-btn"
      prevBtn.textContent = "‹"
      prevBtn.addEventListener("click", () => {
        this.currentPage--
        this.renderProducts()
        window.scrollTo({ top: 0, behavior: "smooth" })
      })
      paginationContainer.appendChild(prevBtn)
    }

    for (let i = 1; i <= pageCount; i++) {
      const pageBtn = document.createElement("button")
      pageBtn.className = `pagination-btn ${this.currentPage === i ? "active" : ""}`
      pageBtn.textContent = i
      pageBtn.addEventListener("click", () => {
        this.currentPage = i
        this.renderProducts()
        window.scrollTo({ top: 0, behavior: "smooth" })
      })
      paginationContainer.appendChild(pageBtn)
    }

    if (this.currentPage < pageCount) {
      const nextBtn = document.createElement("button")
      nextBtn.className = "pagination-btn"
      nextBtn.textContent = "›"
      nextBtn.addEventListener("click", () => {
        this.currentPage++
        this.renderProducts()
        window.scrollTo({ top: 0, behavior: "smooth" })
      })
      paginationContainer.appendChild(nextBtn)
    }
  }
}

// Inicializar el catálogo cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const catalog = new ProductCatalog()

  const productModal = document.getElementById("productModal")
  const modalCloseBtn = document.getElementById("modalCloseBtn")
  const modalOverlay = document.getElementById("modalOverlay")
  const modalAddToCartBtn = document.getElementById("modalAddToCartBtn")
  const quantityInput = document.getElementById("quantityInput")
  const increaseQuantityBtn = document.getElementById("increaseQuantityBtn")
  const decreaseQuantityBtn = document.getElementById("decreaseQuantityBtn")

  function closeModal() {
    if (productModal) {
      productModal.classList.remove("active")
      document.body.style.overflow = "auto"
    }
  }

  if (productModal && modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal)

    if (modalOverlay) {
      modalOverlay.addEventListener("click", closeModal)
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && productModal.classList.contains("active")) {
        closeModal()
      }
    })
  }

  if (increaseQuantityBtn && quantityInput) {
    increaseQuantityBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value) || 1
      quantityInput.value = currentValue + 1
    })
  }

  if (decreaseQuantityBtn && quantityInput) {
    decreaseQuantityBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value) || 1
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1
      }
    })
  }

  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener("click", () => {
      const productId = Number.parseInt(modalAddToCartBtn.dataset.productId)
      const quantity = Number.parseInt(quantityInput.value) || 1

      if (productId) {
        catalog.addItemToCart(productId, quantity)
      }
    })
  }
})
