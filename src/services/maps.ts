/**
 * Servicio de Mapas · Sandra Manresa
 * Google Maps + Places API para recomendaciones geolocalizadas
 */

import type { LugarMapa, TipoLugar, RutaShopping, PerfilClienta, RangoPrecio } from '../types';

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

// ─── Funciones del servicio ───────────────────────────────────────────────────

export const mapsService = {
  /**
   * Obtiene lugares de shopping recomendados para la clienta en su ciudad
   */
  async obtenerLugaresShopping(
    perfil: PerfilClienta,
    ciudad: string
  ): Promise<LugarMapa[]> {
    if (ciudad === 'Madrid') {
      return LUGARES_MADRID_SHOPPING.map((lugar) => ({
        ...lugar,
        distanciaMetros: undefined,
        tiempoMinutos: undefined,
      }));
    }

    // Para otras ciudades, buscar con Google Places API
    return mapsService.buscarLugaresConAPI(ciudad, 'clothing_store', perfil.rangoPrecio);
  },

  /**
   * Obtiene lugares de ocio y gastronomía recomendados
   */
  async obtenerLugaresOcio(
    perfil: PerfilClienta,
    ciudad: string,
    tipo: 'restaurante' | 'cultura' | 'ocio'
  ): Promise<LugarMapa[]> {
    if (ciudad === 'Madrid') {
      return LUGARES_MADRID_OCIO.filter((l) => tipo === 'restaurante' ? l.tipo === 'restaurante' : l.tipo !== 'tienda');
    }

    const googleType = tipo === 'restaurante' ? 'restaurant' : tipo === 'cultura' ? 'museum' : 'bar';
    return mapsService.buscarLugaresConAPI(ciudad, googleType, perfil.rangoPrecio);
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
};
