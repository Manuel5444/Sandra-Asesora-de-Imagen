/**
 * Servicio de Mapas · Sandra Manresa
 * Lugares preconfigurados por ciudad + Google Places API opcional
 * Si no hay clave de Google, usa Claude AI como fallback
 */

import type { LugarMapa, TipoLugar, RutaShopping, PerfilClienta, RangoPrecio } from '../types';
import { claudeService } from './claude';

const GOOGLE_MAPS_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';

// Ciudades con contenido preconfigurado (v3.0)
export const CIUDADES_SOPORTADAS = [
  'Madrid', 'Barcelona', 'París', 'Milán', 'Londres',
  'Nueva York', 'Roma', 'Berlín', 'Lisboa', 'Ámsterdam',
  'Tokio', 'Buenos Aires',
] as const;

export type CiudadSoportada = typeof CIUDADES_SOPORTADAS[number];

// Coordenadas de las ciudades principales
const COORDENADAS_CIUDADES: Record<string, { lat: number; lng: number }> = {
  Madrid: { lat: 40.4168, lng: -3.7038 },
  Barcelona: { lat: 41.3851, lng: 2.1734 },
  París: { lat: 48.8566, lng: 2.3522 },
  Milán: { lat: 45.4654, lng: 9.1859 },
  Londres: { lat: 51.5074, lng: -0.1278 },
  'Nueva York': { lat: 40.7128, lng: -74.006 },
  Roma: { lat: 41.9028, lng: 12.4964 },
  Berlín: { lat: 52.52, lng: 13.405 },
  Lisboa: { lat: 38.7223, lng: -9.1393 },
  Ámsterdam: { lat: 52.3676, lng: 4.9041 },
  Tokio: { lat: 35.6762, lng: 139.6503 },
  'Buenos Aires': { lat: -34.6037, lng: -58.3816 },
};

// ─── Lugares preconfigurados por ciudad ──────────────────────────────────────

const LUGARES_MADRID_SHOPPING: Omit<LugarMapa, 'distanciaMetros' | 'tiempoMinutos'>[] = [
  {
    id: 'madrid-massimo-dutti',
    nombre: 'Massimo Dutti',
    direccion: 'C/ Serrano 44, Madrid 28001',
    ciudad: 'Madrid',
    latitud: 40.4234,
    longitud: -3.6894,
    tipo: 'tienda',
    descripcion: 'Básicos de calidad · Tu paleta exacta',
    horarios: 'L-S 10:00-21:00',
    precioEstimado: '€€€',
    recomendadoPorSandra: true,
    notaSandra: 'Sus prendas de temporada son perfectas para completar tu armario cápsula.',
  },
  {
    id: 'madrid-zara-gran-via',
    nombre: 'Zara Woman',
    direccion: 'Gran Vía 34, Madrid 28013',
    ciudad: 'Madrid',
    latitud: 40.4201,
    longitud: -3.7027,
    tipo: 'tienda',
    descripcion: 'Tendencia + asequible',
    horarios: 'L-S 10:00-22:00',
    precioEstimado: '€€',
    recomendadoPorSandra: true,
    notaSandra: 'La colección de blazers de esta temporada está hecha para tu momento vital.',
  },
  {
    id: 'madrid-mango',
    nombre: 'Mango',
    direccion: 'C/ Fuencarral 118, Madrid 28010',
    ciudad: 'Madrid',
    latitud: 40.4286,
    longitud: -3.7014,
    tipo: 'tienda',
    descripcion: 'Casual-elegante · Tallas inclusivas',
    horarios: 'L-S 10:00-21:30',
    precioEstimado: '€€',
    recomendadoPorSandra: false,
    notaSandra: 'Ideal para prendas de transición entre estaciones.',
  },
  {
    id: 'madrid-corte-ingles-preciados',
    nombre: 'El Corte Inglés Moda',
    direccion: 'Preciados 3, Madrid 28013',
    ciudad: 'Madrid',
    latitud: 40.4199,
    longitud: -3.7019,
    tipo: 'tienda',
    descripcion: 'Premium · Marcas internacionales',
    horarios: 'L-S 10:00-22:00, D 11:00-21:00',
    precioEstimado: '€€€€',
    recomendadoPorSandra: true,
    notaSandra: 'La planta de diseñadores es donde encuentro piezas únicas para mis clientas especiales.',
  },
  {
    id: 'madrid-uterque',
    nombre: 'Uterqüe',
    direccion: 'C/ Ortega y Gasset 14, Madrid 28006',
    ciudad: 'Madrid',
    latitud: 40.4246,
    longitud: -3.6846,
    tipo: 'tienda',
    descripcion: 'Complementos y accesorios únicos',
    horarios: 'L-S 10:00-21:00',
    precioEstimado: '€€€',
    recomendadoPorSandra: true,
    notaSandra: 'Sus bolsos y cinturones elevan cualquier look básico al siguiente nivel.',
  },
];

