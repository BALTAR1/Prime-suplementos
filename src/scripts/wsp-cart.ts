// Interfaces para tipado estricto
interface Product {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number | null;
  imagen: string;
  descripcion: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CategoryMap {
  [key: string]: string;
}

interface CartConfig {
  whatsappNumber: string;
  maxQuantity?: number;
  currency?: string;
  businessName?: string;
}

class WhatsAppCart {
  private cart: Map<string, CartItem>;
  private config: CartConfig;
  private readonly categories: CategoryMap = {
    'proteina': 'Proteína',
    'creatina': 'Creatina',
    'vitaminas': 'Vitaminas',
    'pre-entreno': 'Pre-Entreno',
    'aminoacidos': 'Aminoácidos',
    'quemadores': 'Quemadores',
    'ganadores': 'Ganadores'
  };

  constructor(config: CartConfig) {
    this.cart = new Map<string, CartItem>();
    this.config = {
      maxQuantity: 99,
      currency: '$',
      businessName: 'Suplementos Premium',
      ...config
    };
    this.init();
  }

  private init(): void {
    this.createCartUI();
    this.bindCartEvents();
    this.updateCartDisplay();
  }

  private createCartUI(): void {
    // Crear el botón del carrito flotante
    const cartButton: HTMLDivElement = document.createElement('div');
    cartButton.id = 'cart-button';
    cartButton.innerHTML = `
      <div class="fixed bottom-6 right-6 z-50">
        <button class="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-full shadow-2xl hover:shadow-red-600/25 transition-all duration-300 hover:scale-110 relative">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3m4 10v6a1 1 0 001 1h8a1 1 0 001-1v-6m-9 0h10"/>
          </svg>
          <span id="cart-count" class="absolute -top-2 -right-2 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hidden">0</span>
        </button>
      </div>
    `;
    document.body.appendChild(cartButton);

    // Crear el modal del carrito
    const cartModal: HTMLDivElement = document.createElement('div');
    cartModal.id = 'cart-modal';
    cartModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden items-center justify-center p-2 sm:p-4';
    cartModal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); z-index: 50; display: none; align-items: center; justify-content: center; padding: 8px;';
    cartModal.innerHTML = `
      <div style="background: white; border-radius: 12px; max-width: 672px; width: 100%; max-height: 90vh; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);" class="sm:max-h-[80vh]">
        <div style="padding: 16px; border-bottom: 1px solid rgb(229, 231, 235);" class="sm:p-6">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2 style="font-size: 20px; font-weight: 900; color: rgb(17, 24, 39); margin: 0;" class="sm:text-2xl">Mi Carrito</h2>
            <button id="close-cart" style="color: rgb(75, 85, 99); padding: 4px; background: none; border: none; cursor: pointer;">
              <svg style="width: 24px; height: 24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div style="padding: 12px; overflow-y: auto; max-height: 60vh;" class="sm:p-6 sm:max-h-96">
          <div id="cart-items" style="display: flex; flex-direction: column; gap: 12px;">
            ${this.getEmptyCartHTML()}
          </div>
        </div>
        
        <div style="padding: 16px; border-top: 1px solid rgb(229, 231, 235);" class="sm:p-6">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span style="font-size: 18px; font-weight: bold; color: rgb(17, 24, 39);" class="sm:text-xl">Total:</span>
            <span id="cart-total" style="font-size: 20px; font-weight: 900; color: rgb(249, 115, 22);" class="sm:text-2xl">${this.config.currency}0.00</span>
          </div>
          <button id="whatsapp-order" class="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]" disabled>
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span class="hidden sm:inline">Finalizar Pedido por WhatsApp</span>  
              <span class="sm:hidden">Finalizar por WhatsApp</span>
            </div>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(cartModal);
  }

  private bindCartEvents(): void {
    // Función para manejar la adición al carrito - resistente al traductor de Google
    const handleAddToCart = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Múltiples estrategias para encontrar el botón (resistente al traductor de Google)
      let cartButton: HTMLElement | null = null;
      
      // Estrategia 1: Buscar por atributo data-cart-action
      cartButton = target.closest('[data-cart-action="add"]');
      
      // Estrategia 2: Buscar por data-product-id
      if (!cartButton) {
        cartButton = target.closest('[data-product-id]');
      }
      
      // Estrategia 3: Buscar por clase CSS
      if (!cartButton) {
        cartButton = target.closest('.add-to-cart-btn');
      }
      
      // Estrategia 4: Verificar si el elemento actual es el botón
      if (!cartButton && (target.hasAttribute('data-product-id') || target.hasAttribute('data-cart-action'))) {
        cartButton = target;
      }
      
      // Validar que encontramos un botón válido
      if (cartButton && (
        cartButton.hasAttribute('data-cart-action') ||
        cartButton.hasAttribute('data-product-id') ||
        cartButton.classList.contains('add-to-cart-btn')
      )) {
        e.preventDefault();
        e.stopPropagation();
        const productData = this.extractProductDataFromButton(cartButton);
        if (productData) {
          this.addToCart(productData, 1);
        }
      }
    };

    // Botones "Agregar" en los productos - soporte para click y touch
    document.addEventListener('click', handleAddToCart);
    document.addEventListener('touchend', handleAddToCart);
    
    // Observer para detectar cambios del DOM (traductor de Google)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Re-verificar botones después de cambios en el DOM
          setTimeout(() => {
            const buttons = document.querySelectorAll('[data-cart-action="add"]');
            buttons.forEach(button => {
              // Asegurar que los atributos estén presentes
              if (!button.getAttribute('role')) {
                button.setAttribute('role', 'button');
              }
            });
          }, 100);
        }
      });
    });
    
    // Observar cambios en el documento
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });

    // Función para manejar eventos del carrito
    const handleCartEvents = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Botón del carrito flotante
      if (target.closest('#cart-button')) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleCartModal(true);
        return;
      }
      
      // Botón de cerrar carrito
      if (target.id === 'close-cart' || target.closest('#close-cart')) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleCartModal(false);
        return;
      }
      
      // Cerrar modal al hacer click fuera
      if (target.id === 'cart-modal') {
        this.toggleCartModal(false);
        return;
      }
      
      // Botón de WhatsApp
      if (target.id === 'whatsapp-order' || target.closest('#whatsapp-order')) {
        e.preventDefault();
        e.stopPropagation();
        this.sendToWhatsApp();
        return;
      }
    };

    // Mostrar/ocultar carrito - usando delegación de eventos con soporte táctil
    document.addEventListener('click', handleCartEvents);
    document.addEventListener('touchend', handleCartEvents);
  }

  private toggleCartModal(show: boolean): void {
    const cartModal = document.getElementById('cart-modal');
    if (!cartModal) return;

    if (show) {
      cartModal.style.display = 'flex';
      cartModal.classList.remove('hidden');
      cartModal.classList.add('flex');
    } else {
      cartModal.style.display = 'none';
      cartModal.classList.add('hidden');
      cartModal.classList.remove('flex');
    }
  }

  private showQuantityModal(productCard: HTMLElement): void {
    const productData = this.extractProductData(productCard);
    if (!productData) return;
    
    // Crear modal de cantidad
    const quantityModal: HTMLDivElement = document.createElement('div');
    quantityModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    quantityModal.innerHTML = this.getQuantityModalHTML(productData);
    
    document.body.appendChild(quantityModal);
    
    // Event listeners para el modal de cantidad
    this.bindQuantityModalEvents(quantityModal, productData);
  }

  private getQuantityModalHTML(product: Product): string {
    return `
      <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div class="text-center mb-6">
          <img src="${product.imagen}" alt="${product.nombre}" class="w-20 h-20 object-cover rounded-lg mx-auto mb-4">
          <h3 class="text-xl font-bold text-gray-900">${product.nombre}</h3>
          <p class="text-orange-500 font-semibold">${product.marca}</p>
          <p class="text-2xl font-black text-gray-900 mt-2">${product.precio !== null ? (this.config.currency || '$') + product.precio : 'Consultar precio'}</p>
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-900 font-semibold mb-2">Cantidad:</label>
          <div class="flex items-center justify-center space-x-4">
            <button id="decrease-qty" class="bg-orange-500 text-white w-10 h-10 rounded-full hover:bg-orange-600 transition-colors">-</button>
            <input type="number" id="quantity-input" value="1" min="1" max="${this.config.maxQuantity}" class="bg-gray-100 text-gray-900 text-center w-20 h-10 rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none">
            <button id="increase-qty" class="bg-orange-500 text-white w-10 h-10 rounded-full hover:bg-orange-600 transition-colors">+</button>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button id="cancel-add" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors">Cancelar</button>
          <button id="confirm-add" class="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all">Agregar</button>
        </div>
      </div>
    `;
  }

  private bindQuantityModalEvents(modal: HTMLDivElement, product: Product): void {
    const quantityInput = modal.querySelector('#quantity-input') as HTMLInputElement;
    const decreaseBtn = modal.querySelector('#decrease-qty') as HTMLButtonElement;
    const increaseBtn = modal.querySelector('#increase-qty') as HTMLButtonElement;
    const confirmBtn = modal.querySelector('#confirm-add') as HTMLButtonElement;
    const cancelBtn = modal.querySelector('#cancel-add') as HTMLButtonElement;
    
    decreaseBtn?.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = (currentValue - 1).toString();
      }
    });
    
    increaseBtn?.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue < (this.config.maxQuantity || 99)) {
        quantityInput.value = (currentValue + 1).toString();
      }
    });
    
    confirmBtn?.addEventListener('click', () => {
      const quantity = parseInt(quantityInput.value);
      this.addToCart(product, quantity);
      document.body.removeChild(modal);
    });
    
    cancelBtn?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Cerrar al hacer click fuera
    modal.addEventListener('click', (e: Event) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    // Validación del input
    quantityInput?.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const value = parseInt(target.value);
      if (isNaN(value) || value < 1) {
        target.value = '1';
      } else if (value > (this.config.maxQuantity || 99)) {
        target.value = (this.config.maxQuantity || 99).toString();
      }
    });
  }

  private extractProductData(productCard: HTMLElement): Product | null {
    try {
      const nombreElement = productCard.querySelector('h3');
      const marcaElement = productCard.querySelector('.text-red-400');
      const precioElement = productCard.querySelector('.text-xl.font-black');
      const imagenElement = productCard.querySelector('img') as HTMLImageElement;
      const descripcionElement = productCard.querySelector('.text-gray-400');

      if (!nombreElement || !marcaElement || !precioElement || !imagenElement) {
        throw new Error('Elementos requeridos no encontrados');
      }

      return {
        id: productCard.dataset.productId || Date.now().toString(),
        nombre: nombreElement.textContent?.trim() || '',
        marca: marcaElement.textContent?.trim() || '',
        categoria: productCard.dataset.category || 'sin-categoria',
        precio: parseFloat(precioElement.textContent?.replace(this.config.currency || '$', '') || '0'),
        imagen: imagenElement.src,
        descripcion: descripcionElement?.textContent?.trim() || ''
      };
    } catch (error) {
      console.error('Error extrayendo datos del producto:', error);
      return null;
    }
  }

  private extractProductDataFromButton(button: HTMLElement): Product | null {
    try {
      const id = button.dataset.productId;
      const nombre = button.dataset.productName;
      const marca = button.dataset.productBrand;
      const categoria = button.dataset.productCategory;
      const imagen = button.dataset.productImage;
      const descripcion = button.dataset.productDescription;
      const precioStr = button.dataset.productPrice;

      if (!id || !nombre || !marca || !imagen) {
        throw new Error('Datos del producto incompletos en el botón');
      }

      return {
        id,
        nombre,
        marca,
        categoria: categoria || 'sin-categoria',
        precio: precioStr && precioStr !== 'null' ? parseFloat(precioStr) : null,
        imagen,
        descripcion: descripcion || ''
      };
    } catch (error) {
      console.error('Error extrayendo datos del producto desde el botón:', error);
      return null;
    }
  }

  private addToCart(product: Product, quantity: number): void {
    if (quantity <= 0) return;

    const existingItem = this.cart.get(product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.set(product.id, { ...product, quantity });
    }
    
    this.updateCartDisplay();
  }

  private removeFromCart(productId: string): void {
    this.cart.delete(productId);
    this.updateCartDisplay();
  }

  private updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const item = this.cart.get(productId);
    if (item && newQuantity <= (this.config.maxQuantity || 99)) {
      item.quantity = newQuantity;
      this.updateCartDisplay();
    }
  }

  private updateCartDisplay(): void {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const whatsappButton = document.getElementById('whatsapp-order') as HTMLButtonElement;
    
    const totalItems = this.getTotalItems();
    const totalPrice = this.getTotalPrice();
    
    // Actualizar contador
    if (cartCount) {
      if (totalItems > 0) {
        cartCount.textContent = totalItems.toString();
        cartCount.classList.remove('hidden');
      } else {
        cartCount.classList.add('hidden');
      }
    }
    
    // Actualizar items del carrito
    if (cartItems) {
      cartItems.innerHTML = this.cart.size === 0 
        ? this.getEmptyCartHTML()
        : this.getCartItemsHTML();
    }
    
    // Actualizar total
    if (cartTotal) {
      cartTotal.textContent = `${this.config.currency}${totalPrice.toFixed(2)}`;
    }
    
    // Habilitar/deshabilitar botón WhatsApp
    if (whatsappButton) {
      whatsappButton.disabled = this.cart.size === 0;
    }
    
    // Agregar event listeners para botones de cantidad y eliminar
    this.bindCartItemEvents();
  }

  private getEmptyCartHTML(): string {
    return `
      <div class="text-center text-gray-500 py-8">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3m4 10v6a1 1 0 001 1h8a1 1 0 001-1v-6m-9 0h10"/>
        </svg>
        <p>Tu carrito está vacío</p>
      </div>
    `;
  }

  private getCartItemsHTML(): string {
    return Array.from(this.cart.values()).map(item => `
      <div class="bg-gray-800 rounded-lg p-3 sm:p-4" style="border-radius: 8px; background-color: rgb(31, 41, 55);">
        <!-- Layout principal responsive -->
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <img src="${item.imagen}" alt="${item.nombre}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" class="sm:w-16 sm:h-16">
          
