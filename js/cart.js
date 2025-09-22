// Shopping Cart JavaScript
class ShoppingCart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("huertohogar-cart")) || [];
    this.isOpen = false;
    this.deliveryFee = 2500; // Fixed delivery fee
    this.freeDeliveryThreshold = 15000; // Free delivery over $15,000

    this.init();
  }

  init() {
    this.createCartElements();
    this.setupEventListeners();
    this.updateCartDisplay();
    this.updateCartCountDisplay();
  }

  createCartElements() {
    // Create cart overlay
    const overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    overlay.id = "cartOverlay";
    document.body.appendChild(overlay);

    // Create cart sidebar
    const sidebar = document.createElement("div");
    sidebar.className = "cart-sidebar";
    sidebar.id = "cartSidebar";
    document.body.appendChild(sidebar);

    // Create checkout modal
    const checkoutModal = document.createElement("div");
    checkoutModal.className = "checkout-modal";
    checkoutModal.id = "checkoutModal";
    document.body.appendChild(checkoutModal);

    // Initial render of cart and checkout content
    this.updateCartDisplay();
  }

  getCartHTML() {
    return `
      <div class="cart-header">
        <h2 class="cart-title">Carrito de Compras</h2>
        <button class="cart-close" id="cartClose">&times;</button>
      </div>
      <div class="cart-content" id="cartContent">
        ${this.getCartContentHTML()}
      </div>
      <div class="cart-summary" id="cartSummary">
        ${this.getCartSummaryHTML()}
      </div>
      <div class="cart-actions">
        <button class="btn cart-clear-btn" id="clearCartBtn" ${
          this.cart.length === 0 ? "disabled" : ""
        }>
          Vaciar Carro
        </button>
        <button class="cart-checkout-btn" id="cartCheckout" ${
          this.cart.length === 0 ? "disabled" : ""
        }>
          Proceder al Checkout
        </button>
        <a href="productos.html" class="cart-continue-shopping">Seguir Comprando</a>
      </div>
    `;
  }

  getCartContentHTML() {
    if (this.cart.length === 0) {
      return `
        <div class="cart-empty">
          <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 21h12M9 19.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0Z"></path>
          </svg>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega algunos productos frescos para comenzar</p>
          <a href="productos.html" class="btn btn-primary">Ver Productos</a>
        </div>
      `;
    }

    return `
      <div class="cart-items">
        ${this.cart.map((item) => this.getCartItemHTML(item)).join("")}
      </div>
    `;
  }

 getCartItemHTML(item) {
    const itemTotal = item.price * item.quantity;

    return `
      <div class="cart-item" data-item-id="${item.id}">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toLocaleString("es-CL")} c/u</div>
          <div class="cart-item-controls">
            <div class="cart-quantity-controls">
              <button class="cart-quantity-btn" onclick="shoppingCart.decreaseQuantity(${
                item.id
              })" ${item.quantity <= 1 ? "disabled" : ""}>-</button>
              <span class="cart-quantity-display">${item.quantity}</span>
              <button class="cart-quantity-btn" onclick="shoppingCart.increaseQuantity(${
                item.id
              })">+</button>
            </div>
            <button class="cart-item-remove" onclick="shoppingCart.removeItem(${
              item.id
            })" title="Eliminar producto">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
              </svg>
            </button>
          </div>
          <div class="cart-item-total">$${itemTotal.toLocaleString("es-CL")}</div>
        </div>
      </div>
    `;
  }

  getCartSummaryHTML() {
    const subtotal = this.getSubtotal();
    const delivery = this.getDeliveryFee();
    const total = subtotal + delivery;
    const points = this.getPointsEarned();

    return `
      <div class="cart-summary-row">
        <span class="cart-summary-label">Subtotal (${this.getTotalItems()} productos)</span>
        <span class="cart-summary-value">$${subtotal.toLocaleString("es-CL")}</span>
      </div>
      <div class="cart-summary-row">
        <span class="cart-summary-label">Envío</span>
        <span class="cart-summary-value">${
          delivery === 0 ? "Gratis" : "$" + delivery.toLocaleString("es-CL")
        }</span>
      </div>
      <div class="cart-summary-row total">
        <span class="cart-summary-label">Total</span>
        <span class="cart-summary-value">$${total.toLocaleString("es-CL")}</span>
      </div>
      <div class="cart-points-row">
        <span class="cart-points-label">Puntos a ganar</span>
        <span class="cart-points-value">${points} puntos</span>
      </div>
    `;
  }

  getCheckoutModalHTML() {
    return `
      <div class="checkout-overlay" id="checkoutOverlay"></div>
      <div class="checkout-content">
        <div class="checkout-header">
          <h2 class="checkout-title">Finalizar Compra</h2>
          <button class="checkout-close" id="checkoutClose">&times;</button>
        </div>
        <div class="checkout-body" id="checkoutBody">
          ${this.getCheckoutFormHTML()}
        </div>
      </div>
    `;
  }

  getCheckoutFormHTML() {
    return `
      <div class="checkout-section">
        <h3 class="checkout-section-title">
          <span class="checkout-section-number">1</span>
          Información de Entrega
        </h3>
        <form class="checkout-form" id="checkoutForm">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-input" name="firstName" required>
            </div>
            <div class="form-group">
              <label class="form-label">Apellido</label>
              <input type="text" class="form-input" name="lastName" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" name="email" required>
          </div>
          <div class="form-group">
            <label class="form-label">Teléfono</label>
            <input type="tel" class="form-input" name="phone" required>
          </div>
          <div class="form-group">
            <label class="form-label">Dirección</label>
            <input type="text" class="form-input" name="address" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Ciudad</label>
              <select class="form-select" name="city" required>
                <option value="">Seleccionar ciudad</option>
                <option value="santiago">Santiago</option>
                <option value="valparaiso">Valparaíso</option>
                <option value="concepcion">Concepción</option>
                <option value="la-serena">La Serena</option>
                <option value="antofagasta">Antofagasta</option>
                <option value="temuco">Temuco</option>
                <option value="rancagua">Rancagua</option>
                <option value="talca">Talca</option>
                <option value="chillan">Chillán</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Código Postal</label>
              <input type="text" class="form-input" name="zipCode" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Fecha de Entrega</label>
            <input type="date" class="form-input" name="deliveryDate" required>
          </div>
        </form>
      </div>

      <div class="checkout-section">
        <h3 class="checkout-section-title">
          <span class="checkout-section-number">2</span>
          Método de Pago
        </h3>
        <div class="checkout-form">
          <div class="form-group">
            <label class="form-label">Método de Pago</label>
            <select class="form-select" name="paymentMethod" required>
              <option value="">Seleccionar método</option>
              <option value="credit-card">Tarjeta de Crédito</option>
              <option value="debit-card">Tarjeta de Débito</option>
              <option value="transfer">Transferencia Bancaria</option>
              <option value="cash">Pago Contra Entrega</option>
            </select>
          </div>
        </div>
      </div>

      <div class="checkout-section">
        <h3 class="checkout-section-title">
          <span class="checkout-section-number">3</span>
          Resumen del Pedido
        </h3>
        <div class="checkout-order-summary">
          <div class="checkout-order-items">
            ${this.cart.map((item) => this.getCheckoutItemHTML(item)).join("")}
          </div>
          <div class="checkout-totals">
            ${this.getCheckoutTotalsHTML()}
          </div>
        </div>
      </div>

      <div class="checkout-actions">
        <button type="button" class="checkout-btn checkout-btn-secondary" id="checkoutCancel">Cancelar</button>
        <button type="submit" class="checkout-btn checkout-btn-primary" id="checkoutSubmit">Confirmar Pedido</button>
      </div>
    `;
  }

  getCheckoutItemHTML(item) {
    return `
      <div class="checkout-order-item">
        <div class="checkout-item-info">
          <div class="checkout-item-name">${item.name}</div>
          <div class="checkout-item-details">Cantidad: ${item.quantity} × $${item.price.toLocaleString(
      "es-CL"
    )}</div>
        </div>
        <div class="checkout-item-price">$${(
          item.price * item.quantity
        ).toLocaleString("es-CL")}</div>
      </div>
    `;
  }

  getCheckoutTotalsHTML() {
    const subtotal = this.getSubtotal();
    const delivery = this.getDeliveryFee();
    const total = subtotal + delivery;

    return `
      <div class="checkout-total-row">
        <span>Subtotal:</span>
        <span>$${subtotal.toLocaleString("es-CL")}</span>
      </div>
      <div class="checkout-total-row">
        <span>Envío:</span>
        <span>${
          delivery === 0 ? "Gratis" : "$" + delivery.toLocaleString("es-CL")
        }</span>
      </div>
      <div class="checkout-total-row">
        <span>Total:</span>
        <span>$${total.toLocaleString("es-CL")}</span>
      </div>
    `;
  }

  setupEventListeners() {
    // Add event listener for the cart button
    const cartBtn = document.getElementById("cartBtn");
    if (cartBtn) {
      cartBtn.addEventListener("click", this.toggleCart.bind(this));
    }

    // AÑADIDO: Event listener para el botón de vaciar carro
    const clearCartBtn = document.getElementById("clearCartBtn");
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", this.clearCart.bind(this));
    }

    // Cart close
    document.addEventListener("click", (e) => {
      if (e.target.id === "cartClose" || e.target.id === "cartOverlay") {
        this.closeCart();
      }
    });

    // Checkout modal events
    document.addEventListener("click", (e) => {
      if (e.target.id === "cartCheckout") {
        this.openCheckout();
      }
      if (
        e.target.id === "checkoutClose" ||
        e.target.id === "checkoutOverlay" ||
        e.target.id === "checkoutCancel"
      ) {
        this.closeCheckout();
      }
    });

    // Checkout form submission
    document.addEventListener("submit", (e) => {
      if (e.target.id === "checkoutForm") {
        e.preventDefault();
        this.processCheckout();
      }
    });

    // Checkout submit button
    document.addEventListener("click", (e) => {
      if (e.target.id === "checkoutSubmit") {
        const form = document.getElementById("checkoutForm");
        if (form && form.checkValidity()) {
          this.processCheckout();
        } else {
          form.reportValidity();
        }
      }
    });

    // Escape key to close modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeCart();
        this.closeCheckout();
      }
    });

    // Event listener for continue shopping
    const continueShoppingBtn = document.getElementById("continueShopping");
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener("click", this.closeCart.bind(this));
    }
  }

  // Cart Management Methods
  addItem(product, quantity = 1) {
    console.log("[v0] Adding item to cart:", product.name, "quantity:", quantity);

    const existingItem = this.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });
    }

    this.saveCart();
    this.updateCartDisplay();
    this.updateCartCountDisplay(); // AÑADIDO: Actualiza el contador
    this.showNotification(`${product.name} agregado al carrito`);
  }

  removeItem(productId) {
    console.log("[v0] Removing item from cart:", productId);

    const itemIndex = this.cart.findIndex((item) => item.id === productId);
    if (itemIndex > -1) {
      const item = this.cart[itemIndex];
      this.cart.splice(itemIndex, 1);
      this.saveCart();
      this.updateCartDisplay();
      this.updateCartCountDisplay(); // AÑADIDO: Actualiza el contador
      this.showNotification(`${item.name} eliminado del carrito`);
    }
  }

  increaseQuantity(productId) {
    console.log("[v0] Increasing quantity for product:", productId);

    const item = this.cart.find((item) => item.id === productId);
    if (item) {
      item.quantity += 1;
      this.saveCart();
      this.updateCartDisplay();
      this.updateCartCountDisplay(); // AÑADIDO: Actualiza el contador
    }
  }

  decreaseQuantity(productId) {
    console.log("[v0] Decreasing quantity for product:", productId);

    const item = this.cart.find((item) => item.id === productId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.saveCart();
      this.updateCartDisplay();
      this.updateCartCountDisplay(); // AÑADIDO: Actualiza el contador
    }
  }

  // AÑADIDO: Método para vaciar el carrito
  clearCart() {
    console.log("[v0] Clearing cart");
    this.cart = [];
    this.saveCart();
    this.updateCartDisplay();
    this.updateCartCountDisplay();
    this.showNotification("El carrito ha sido vaciado");
  }

  // Cart Display Methods
  toggleCart() {
    if (this.isOpen) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }

  openCart() {
    console.log("[v0] Opening cart");
    this.isOpen = true;

    const overlay = document.getElementById("cartOverlay");
    const sidebar = document.getElementById("cartSidebar");
    const mainProductsContent = document.getElementById("productsMain");

    if (overlay && sidebar) {
      // Re-render the sidebar to ensure it's up to date
      sidebar.innerHTML = this.getCartHTML();
      this.setupEventListeners(); // Re-setup listeners for the new content

      overlay.classList.add("active");
      sidebar.classList.add("active");
      document.body.style.overflow = "hidden";
      if (mainProductsContent) {
        mainProductsContent.style.filter = "blur(5px)";
      }
    }
  }

  closeCart() {
    console.log("[v0] Closing cart");
    this.isOpen = false;

    const overlay = document.getElementById("cartOverlay");
    const sidebar = document.getElementById("cartSidebar");
    const mainProductsContent = document.getElementById("productsMain");

    if (overlay && sidebar) {
      overlay.classList.remove("active");
      sidebar.classList.remove("active");
      document.body.style.overflow = "";
      if (mainProductsContent) {
        mainProductsContent.style.filter = "none";
      }
    }
  }

  updateCartDisplay() {
    // Update cart content
    const cartContent = document.getElementById("cartContent");
    if (cartContent) {
      cartContent.innerHTML = this.getCartContentHTML();
    }

    // Update cart summary
    const cartSummary = document.getElementById("cartSummary");
    if (cartSummary) {
      cartSummary.innerHTML = this.getCartSummaryHTML();
    }

    // Update checkout and clear button state
    const checkoutBtn = document.getElementById("cartCheckout");
    const clearCartBtn = document.getElementById("clearCartBtn");

    if (checkoutBtn) {
      checkoutBtn.disabled = this.cart.length === 0;
      checkoutBtn.style.opacity = this.cart.length === 0 ? "0.5" : "1";
    }
    if (clearCartBtn) {
      clearCartBtn.disabled = this.cart.length === 0;
      clearCartBtn.style.opacity = this.cart.length === 0 ? "0.5" : "1";
    }

    // Update main cart object reference
    if (window.huertoHogar) {
      window.huertoHogar.cart = this.cart;
    }
  }

  // AÑADIDO: Método para actualizar el número del carro en el encabezado
  updateCartCountDisplay() {
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
      const totalItems = this.getTotalItems();
      cartCount.textContent = totalItems;
      cartCount.classList.toggle("visible", totalItems > 0);
    }
  }

  // Checkout Methods
  openCheckout() {
    if (this.cart.length === 0) return;

    console.log("[v0] Opening checkout");
    this.updateCheckoutContent(); // Ensure modal content is up to date

    const modal = document.getElementById("checkoutModal");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  closeCheckout() {
    console.log("[v0] Closing checkout");

    const modal = document.getElementById("checkoutModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  updateCheckoutContent() {
    const checkoutBody = document.getElementById("checkoutBody");
    if (checkoutBody) {
      checkoutBody.innerHTML = this.getCheckoutFormHTML();
    }
  }

  processCheckout() {
    console.log("[v0] Processing checkout");

    const form = document.getElementById("checkoutForm");
    if (!form) return;

    const formData = new FormData(form);
    const orderData = {
      customer: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        zipCode: formData.get("zipCode"),
      },
      paymentMethod: formData.get("paymentMethod"),
      deliveryDate: formData.get("deliveryDate"),
      items: [...this.cart],
      subtotal: this.getSubtotal(),
      deliveryFee: this.getDeliveryFee(),
      total: this.getSubtotal() + this.getDeliveryFee(),
      orderDate: new Date().toISOString(),
    };

    // Simulate order processing
    this.showOrderProcessing();

    setTimeout(() => {
      const orderNumber = this.generateOrderNumber();
      this.showOrderSuccess(orderNumber);
      this.clearCart();

      // Save order to localStorage for order management
      this.saveOrder(orderNumber, orderData);
    }, 2000);
  }

  showOrderProcessing() {
    const checkoutBody = document.getElementById("checkoutBody");
    if (checkoutBody) {
      checkoutBody.innerHTML = `
        <div class="checkout-success">
          <div class="checkout-success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="m2 17 10 5 10-5"></path>
              <path d="m2 12 10 5 10-5"></path>
            </svg>
          </div>
          <h3>Procesando tu pedido...</h3>
          <p>Por favor espera mientras confirmamos tu orden.</p>
        </div>
      `;
    }
  }

  showOrderSuccess(orderNumber) {
    const checkoutBody = document.getElementById("checkoutBody");
    if (checkoutBody) {
      checkoutBody.innerHTML = `
        <div class="checkout-success">
          <div class="checkout-success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"></path>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          </div>
          <h3>¡Pedido Confirmado!</h3>
          <p>Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación pronto.</p>
          <div class="order-number">Número de Orden: ${orderNumber}</div>
          <button class="btn btn-primary" onclick="shoppingCart.closeCheckout()">Continuar</button>
        </div>
      `;
    }
  }

  generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `HH${timestamp.toString().slice(-6)}${random.toString().padStart(3, "0")}`;
  }

  saveOrder(orderNumber, orderData) {
    const orders = JSON.parse(localStorage.getItem("huertohogar-orders")) || [];
    orders.push({
      orderNumber,
      ...orderData,
      status: "confirmed",
    });
    localStorage.setItem("huertohogar-orders", JSON.stringify(orders));
  }

  // Utility Methods
  saveCart() {
    localStorage.setItem("huertohogar-cart", JSON.stringify(this.cart));
  }

  getTotalItems() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getDeliveryFee() {
    const subtotal = this.getSubtotal();
    return subtotal >= this.freeDeliveryThreshold ? 0 : this.deliveryFee;
  }
  
  getPointsEarned() {
    const subtotal = this.getSubtotal();
    return Math.floor(subtotal / 1000); // 1 punto por cada $1000
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;

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
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize shopping cart when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.shoppingCart = new ShoppingCart();
});