const LUGARES_MADRID_OCIO: Omit<LugarMapa, 'distanciaMetros' | 'tiempoMinutos'>[] = [
  {
    id: 'madrid-juana-la-loca',
    nombre: 'Juana la Loca',
    direccion: 'Plaza Puerta de Moros 4, Madrid 28005',
    ciudad: 'Madrid',
    latitud: 40.4127,
    longitud: -3.7088,
    tipo: 'restaurante',
    descripcion: 'Cóctel · Ambiente íntimo · Luces cálidas',
    horarios: 'Ma-D 13:00-00:00',
    precioEstimado: '€€€',
    recomendadoPorSandra: true,
    notaSandra: 'El lugar perfecto para una primera cita especial o para celebrar tu nueva etapa.',
  },
  {
    id: 'madrid-invernadero',
    nombre: 'El Invernadero',
    direccion: 'C/ Ponzano 85, Madrid 28003',
    ciudad: 'Madrid',
    latitud: 40.4344,
    longitud: -3.6997,
    tipo: 'restaurante',
    descripcion: '2 estrellas Michelin · Experiencia sensorial',
    horarios: 'Ma-Sa 14:00-16:00, 21:00-23:00',
    precioEstimado: '€€€€',
    recomendadoPorSandra: true,
    notaSandra: 'Para celebraciones muy especiales. Reserva con 2-3 semanas de antelación.',
  },
  {
    id: 'madrid-galeria-marlborough',
    nombre: 'Galería Marlborough',
    direccion: 'C/ Orfila 5, Madrid 28010',
    ciudad: 'Madrid',
    latitud: 40.4313,
    longitud: -3.6959,
    tipo: 'cultura',
    descripcion: 'Arte contemporáneo · Apertura libre',
    horarios: 'L-S 10:00-14:00, 17:00-20:30',
    precioEstimado: 'Gratis',
    recomendadoPorSandra: true,
    notaSandra: 'Cultura y estilo en el mismo sitio. Siempre hay algo inspirador.',
  },
  {
    id: 'madrid-mercado-motores',
    nombre: 'Mercado de Motores',
    direccion: 'Museo del Ferrocarril, Delicias, Madrid',
    ciudad: 'Madrid',
    latitud: 40.4041,
    longitud: -3.6942,
    tipo: 'ocio',
    descripcion: 'Vintage y diseño · Primer fin de semana del mes',
    horarios: '1er fin de semana del mes: S-D 11:00-22:00',
    precioEstimado: '€',
    recomendadoPorSandra: false,
    notaSandra: 'Donde encontrarás esas piezas únicas que no están en ninguna tienda normal.',
  },
];

// ─── Lugares preconfigurados: Barcelona ──────────────────────────────────────