          <!-- Información del producto -->
          <div style="flex: 1; min-width: 0; overflow: hidden;">
            <h4 style="color: white; font-weight: bold; font-size: 14px; margin: 0 0 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" class="sm:text-base">${item.nombre}</h4>
            <p style="color: rgb(156, 163, 175); font-size: 12px; margin: 0 0 4px 0;" class="sm:text-sm">${item.marca}</p>
            <p style="color: rgb(251, 146, 60); font-weight: 600; font-size: 14px; margin: 0;" class="sm:text-base">${item.precio !== null ? (this.config.currency || '$') + item.precio : 'Consultar'}</p>
          </div>
          
          <!-- Botón eliminar -->
          <button class="remove-btn" data-id="${item.id}" style="color: rgb(251, 146, 60); padding: 4px; flex-shrink: 0; background: none; border: none; cursor: pointer;">
            <svg style="width: 16px; height: 16px;" class="sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
        
        <!-- Controles de cantidad en línea separada -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgb(75, 85, 99);">
          <span style="color: rgb(156, 163, 175); font-size: 14px;">Cantidad:</span>
          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="quantity-btn" data-id="${item.id}" data-action="decrease" style="background: rgb(249, 115, 22); color: white; width: 32px; height: 32px; border-radius: 50%; font-size: 14px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
            <span style="color: white; font-weight: bold; width: 32px; text-align: center; font-size: 14px;" class="sm:text-base">${item.quantity}</span>
            <button class="quantity-btn" data-id="${item.id}" data-action="increase" style="background: rgb(249, 115, 22); color: white; width: 32px; height: 32px; border-radius: 50%; font-size: 14px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  private bindCartItemEvents(): void {
    document.querySelectorAll<HTMLButtonElement>('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.id;
        const action = btn.dataset.action;
        
        if (!productId || !action) return;
        
        const item = this.cart.get(productId);
        if (item) {
          const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
          this.updateQuantity(productId, newQuantity);
        }
      });
    });
    
    document.querySelectorAll<HTMLButtonElement>('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.id;
        if (productId) {
          this.removeFromCart(productId);
        }
      });
    });
  }

  private showAddedToCartNotification(productName: string, quantity: number): void {
    const notification: HTMLDivElement = document.createElement('div');
    notification.className = 'fixed top-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <div>
          <p class="font-bold">¡Agregado al carrito!</p>
          <p class="text-sm">${quantity}x ${productName}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  private generateWhatsAppMessage(): string {
    const items = Array.from(this.cart.values());
    const totalPrice = this.getTotalPrice();
    
    let message = `*🛒 PEDIDO DE ${this.config.businessName?.toUpperCase()}*\n\n`;
    message += '*Productos seleccionados:*\n';
    
    items.forEach((item, index) => {
      message += `\n${index + 1}. *${item.nombre}*\n`;
      message += `   • Cantidad: ${item.quantity}\n`;
      if (item.precio !== null) {
        message += `   • Precio unitario: ${this.config.currency}${item.precio}\n`;
        message += `   • Subtotal: ${this.config.currency}${(item.precio * item.quantity).toFixed(2)}\n`;
      } else {
        message += `   • Precio: Consultar\n`;
      }
    });
    
    const hasProductsWithoutPrice = items.some(item => item.precio === null);
    
    if (hasProductsWithoutPrice) {
      if (totalPrice > 0) {
        message += `\n*💰 TOTAL PRODUCTOS CON PRECIO: ${this.config.currency}${totalPrice.toFixed(2)}*\n`;
        message += `*(Productos sin precio: consultar)*\n\n`;
      } else {
        message += `\n*💰 TOTAL: A consultar*\n\n`;
      }
    } else {
      message += `\n*💰 TOTAL: ${this.config.currency}${totalPrice.toFixed(2)}*\n\n`;
    }
    
    message += '¿Podrían confirmar disponibilidad y forma de pago? ¡Gracias!';
    
    return encodeURIComponent(message);
  }

  private getCategoryName(categoryId: string): string {
    return this.categories[categoryId] || categoryId;
  }

  private sendToWhatsApp(): void {
    const message = this.generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${this.config.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }

  private getTotalItems(): number {
    return Array.from(this.cart.values()).reduce((sum, item) => sum + item.quantity, 0);
  }

  private getTotalPrice(): number {
    return Array.from(this.cart.values()).reduce((sum, item) => sum + ((item.precio || 0) * item.quantity), 0);
  }

  // Métodos públicos para API externa
  public getCartItems(): CartItem[] {
    return Array.from(this.cart.values());
  }

  public getCartCount(): number {
    return this.getTotalItems();
  }

  public getCartTotal(): number {
    return this.getTotalPrice();
  }

  public clearCart(): void {
    this.cart.clear();
    this.updateCartDisplay();
  }

  public addProduct(product: Product, quantity: number = 1): void {
    this.addToCart(product, quantity);
  }
}

// Default cart configuration
const cartConfig: CartConfig = {
  whatsappNumber: '5492646615213',
  maxQuantity: 99,
  currency: '$',
  businessName: 'Suplementos Premium'
};

// Inicialización con configuración tipada
document.addEventListener('DOMContentLoaded', () => {
  (window as any).whatsappCart = new WhatsAppCart(cartConfig);
});