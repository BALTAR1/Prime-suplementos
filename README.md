# Prime Suplementos 💪

Una moderna página web para tienda de suplementos deportivos construida con **Astro** y **Tailwind CSS**.

## 🚀 Características

- **Diseño Responsivo**: Optimizado para móvil, tablet y desktop
- **Paleta de Colores Naranja**: Identidad visual moderna con colores `#FF4C1D`
- **Catálogo Completo**: 50+ productos organizados en 6 categorías
- **Filtros Avanzados**: Por categoría y marca
- **Integración WhatsApp**: Contacto directo para consultas
- **Animaciones Suaves**: Efectos visuales atractivos
- **SEO Optimizado**: Meta tags y estructura semántica

## 🛠 Tecnologías

- **Astro 5.14.1** - Framework de desarrollo web
- **Tailwind CSS 4.1.11** - Framework de CSS utilitario
- **TypeScript** - Tipado estático
- **JSON** - Base de datos de productos

## 📦 Estructura del Proyecto

```
/
├── public/
│   ├── proteinas/          # Imágenes de proteínas
│   ├── creatinas/          # Imágenes de creatinas
│   ├── vitaminas/          # Imágenes de vitaminas
│   ├── preentrenos/        # Imágenes de pre-entrenos
│   ├── aminos/             # Imágenes de aminoácidos
│   ├── ganadores/          # Imágenes de ganadores de peso
│   └── logo.png            # Logo de la empresa
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Header.astro    # Sección principal
│   │   ├── Categorias.astro # Categorías de productos
│   │   ├── About.astro     # Información de la empresa
│   │   ├── CTA.astro       # Llamada a la acción
│   │   ├── Footer.astro    # Pie de página
│   │   └── Nav.astro       # Navegación
│   ├── data/
│   │   ├── productos.json  # Base de datos de productos
│   │   └── categorias.json # Configuración de categorías
│   ├── layouts/
│   │   └── Layout.astro    # Layout principal
│   ├── pages/
│   │   ├── index.astro     # Página de inicio
│   │   └── productos.astro # Página de productos
│   ├── scripts/
│   │   ├── productFilter.ts # Filtros de productos
│   │   └── wsp-cart.ts     # Integración WhatsApp
│   └── styles/
│       └── global.css      # Estilos globales
```

## 🎨 Paleta de Colores

- **Naranja Principal**: `#FF4C1D` (`orange-500`)
- **Naranja Oscuro**: `#E8390C` (`orange-600`)
- **Naranja Claro**: `#FF7A47` (`orange-400`)
- **Grises**: `gray-50` a `gray-900`
- **Fondo Principal**: Blanco (`white`)

## 📱 Secciones

1. **Header**: Presentación principal con imagen de producto
2. **Categorías**: 4 categorías principales de suplementos
3. **Sobre Nosotros**: Información de la empresa y valores
4. **CTA**: Llamada a la acción con contacto WhatsApp
5. **Footer**: Enlaces, contacto y información legal

## 🛍 Productos

- **Proteínas**: 8 productos
- **Creatinas**: 5 productos  
- **Pre-entrenos**: 5 productos
- **Aminoácidos**: 6 productos
- **Vitaminas**: 18 productos
- **Ganadores**: 6 productos

## 📞 Contacto

- **Teléfono**: 2646615213
- **Ubicación**: San Juan, Capital 5400
- **WhatsApp**: Integración directa para consultas

## 🚀 Instalación

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Ejecutar en desarrollo: `npm run dev`
4. Construir para producción: `npm run build`

## 📈 Deploy en Vercel

Este proyecto está optimizado para deployment en Vercel:

1. Conectar repositorio a Vercel
2. Configurar como proyecto Astro
3. Deploy automático

## 🔧 Comandos

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa del build
npm run astro        # CLI de Astro
```

## ✨ Características Destacadas

- **100% Responsive**: Diseño adaptable a todos los dispositivos
- **Performance Optimizado**: Carga rápida y eficiente
- **Filtros Inteligentes**: Búsqueda por categoría y marca
- **Integración Social**: Contacto directo por WhatsApp
- **Diseño Moderno**: Interfaz limpia y profesional

---

**Prime Suplementos** - Tu tienda de confianza para suplementos deportivos 💪