const LUGARES_BARCELONA_SHOPPING: Omit<LugarMapa, 'distanciaMetros' | 'tiempoMinutos'>[] = [
  {
    id: 'bcn-massimo-dutti-pg-gracia',
    nombre: 'Massimo Dutti',
    direccion: 'Passeig de Gràcia 96, Barcelona 08008',
    ciudad: 'Barcelona',
    latitud: 41.3963,
    longitud: 2.1619,
    tipo: 'tienda',
    descripcion: 'Básicos de calidad · Colección premium',
    horarios: 'L-S 10:00-21:00',
    precioEstimado: '€€€',
    recomendadoPorSandra: true,
    notaSandra: 'La tienda más grande y completa de España. Perfecta para tu armario cápsula.',
  },
  {
    id: 'bcn-zara-pg-gracia',
    nombre: 'Zara Woman',
    direccion: 'Passeig de Gràcia 16, Barcelona 08007',
    ciudad: 'Barcelona',
    latitud: 41.3906,
    longitud: 2.1652,
    tipo: 'tienda',
    descripcion: 'Tendencia actual · Muy completa',
    horarios: 'L-S 10:00-22:00',
    precioEstimado: '€€',
    recomendadoPorSandra: true,
    notaSandra: 'La colección de esta temporada tiene piezas clave que elevan cualquier look.',
  },
  {
    id: 'bcn-el-corte-ingles',
    nombre: 'El Corte Inglés · Diagonal',
    direccion: 'Avinguda Diagonal 617, Barcelona 08028',
    ciudad: 'Barcelona',
    latitud: 41.3892,
    longitud: 2.1345,
    tipo: 'tienda',
    descripcion: 'Premium · Todas las marcas en un solo espacio',
    horarios: 'L-S 10:00-21:30',
    precioEstimado: '€€€€',
    recomendadoPorSandra: true,
    notaSandra: 'En la sección de diseñadores encuentro piezas únicas para ocasiones especiales.',
  },
  {
    id: 'bcn-bershka',
    nombre: 'Mango · Passeig de Gràcia',
    direccion: 'Passeig de Gràcia 65, Barcelona 08008',
    ciudad: 'Barcelona',
    latitud: 41.3944,
    longitud: 2.1619,
    tipo: 'tienda',
    descripcion: 'Casual elegante · La sede central de Mango',
    horarios: 'L-S 10:00-21:00',
    precioEstimado: '€€',
    recomendadoPorSandra: false,
    notaSandra: 'La flagship store de Mango en Barcelona tiene piezas exclusivas que no encontrarás en otras ciudades.',
  },
  {
    id: 'bcn-vila-hortencia',
    nombre: 'Santa Eulàlia',
    direccion: 'Passeig de Gràcia 93, Barcelona 08008',
    ciudad: 'Barcelona',
    latitud: 41.3960,
    longitud: 2.1617,
    tipo: 'tienda',
    descripcion: 'Multimarca de lujo · Selección curada',
    horarios: 'L-S 10:00-20:30',
    precioEstimado: '€€€€',
    recomendadoPorSandra: true,
    notaSandra: 'La joya de Barcelona para prendas de alta moda. Valentino, Bottega Veneta, Loro Piana.',
  },
];

const LUGARES_BARCELONA_OCIO: Omit<LugarMapa, 'distanciaMetros' | 'tiempoMinutos'>[] = [
  {
    id: 'bcn-lasarte',
    nombre: 'Lasarte',
    direccion: 'C/ Mallorca 259, Barcelona 08008',
    ciudad: 'Barcelona',
    latitud: 41.3942,
    longitud: 2.1567,
    tipo: 'restaurante',
    descripcion: '3 estrellas Michelin · Alta cocina vasca',
    horarios: 'Ma-Sa 13:30-15:30, 20:30-22:30',
    precioEstimado: '€€€€',
    recomendadoPorSandra: true,
    notaSandra: 'Para celebraciones muy especiales. El mejor de Barcelona. Reserva con mes de antelación.',
  },
  {
    id: 'bcn-tickets',
    nombre: 'Bodega Sepúlveda',
    direccion: 'C/ Sepúlveda 173, Barcelona 08011',
    ciudad: 'Barcelona',
    latitud: 41.3803,
    longitud: 2.1607,
    tipo: 'restaurante',
    descripcion: 'Ambiente íntimo · Vinos naturales',
    horarios: 'L-D 13:00-00:00',
    precioEstimado: '€€€',
    recomendadoPorSandra: true,
    notaSandra: 'El ambiente es perfecto para una velada íntima. Los vinos naturales son extraordinarios.',
  },
  {
    id: 'bcn-macba',
    nombre: 'MACBA · Museu d\'Art Contemporani',
    direccion: 'Plaça dels Àngels 1, Barcelona 08001',
    ciudad: 'Barcelona',
    latitud: 41.3833,
    longitud: 2.1668,
    tipo: 'cultura',
    descripcion: 'Arte contemporáneo · Arquitectura icónica',
    horarios: 'L,X-V 11:00-19:30, S 10:00-21:00, D 10:00-15:00',
    precioEstimado: '€€',
    recomendadoPorSandra: true,
    notaSandra: 'Cultura y estética en su máxima expresión. La arquitectura de Meier es tan inspiradora como las obras.',
  },
  {
    id: 'bcn-mercat-sta-caterina',
    nombre: 'Mercat de Santa Caterina',
    direccion: 'Avinguda de Francesc Cambó 16, Barcelona 08003',
    ciudad: 'Barcelona',
    latitud: 41.3855,
    longitud: 2.1789,
    tipo: 'ocio',
    descripcion: 'Mercado con historia · Productos frescos',
    horarios: 'L-S 7:30-15:30',
    precioEstimado: '€',
    recomendadoPorSandra: false,
    notaSandra: 'El techo de mosaico es una obra de arte. El ambiente es puro Barcelona auténtica.',
  },
];

