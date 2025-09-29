// Interfaces corregidas
interface ProductData {
  category?: string;
  brand?: string;
  element?: HTMLElement;
  [key: string]: string | HTMLElement | undefined;
}

interface FilterStats {
  total: number;
  visible: number;
  filtered: number;
  activeFilters: number;
}

interface FilterConfig {
  filterDelay?: number;
  animationDelay?: number;
  enableSearch?: boolean;
  enableCounts?: boolean;
}

export class ProductFilter {
  private filterCheckboxes: NodeListOf<HTMLInputElement>;
  private productCards: NodeListOf<HTMLElement>;
  private clearFiltersBtn: HTMLElement | null;
  private noProductsMsg: HTMLElement | null;
  private productsGrid: HTMLElement | null;
  
  // Cache para mejorar rendimiento
  private activeFilters: Map<string, Set<string>>;
  private productData: Map<HTMLElement, ProductData>;
  
  // Throttling - Corregido
  private filterDelay: number | null = null;
  
  // Configuración
  private config: FilterConfig;
  
  constructor(config: FilterConfig = {}) {
    this.config = {
      filterDelay: 150,
      animationDelay: 50,
      enableSearch: true,
      enableCounts: true,
      ...config
    };
    
    this.filterCheckboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    this.productCards = document.querySelectorAll<HTMLElement>('.product-card');
    this.clearFiltersBtn = document.getElementById('clearFilters');
    this.noProductsMsg = document.getElementById('noProducts');
    this.productsGrid = document.getElementById('productsGrid');
    
    this.activeFilters = new Map<string, Set<string>>();
    this.productData = new Map<HTMLElement, ProductData>();
    
    this.init();
  }

  private init(): void {
    this.cacheProductData();
    this.bindEvents();
    this.initializeFilters();
    
    if (this.config.enableSearch) {
      this.addSearchFunctionality();
    }
  }

  private cacheProductData(): void {
    this.productCards.forEach((card: HTMLElement) => {
      const dataset = card.dataset as DOMStringMap;
      this.productData.set(card, {
        category: dataset.category,
        brand: dataset.brand,
        element: card
      });
    });
  }

