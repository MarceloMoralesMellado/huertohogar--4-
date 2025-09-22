// Orders Management System
class OrderManager {
  constructor() {
    this.orders = this.loadOrders()
    this.currentFilter = "all"
    this.init()
  }

  init() {
    this.loadOrdersDisplay()
    this.setupEventListeners()
    this.checkAuthState()
  }

  setupEventListeners() {
    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setActiveFilter(e.target.dataset.status)
      })
    })
  }

  checkAuthState() {
    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (!user) {
      this.showLoginRequired()
      return false
    }
    return true
  }

  showLoginRequired() {
    const container = document.getElementById("orders-container")
    const emptyState = document.getElementById("empty-orders")

    container.style.display = "none"
    emptyState.style.display = "block"

    // Update empty state content for login required
    emptyState.innerHTML = `
      <div class="empty-icon">🔒</div>
      <h3>Inicia sesión para ver tus pedidos</h3>
      <p>Necesitas estar autenticado para acceder a tu historial de pedidos</p>
      <button class="btn-primary" onclick="openLoginModal()">Iniciar Sesión</button>
    `
  }

  loadOrders() {
    // Load orders from localStorage or return sample data
    const savedOrders = localStorage.getItem("userOrders")
    if (savedOrders) {
      return JSON.parse(savedOrders)
    }

    // Sample orders data
    return [
      {
        id: "ORD-001",
        date: "2024-01-15",
        status: "delivered",
        total: 28500,
        items: [
          {
            id: 1,
            name: "Tomates Cherry Orgánicos",
            quantity: 2,
            price: 4500,
            image: "public/fresh-organic-cherry-tomatoes.jpg",
          },
          {
            id: 2,
            name: "Paltas Hass Premium",
            quantity: 1,
            price: 8500,
            image: "public/premium-hass-avocados.jpg",
          },
        ],
        tracking: [
          { status: "Pedido confirmado", date: "2024-01-15 10:30", completed: true },
          { status: "En preparación", date: "2024-01-15 14:20", completed: true },
          { status: "Enviado", date: "2024-01-16 08:15", completed: true },
          { status: "Entregado", date: "2024-01-16 16:45", completed: true },
        ],
      },
      {
        id: "ORD-002",
        date: "2024-01-20",
        status: "shipped",
        total: 15750,
        items: [
          {
            id: 3,
            name: "Lechuga Hidropónica",
            quantity: 3,
            price: 2500,
            image: "public/fresh-hydroponic-lettuce.jpg",
          },
          {
            id: 4,
            name: "Frutillas del Sur",
            quantity: 2,
            price: 4500,
            image: "public/fresh-southern-strawberries.jpg",
          },
        ],
        tracking: [
          { status: "Pedido confirmado", date: "2024-01-20 11:15", completed: true },
          { status: "En preparación", date: "2024-01-20 15:30", completed: true },
          { status: "Enviado", date: "2024-01-21 09:00", completed: true },
          { status: "En camino", date: "2024-01-21 14:30", completed: false },
        ],
      },
      {
        id: "ORD-003",
        date: "2024-01-22",
        status: "processing",
        total: 22300,
        items: [
          {
            id: 5,
            name: "Espinacas Orgánicas",
            quantity: 2,
            price: 3200,
            image: "public/fresh-organic-spinach-leaves.jpg",
          },
          {
            id: 6,
            name: "Pimientos Tricolor",
            quantity: 1,
            price: 5500,
            image: "public/colorful-bell-peppers-red-yellow-green.jpg",
          },
        ],
        tracking: [
          { status: "Pedido confirmado", date: "2024-01-22 09:45", completed: true },
          { status: "En preparación", date: "2024-01-22 13:20", completed: false },
        ],
      },
    ]
  }

  saveOrders() {
    localStorage.setItem("userOrders", JSON.stringify(this.orders))
  }

  setActiveFilter(status) {
    this.currentFilter = status

    // Update active button
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.querySelector(`[data-status="${status}"]`).classList.add("active")

    this.loadOrdersDisplay()
  }

  getFilteredOrders() {
    if (this.currentFilter === "all") {
      return this.orders
    }
    return this.orders.filter((order) => order.status === this.currentFilter)
  }

  loadOrdersDisplay() {
    if (!this.checkAuthState()) {
      return
    }

    const container = document.getElementById("orders-container")
    const emptyState = document.getElementById("empty-orders")
    const filteredOrders = this.getFilteredOrders()

    if (filteredOrders.length === 0) {
      container.style.display = "none"
      emptyState.style.display = "block"
      emptyState.innerHTML = `
        <div class="empty-icon">📦</div>
        <h3>No tienes pedidos aún</h3>
        <p>Explora nuestros productos frescos y realiza tu primer pedido</p>
        <a href="productos.html" class="btn-primary">Ver Productos</a>
      `
      return
    }

    container.style.display = "flex"
    emptyState.style.display = "none"

    container.innerHTML = filteredOrders.map((order) => this.createOrderCard(order)).join("")
  }

  createOrderCard(order) {
    const statusClass = `status-${order.status}`
    const statusText = this.getStatusText(order.status)

    return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h3>Pedido #${order.id}</h3>
                        <div class="order-date">${this.formatDate(order.date)}</div>
                    </div>
                    <div class="order-status ${statusClass}">
                        ${statusText}
                    </div>
                </div>
                
                <div class="order-items">
                    ${order.items
                      .slice(0, 2)
                      .map(
                        (item) => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" class="item-image">
                            <div class="item-details">
                                <div class="item-name">${item.name}</div>
                                <div class="item-quantity">Cantidad: ${item.quantity}</div>
                            </div>
                            <div class="item-price">$${item.price.toLocaleString()}</div>
                        </div>
                    `,
                      )
                      .join("")}
                    ${
                      order.items.length > 2
                        ? `
                        <div class="more-items">
                            +${order.items.length - 2} productos más
                        </div>
                    `
                        : ""
                    }
                </div>
                
                <div class="order-footer">
                    <div class="order-total">
                        Total: $${order.total.toLocaleString()}
                    </div>
                    <div class="order-actions">
                        <button class="btn-outline" onclick="orderManager.viewOrderDetail('${order.id}')">
                            Ver Detalle
                        </button>
                        ${
                          order.status === "delivered"
                            ? `
                            <button class="btn-outline" onclick="orderManager.reorderItems('${order.id}')">
                                Volver a Pedir
                            </button>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>
        `
  }

  getStatusText(status) {
    const statusMap = {
      pending: "Pendiente",
      processing: "En Proceso",
      shipped: "Enviado",
      delivered: "Entregado",
    }
    return statusMap[status] || status
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  viewOrderDetail(orderId) {
    const order = this.orders.find((o) => o.id === orderId)
    if (!order) return

    const modal = document.getElementById("order-detail-modal")
    const content = document.getElementById("order-detail-content")

    content.innerHTML = `
            <div class="order-detail-header">
                <div>
                    <h4>Pedido #${order.id}</h4>
                    <p>${this.formatDate(order.date)}</p>
                </div>
                <div class="order-detail-status">
                    <span class="order-status status-${order.status}">
                        ${this.getStatusText(order.status)}
                    </span>
                </div>
            </div>
            
            <div class="tracking-timeline">
                <h4>Estado del Pedido</h4>
                ${order.tracking
                  .map(
                    (track) => `
                    <div class="timeline-item">
                        <div class="timeline-icon ${track.completed ? "completed" : "pending"}">
                            ${track.completed ? "✓" : "○"}
                        </div>
                        <div class="timeline-content">
                            <h4>${track.status}</h4>
                            <p>${track.date}</p>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            
            <div class="order-items">
                <h4>Productos</h4>
                ${order.items
                  .map(
                    (item) => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="item-image">
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-quantity">Cantidad: ${item.quantity}</div>
                        </div>
                        <div class="item-price">$${item.price.toLocaleString()}</div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            
            <div class="order-summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>$${(order.total - 2500).toLocaleString()}</span>
                </div>
                <div class="summary-row">
                    <span>Envío:</span>
                    <span>$2.500</span>
                </div>
                <div class="summary-row total">
                    <span><strong>Total:</strong></span>
                    <span><strong>$${order.total.toLocaleString()}</strong></span>
                </div>
            </div>
        `

    modal.style.display = "flex"
  }

  reorderItems(orderId) {
    const order = this.orders.find((o) => o.id === orderId)
    if (!order) return

    // Add items to cart
    order.items.forEach((item) => {
      if (window.addToCart && typeof window.addToCart === "function") {
        window.addToCart(item.id, item.quantity)
      }
    })

    // Show success message
    this.showNotification("Productos agregados al carrito", "success")

    // Update cart display
    if (window.updateCartDisplay && typeof window.updateCartDisplay === "function") {
      window.updateCartDisplay()
    }
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    // Style the notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "1rem 1.5rem",
      backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
      color: type === "success" ? "#155724" : "#721c24",
      border: `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
      borderRadius: "6px",
      zIndex: "10000",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    })

    document.body.appendChild(notification)

    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  // Add new order (called from checkout)
  addOrder(orderData) {
    const newOrder = {
      id: `ORD-${String(this.orders.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      total: orderData.total,
      items: orderData.items,
      tracking: [
        {
          status: "Pedido confirmado",
          date: new Date().toLocaleString("es-CL"),
          completed: true,
        },
      ],
    }

    this.orders.unshift(newOrder)
    this.saveOrders()
    this.loadOrdersDisplay()

    return newOrder.id
  }
}

// Close order detail modal
function closeOrderDetailModal() {
  document.getElementById("order-detail-modal").style.display = "none"
}

// Initialize order manager when page loads
let orderManager
document.addEventListener("DOMContentLoaded", () => {
  orderManager = new OrderManager()
})

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  const modal = document.getElementById("order-detail-modal")
  if (e.target === modal) {
    closeOrderDetailModal()
  }
})