// ─── Lugares preconfigurados: París ──────────────────────────────────────────

const LUGARES_PARIS_SHOPPING: Omit<LugarMapa, 'distanciaMetros' | 'tiempoMinutos'>[] = [
  {
    id: 'paris-galeries-lafayette',
    nombre: 'Galeries Lafayette Haussmann',
    direccion: '40 Bd Haussmann, 75009 Paris',
    ciudad: 'París',
    latitud: 48.8736,
    longitud: 2.3323,
    tipo: 'tienda',
    descripcion: 'El gran almacén del mundo · Todas las marcas',
    horarios: 'L-S 9:30-20:30',
    precioEstimado: '€€€€',
    recomendadoPorSandra: true,
    notaSandra: 'Imprescindible en París. La cúpula Art Nouveau es tan espectacular como la selección de moda.',
  },
  {
    id: 'paris-le-marais',
    nombre: 'Le Marais · Rue des Francs-Bourgeois',
    direccion: 'Rue des Francs-Bourgeois, 75004 Paris',
    ciudad: 'París',
    latitud: 48.8569,
    longitud: 2.3572,
    tipo: 'tienda',
    descripcion: 'Boutiques independientes · Diseñadores emergentes',
    horarios: 'L-S 10:00-19:30',
    precioEstimado: '€€€',
    recomendadoPorSandra: true,
    notaSandra: 'El barrio de moda más creativo de París. Aquí encontrarás piezas que nadie más tiene.',
  },
  {
    id: 'paris-sandro',
    nombre: 'Sandro',
    direccion: '50 Rue de Rennes, 75006 Paris',
    ciudad: 'París',
    latitud: 48.8510,
    longitud: 2.3317,
    tipo: 'tienda',
    descripcion: 'Elegancia parisina · Colecciones cuidadas',
    horarios: 'L-S 10:00-19:30',
    precioEstimado: '€€€',
    recomendadoPorSandra: true,
    notaSandra: 'La quintaesencia del estilo parisino: femenino, sofisticado y usable. Perfecta para tu fondo de armario.',
  },
  {
    id: 'paris-bon-marche',
    nombre: 'Le Bon Marché',
    direccion: '24 Rue de Sèvres, 75007 Paris',
    ciudad: 'París',
    latitud: 48.8498,
    longitud: 2.3236,
    tipo: 'tienda',
    descripcion: 'El más selecto gran almacén de París',
    horarios: 'L-S 10:00-20:00',
    precioEstimado: '€€€€',
    recomendadoPorSandra: true,
    notaSandra: 'La experiencia de compra más elegante de París. La selección de diseñadores es impecable.',
  },
  {
    id: 'paris-rouje',
    nombre: 'Rouje · Boutique',
    direccion: '15 Rue Bachaumont, 75002 Paris',
    ciudad: 'París',
    latitud: 48.8639,
    longitud: 2.3482,
    tipo: 'tienda',
    descripcion: 'El estilo parisino por excelencia',
    horarios: 'L-S 11:00-19:30',
    precioEstimado: '€€€',
    recomendadoPorSandra: false,
    notaSandra: 'La marca de Jeanne Damas: ropa vintage-chic perfecta para tu momento vital.',
  },
];