  private bindEvents(): void {
    // Event delegation con tipado
    document.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && target.matches('input[type="checkbox"]')) {
        this.handleFilterChange(target);
      }
    });

    // Limpiar filtros
    this.clearFiltersBtn?.addEventListener('click', () => {
      this.clearAllFilters();
    });
  }

  private handleFilterChange(checkbox: HTMLInputElement): void {
    this.updateCheckboxIndicator(checkbox);
    this.updateActiveFilters();
    
    // Throttle tipado - Corregido
    if (this.filterDelay !== null) {
      clearTimeout(this.filterDelay);
    }
    
    this.filterDelay = window.setTimeout(() => {
      this.filterProducts();
    }, this.config.filterDelay || 150);
  }

  private updateActiveFilters(): void {
    this.activeFilters.clear();
    
    this.filterCheckboxes.forEach((checkbox: HTMLInputElement) => {
      if (checkbox.checked) {
        Object.entries(checkbox.dataset).forEach(([key, value]: [string, string | undefined]) => {
          if (value) {
            if (!this.activeFilters.has(key)) {
              this.activeFilters.set(key, new Set<string>());
            }
            this.activeFilters.get(key)!.add(value);
          }
        });
      }
    });
  }

  private filterProducts(): void {
    let visibleCount = 0;
    const hasFilters = this.activeFilters.size > 0;

    // DocumentFragment tipado
    const fragment: DocumentFragment = document.createDocumentFragment();
    const hiddenCards: HTMLElement[] = [];

    this.productCards.forEach((card: HTMLElement) => {
      const productData = this.productData.get(card);
      let shouldShow = true;

      if (hasFilters && productData) {
        shouldShow = this.checkProductMatch(productData);
      }

      if (shouldShow) {
        card.classList.remove('hidden');
        fragment.appendChild(card);
        visibleCount++;
      } else {
        card.classList.add('hidden');
        hiddenCards.push(card);
      }
    });

    // Batch DOM updates
    if (fragment.children.length > 0 && this.productsGrid) {
      this.productsGrid.appendChild(fragment);
    }

    // Agregar cards ocultas al final
    hiddenCards.forEach((card: HTMLElement) => {
      this.productsGrid?.appendChild(card);
    });

    this.toggleNoProductsMessage(visibleCount === 0);
    
    if (this.config.enableCounts) {
      this.updateFilterCounts();
    }
    
    this.animateResults();
  }

  private checkProductMatch(productData: ProductData): boolean {
    for (const [filterType, values] of this.activeFilters.entries()) {
      const productValue = productData[filterType] as string;
      if (productValue && !values.has(productValue)) {
        return false;
      }
    }
    return true;
  }

  private updateCheckboxIndicator(checkbox: HTMLInputElement): void {
    const label = checkbox.closest('label');
    const indicator = label?.querySelector<HTMLElement>('div > div');
    
    if (indicator) {
      indicator.classList.toggle('hidden', !checkbox.checked);
      
      // Animación suave tipada
      if (checkbox.checked) {
        indicator.style.transform = 'scale(0)';
        indicator.classList.remove('hidden');
        
        requestAnimationFrame(() => {
          indicator.style.transition = 'transform 0.2s ease';
          indicator.style.transform = 'scale(1)';
        });
      }
    }

    // Actualizar estado visual
    label?.classList.toggle('filter-active', checkbox.checked);
  }

  private clearAllFilters(): void {
    this.filterCheckboxes.forEach((checkbox: HTMLInputElement) => {
      if (checkbox.checked) {
        checkbox.checked = false;
        this.updateCheckboxIndicator(checkbox);
      }
    });
    
    this.activeFilters.clear();
    this.filterProducts();
  }

  private toggleNoProductsMessage(show: boolean): void {
    if (!this.noProductsMsg) return;
    
    this.noProductsMsg.classList.toggle('hidden', !show);
    
    if (show) {
      this.noProductsMsg.style.opacity = '0';
      this.noProductsMsg.style.transform = 'translateY(20px)';
      
      requestAnimationFrame(() => {
        if (this.noProductsMsg) {
          this.noProductsMsg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          this.noProductsMsg.style.opacity = '1';
          this.noProductsMsg.style.transform = 'translateY(0)';
        }
      });
    }
  }

  private updateFilterCounts(): void {
    this.filterCheckboxes.forEach((checkbox: HTMLInputElement) => {
      const label = checkbox.closest('label');
      let countSpan = label?.querySelector<HTMLSpanElement>('.filter-count');
      
      if (!countSpan) {
        const count = this.getFilterCount(checkbox);
        if (count > 0) {
          countSpan = document.createElement('span');
          countSpan.className = 'filter-count text-xs text-gray-500 ml-auto';
          countSpan.textContent = `(${count})`;
          label?.appendChild(countSpan);
        }
      } else {
        const count = this.getFilterCount(checkbox);
        countSpan.textContent = count > 0 ? `(${count})` : '';
        countSpan.style.display = count > 0 ? 'inline' : 'none';
      }
    });
  }

  private getFilterCount(checkbox: HTMLInputElement): number {
    let count = 0;
    const filterData = checkbox.dataset;
    
    this.productCards.forEach((card: HTMLElement) => {
      if (!card.classList.contains('hidden')) {
        let matches = true;
        for (const [key, value] of Object.entries(filterData)) {
          if (value && card.dataset[key] !== value) {
            matches = false;
            break;
          }
        }
        if (matches) count++;
      }
    });
    
    return count;
  }

  private animateResults(): void {
    const visibleCards: HTMLElement[] = Array.from(this.productCards).filter((card: HTMLElement) => 
      !card.classList.contains('hidden')
    );
    
    visibleCards.forEach((card: HTMLElement, index: number) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * (this.config.animationDelay || 50));
    });
  }

  private addSearchFunctionality(): void {
    const searchInput: HTMLInputElement = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar productos...';
    searchInput.className = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 mb-6';
    searchInput.id = 'productSearch';
    
    // Selector corregido
    const filterContainer = document.querySelector<HTMLElement>('[class*="lg:col-span-3"] > div');
    if (filterContainer && filterContainer.firstChild) {
      filterContainer.insertBefore(searchInput, filterContainer.firstChild.nextSibling);
    }
    
    let searchTimeout: number;
    searchInput.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      clearTimeout(searchTimeout);
      searchTimeout = window.setTimeout(() => {
        this.filterBySearch(target.value.toLowerCase());
      }, 300);
    });
  }

  private filterBySearch(searchTerm: string): void {
    this.productCards.forEach((card: HTMLElement) => {
      if (!searchTerm) {
        card.classList.remove('search-hidden');
        return;
      }
      
      const productName = card.querySelector<HTMLElement>('h3')?.textContent?.toLowerCase() || '';
      const productDescription = card.querySelector<HTMLElement>('.text-gray-400')?.textContent?.toLowerCase() || '';
      const productBrand = card.querySelector<HTMLElement>('.text-red-400')?.textContent?.toLowerCase() || '';
      
      const matches = productName.includes(searchTerm) || 
                     productDescription.includes(searchTerm) || 
                     productBrand.includes(searchTerm);
      
      card.classList.toggle('search-hidden', !matches);
    });
    
    this.updateVisibility();
  }

  private updateVisibility(): void {
    let visibleCount = 0;
    
    this.productCards.forEach((card: HTMLElement) => {
      const isFilterHidden = card.classList.contains('hidden');
      const isSearchHidden = card.classList.contains('search-hidden');
      const shouldShow = !isFilterHidden && !isSearchHidden;
      
      card.style.display = shouldShow ? '' : 'none';
      if (shouldShow) visibleCount++;
    });
    
    this.toggleNoProductsMessage(visibleCount === 0);
  }

  private initializeFilters(): void {
    this.updateActiveFilters();
    this.filterProducts();
  }

  // Métodos públicos con tipado
  public getStats(): FilterStats {
    const totalProducts = this.productCards.length;
    const visibleProducts = Array.from(this.productCards).filter((card: HTMLElement) => 
      !card.classList.contains('hidden') && !card.classList.contains('search-hidden')
    ).length;
    
    return {
      total: totalProducts,
      visible: visibleProducts,
      filtered: totalProducts - visibleProducts,
      activeFilters: this.activeFilters.size
    };
  }

  public resetFilters(): void {
    this.clearAllFilters();
  }

  public getActiveFilters(): Map<string, Set<string>> {
    return new Map(this.activeFilters);
  }
}

// Función de inicialización
export function initializeProductFilter(config?: FilterConfig): ProductFilter {
  return new ProductFilter(config);
}

// Estilos adicionales
export const additionalStyles = `
  .filter-active {
    color: #ef4444 !important;
  }
  
  .filter-count {
    transition: opacity 0.2s ease;
  }
  
  .product-card {
    transition: opacity 0.3s ease, transform 0.3s ease !important;
  }
  
  .search-hidden {
    display: none !important;
  }
`;