const LUGARES_PARIS_OCIO: Omit<LugarMapa, 'distanciaMetros' | 'tiempoMinutos'>[] = [
  {
    id: 'paris-cafe-de-flore',
    nombre: 'Café de Flore',
    direccion: '172 Bd Saint-Germain, 75006 Paris',
    ciudad: 'París',
    latitud: 48.8540,
    longitud: 2.3325,
    tipo: 'restaurante',
    descripcion: 'El café más icónico de París · Literatura y moda',
    horarios: 'L-D 7:00-01:30',
    precioEstimado: '€€€',
    recomendadoPorSandra: true,
    notaSandra: 'El desayuno en Café de Flore es uno de los placeres parisinos por excelencia. No te lo pierdas.',
  },
  {
    id: 'paris-musee-orsay',
    nombre: 'Musée d\'Orsay',
    direccion: '1 Rue de la Légion d\'Honneur, 75007 Paris',
    ciudad: 'París',
    latitud: 48.8600,
    longitud: 2.3266,
    tipo: 'cultura',
    descripcion: 'Impresionismo · El museo más bello de París',
    horarios: 'Ma-D 9:30-18:00',
    precioEstimado: '€€',
    recomendadoPorSandra: true,
    notaSandra: 'Renoir, Monet, Degas... La paleta impresionista te inspirará en tu propia paleta de color.',
  },
  {
    id: 'paris-palais-royal',
    nombre: 'Jardins du Palais-Royal',
    direccion: 'Place du Palais Royal, 75001 Paris',
    ciudad: 'París',
    latitud: 48.8638,
    longitud: 2.3370,
    tipo: 'ocio',
    descripcion: 'Boutiques de diseñador · Jardines históricos',
    horarios: 'L-D 7:00-21:00',
    precioEstimado: 'Gratis',
    recomendadoPorSandra: true,
    notaSandra: 'El lugar más bonito de París para pasear. Las boutiques de los soportales son joyas escondidas.',
  },
  {
    id: 'paris-lasserre',
    nombre: 'Lasserre',
    direccion: '17 Av. Franklin D. Roosevelt, 75008 Paris',
    ciudad: 'París',
    latitud: 48.8672,
    longitud: 2.3116,
    tipo: 'restaurante',
    descripcion: '2 estrellas Michelin · Clásica francesa',
    horarios: 'Ma-S 12:30-14:00, 19:30-22:00',
    precioEstimado: '€€€€',
    recomendadoPorSandra: false,
    notaSandra: 'Para una ocasión muy especial. El techo se abre en verano y es mágico.',
  },
];

// ─── Lugares preconfigurados: Londres ────────────────────────────────────────

const LUGARES_LONDRES_SHOPPING: Omit<LugarMapa, 'distanciaMetros' | 'tiempoMinutos'>[] = [
  {
    id: 'london-selfridges',
    nombre: 'Selfridges',
    direccion: '400 Oxford St, London W1A 1AB',
    ciudad: 'Londres',
    latitud: 51.5146,
    longitud: -0.1545,
    tipo: 'tienda',
    descripcion: 'El gran almacén más icónico de Londres',
    horarios: 'L-S 10:00-21:00, D 11:30-18:00',
    precioEstimado: '€€€€',
    recomendadoPorSandra: true,
    notaSandra: 'Selfridges tiene la selección de diseñadores más completa de Londres. No te pierdas la planta de moda emergente.',
  },
  {
    id: 'london-kings-road',
    nombre: "King's Road · Chelsea",
    direccion: "King's Road, London SW3",
    ciudad: 'Londres',
    latitud: 51.4875,
    longitud: -0.1680,
    tipo: 'tienda',
    descripcion: 'Boutiques exclusivas · Estilo British chic',
    horarios: 'L-S 10:00-19:00',
    precioEstimado: '€€€',
    recomendadoPorSandra: true,
    notaSandra: 'La calle de moda más elegante de Londres. Perfecta para encontrar piezas con personalidad.',
  },
  {
    id: 'london-liberty',
    nombre: 'Liberty London',
    direccion: 'Regent St, London W1B 5AH',
    ciudad: 'Londres',
    latitud: 51.5135,
    longitud: -0.1412,
    tipo: 'tienda',
    descripcion: 'Tudor revival · Tejidos únicos y moda curada',
    horarios: 'L-S 10:00-20:00, D 12:00-18:00',
    precioEstimado: '€€€€',
    recomendadoPorSandra: true,
    notaSandra: 'El edificio es una obra de arte y la selección también. Sus estampados Liberty son inconfundibles.',
  },
  {
    id: 'london-cos',
    nombre: 'COS · Regent Street',
    direccion: '222 Regent St, London W1B 5BD',
    ciudad: 'Londres',
    latitud: 51.5120,
    longitud: -0.1414,
    tipo: 'tienda',
    descripcion: 'Minimalismo europeo · Siluetas cuidadas',
    horarios: 'L-S 10:00-20:00',
    precioEstimado: '€€',
    recomendadoPorSandra: false,
    notaSandra: 'COS es el hermano mayor de H&M pero con una curaduría impecable. Básicos que duran años.',
  },
];

const LUGARES_LONDRES_OCIO: Omit<LugarMapa, 'distanciaMetros' | 'tiempoMinutos'>[] = [
  {
    id: 'london-sketch',
    nombre: 'Sketch',
    direccion: '9 Conduit St, London W1S 2XG',
    ciudad: 'Londres',
    latitud: 51.5127,
    longitud: -0.1434,
    tipo: 'restaurante',
    descripcion: 'El restaurante más instagrameable de Londres',
    horarios: 'L-D 12:00-00:00',
    precioEstimado: '€€€€',
    recomendadoPorSandra: true,
    notaSandra: 'The Gallery, con sus paredes rosas y obras de David Shrigley, es una experiencia única. ¡Reserva ya!',
  },
  {
    id: 'london-va',
    nombre: 'Victoria and Albert Museum',
    direccion: 'Cromwell Rd, London SW7 2RL',
    ciudad: 'Londres',
    latitud: 51.4966,
    longitud: -0.1722,
    tipo: 'cultura',
    descripcion: 'Moda, diseño y arte decorativo · Entrada gratuita',
    horarios: 'L-D 10:00-17:45',
    precioEstimado: 'Gratis',
    recomendadoPorSandra: true,
    notaSandra: 'El museo de moda y diseño más importante del mundo. Una visita obligada para cualquier amante del estilo.',
  },
  {
    id: 'london-portobello',
    nombre: 'Portobello Road Market',
    direccion: 'Portobello Rd, London W11',
    ciudad: 'Londres',
    latitud: 51.5155,
    longitud: -0.2044,
    tipo: 'ocio',
    descripcion: 'Vintage y antigüedades · Sábados',
    horarios: 'S 9:00-19:00',
    precioEstimado: '€€',
    recomendadoPorSandra: true,
    notaSandra: 'El mercado vintage más famoso del mundo. Los sábados hay que ir pronto para encontrar las mejores piezas.',
  },
];

// ─── Mapa de lugares por ciudad ───────────────────────────────────────────────

type LugarBase = Omit<LugarMapa, 'distanciaMetros' | 'tiempoMinutos'>;

const LUGARES_POR_CIUDAD: Record<string, { shopping: LugarBase[]; ocio: LugarBase[] }> = {
  Madrid: { shopping: LUGARES_MADRID_SHOPPING, ocio: LUGARES_MADRID_OCIO },
  Barcelona: { shopping: LUGARES_BARCELONA_SHOPPING, ocio: LUGARES_BARCELONA_OCIO },
  París: { shopping: LUGARES_PARIS_SHOPPING, ocio: LUGARES_PARIS_OCIO },
  Londres: { shopping: LUGARES_LONDRES_SHOPPING, ocio: LUGARES_LONDRES_OCIO },
};

// ─── Funciones del servicio ───────────────────────────────────────────────────

export const mapsService = {
  /**
   * Obtiene lugares de shopping recomendados para la clienta en su ciudad
   */
  async obtenerLugaresShopping(
    perfil: PerfilClienta,
    ciudad: string
  ): Promise<LugarMapa[]> {
    // Si tenemos datos preconfigurados, los usamos directamente
    const datosCiudad = LUGARES_POR_CIUDAD[ciudad];
    if (datosCiudad) {
      return datosCiudad.shopping.map((lugar) => ({
        ...lugar,
        distanciaMetros: undefined,
        tiempoMinutos: undefined,
      }));
    }

    // Si hay clave de Google, buscar con Google Places API
    if (GOOGLE_MAPS_KEY) {
      const resultados = await mapsService.buscarLugaresConAPI(ciudad, 'clothing_store', perfil.rangoPrecio);
      if (resultados.length > 0) return resultados;
    }

    // Fallback: Claude AI genera recomendaciones
    return mapsService.generarLugaresConClaude(perfil, ciudad, 'shopping');
  },

  /**
   * Obtiene lugares de ocio y gastronomía recomendados
   */
  async obtenerLugaresOcio(
    perfil: PerfilClienta,
    ciudad: string,
    tipo: 'restaurante' | 'cultura' | 'ocio'
  ): Promise<LugarMapa[]> {
    const datosCiudad = LUGARES_POR_CIUDAD[ciudad];
    if (datosCiudad) {
      if (tipo === 'restaurante') {
        return datosCiudad.ocio.filter((l) => l.tipo === 'restaurante').map((l) => ({
          ...l, distanciaMetros: undefined, tiempoMinutos: undefined,
        }));
      }
      return datosCiudad.ocio.filter((l) => l.tipo !== 'tienda').map((l) => ({
        ...l, distanciaMetros: undefined, tiempoMinutos: undefined,
      }));
    }

    if (GOOGLE_MAPS_KEY) {
      const googleType = tipo === 'restaurante' ? 'restaurant' : tipo === 'cultura' ? 'museum' : 'bar';
      const resultados = await mapsService.buscarLugaresConAPI(ciudad, googleType, perfil.rangoPrecio);
      if (resultados.length > 0) return resultados;
    }

    // Fallback: Claude AI
    return mapsService.generarLugaresConClaude(perfil, ciudad, tipo === 'restaurante' ? 'gastronomia' : tipo);
  },

  /**
   * Genera la ubicación para la sesión con Sandra
   */
  obtenerUbicacionSesionSandra(): LugarMapa {
    return {
      id: 'estudio-sandra',
      nombre: 'Estudio de Sandra Manresa',
      direccion: 'C/ Velázquez 28, 2ºD · Madrid 28001',
      ciudad: 'Madrid',
      latitud: 40.4233,
      longitud: -3.6833,
      tipo: 'sesion_sandra',
      descripcion: 'Tu sesión · Acceso por portero automático',
      horarios: 'Lunes a Viernes: 10:00 - 20:00',
      recomendadoPorSandra: true,
      notaSandra: 'Te espero en el 2ºD. El portero automático tiene mi nombre: Manresa.',
    };
  },

  /**
   * Genera una ruta de shopping optimizada
   */
  async generarRutaShopping(
    perfil: PerfilClienta,
    ciudad: string
  ): Promise<RutaShopping> {
    const lugares = await mapsService.obtenerLugaresShopping(perfil, ciudad);

    return {
      id: `ruta-${Date.now()}`,
      titulo: `Ruta de shopping · ${ciudad}`,
      ciudad,
      duracionEstimadaHoras: 3,
      presupuesto: perfil.rangoPrecio,
      lugares,
      creadaEn: new Date().toISOString(),
    };
  },

  /**
   * Búsqueda en tiempo real con Google Places API
   */
  async buscarLugaresConAPI(
    ciudad: string,
    tipo: string,
    presupuesto: RangoPrecio
  ): Promise<LugarMapa[]> {
    const coords = COORDENADAS_CIUDADES[ciudad] ?? { lat: 40.4168, lng: -3.7038 };
    const precioMax = presupuesto === 'economico' ? 1 : presupuesto === 'medio' ? 2 : presupuesto === 'medio_alto' ? 3 : 4;

    const url = new URL(`${PLACES_API_URL}/nearbysearch/json`);
    url.searchParams.set('location', `${coords.lat},${coords.lng}`);
    url.searchParams.set('radius', '2000');
    url.searchParams.set('type', tipo);
    url.searchParams.set('maxprice', precioMax.toString());
    url.searchParams.set('language', 'es');
    url.searchParams.set('key', GOOGLE_MAPS_KEY);

    try {
      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.status === 'OK') {
        return (data.results as Array<{
          place_id: string;
          name: string;
          vicinity: string;
          geometry: { location: { lat: number; lng: number } };
          rating?: number;
          price_level?: number;
          types: string[];
        }>).slice(0, 5).map((place) => ({
          id: place.place_id,
          nombre: place.name,
          direccion: place.vicinity,
          ciudad,
          latitud: place.geometry.location.lat,
          longitud: place.geometry.location.lng,
          tipo: (tipo.includes('store') ? 'tienda' : tipo.includes('restaurant') ? 'restaurante' : 'ocio') as TipoLugar,
          descripcion: `Valoración: ${place.rating ?? 'N/D'} ⭐`,
          recomendadoPorSandra: false,
        }));
      }
    } catch (error) {
      console.error('Error buscando lugares con Google Places:', error);
    }

    return [];
  },

  /**
   * Calcula distancia y tiempo entre dos puntos
   */
  async calcularRuta(
    origen: { lat: number; lng: number },
    destino: { lat: number; lng: number }
  ): Promise<{ distanciaMetros: number; tiempoMinutos: number }> {
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.set('origins', `${origen.lat},${origen.lng}`);
    url.searchParams.set('destinations', `${destino.lat},${destino.lng}`);
    url.searchParams.set('mode', 'walking');
    url.searchParams.set('language', 'es');
    url.searchParams.set('key', GOOGLE_MAPS_KEY);

    try {
      const response = await fetch(url.toString());
      const data = await response.json();
      const elemento = data.rows?.[0]?.elements?.[0];

      if (elemento?.status === 'OK') {
        return {
          distanciaMetros: elemento.distance.value,
          tiempoMinutos: Math.ceil(elemento.duration.value / 60),
        };
      }
    } catch (error) {
      console.error('Error calculando ruta:', error);
    }

    return { distanciaMetros: 0, tiempoMinutos: 0 };
  },

  /**
   * Obtiene las coordenadas de una ciudad
   */
  getCoordenadas(ciudad: string) {
    return COORDENADAS_CIUDADES[ciudad] ?? { lat: 40.4168, lng: -3.7038 };
  },

  /**
   * Genera lugares con Claude AI cuando no hay datos preconfigurados ni API de Google
   */
  async generarLugaresConClaude(
    perfil: PerfilClienta,
    ciudad: string,
    tipo: 'shopping' | 'gastronomia' | 'ocio' | 'cultura'
  ): Promise<LugarMapa[]> {
    try {
      const respuesta = await claudeService.generarRecomendacionesLugares(perfil, ciudad, tipo, false);
      const jsonMatch = respuesta.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];

      const lugares = JSON.parse(jsonMatch[0]) as Array<{
        nombre: string;
        direccion: string;
        descripcion: string;
        notaSandra: string;
        tipo: string;
      }>;

      const coords = COORDENADAS_CIUDADES[ciudad] ?? { lat: 40.4168, lng: -3.7038 };
      const tipoLugar: TipoLugar = tipo === 'shopping' ? 'tienda' : tipo === 'gastronomia' ? 'restaurante' : tipo === 'cultura' ? 'cultura' : 'ocio';

      return lugares.slice(0, 5).map((l, i) => ({
        id: `claude-${ciudad}-${tipo}-${i}`,
        nombre: l.nombre,
        direccion: l.direccion,
        ciudad,
        latitud: coords.lat + (i - 2) * 0.003,
        longitud: coords.lng + (i - 2) * 0.003,
        tipo: tipoLugar,
        descripcion: l.descripcion,
        recomendadoPorSandra: true,
        notaSandra: l.notaSandra,
      }));
    } catch (error) {
      console.error('Error generando lugares con Claude:', error);
      return [];
    }
  },
};
