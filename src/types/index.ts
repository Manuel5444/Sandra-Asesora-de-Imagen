/**
 * Tipos e interfaces globales · Sandra Manresa · Asesora de Imagen
 */

// ─── Autenticación ───────────────────────────────────────────────────────────

export type UserRole = 'clienta' | 'sandra';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// ─── Momentos vitales ────────────────────────────────────────────────────────

export type MomentoVital =
  | 'cambio_laboral'
  | 'menopausia'
  | 'nido_vacio'
  | 'separacion'
  | 'nueva_decada_40'
  | 'nueva_decada_50'
  | 'nueva_decada_60'
  | 'otro';

export const MOMENTOS_VITALES: Record<MomentoVital, { label: string; descripcion: string; emoji: string }> = {
  cambio_laboral: {
    label: 'Cambio laboral',
    descripcion: 'Nueva etapa profesional que quiero proyectar con confianza',
    emoji: '💼',
  },
  menopausia: {
    label: 'Menopausia',
    descripcion: 'Adaptando mi estilo a los cambios que vivo en mi cuerpo',
    emoji: '🌸',
  },
  nido_vacio: {
    label: 'Nido vacío',
    descripcion: 'Recuperando mi identidad más allá del rol de madre',
    emoji: '🦋',
  },
  separacion: {
    label: 'Separación · Nuevo inicio',
    descripcion: 'Reinventándome con libertad y con mi propio estilo',
    emoji: '✨',
  },
  nueva_decada_40: {
    label: 'Nueva década · 40',
    descripcion: 'Capitalizando la madurez con estilo y confianza propios',
    emoji: '4️⃣',
  },
  nueva_decada_50: {
    label: 'Nueva década · 50',
    descripcion: 'La mejor versión de mí misma en una nueva etapa',
    emoji: '5️⃣',
  },
  nueva_decada_60: {
    label: 'Nueva década · 60',
    descripcion: 'Elegancia y autenticidad en cada decisión de estilo',
    emoji: '6️⃣',
  },
  otro: {
    label: 'Otro momento',
    descripcion: 'Quiero mejorar mi imagen y sentirme mejor conmigo misma',
    emoji: '🌟',
  },
};

// ─── Perfil de clienta ───────────────────────────────────────────────────────

export type TipoEstilo =
  | 'clasico_elegante'
  | 'casual_sofisticado'
  | 'editorial_moderno'
  | 'bohemio_natural'
  | 'minimalista_limpio'
  | 'romantico_femenino';

export type RangoPrecio = 'economico' | 'medio' | 'medio_alto' | 'premium';

export interface PerfilClienta {
  id: string;
  userId: string;
  nombre: string;
  apellidos: string;
  edad: number;
  ciudad: string;
  pais: string;
  latitud?: number;
  longitud?: number;
  momentoVital: MomentoVital;
  tipoEstilo: TipoEstilo;
  rangoPrecio: RangoPrecio;
  metasPersonales: string[];
  fotoUrl?: string;
  colorimetria?: Colorimetria;
  plan: PlanSuscripcion;
  puntosSandra: number;
  logros: string[];
  creadoEn: string;
  actualizadoEn: string;
}

// ─── Colorimetría ────────────────────────────────────────────────────────────

export interface ColorPaleta {
  hex: string;
  nombre: string;
  descripcion: string;
  combinaciones: string[];
}

export interface Colorimetria {
  temporadaColor: 'primavera' | 'verano' | 'otono' | 'invierno';
  subtemporada: string;
  coloresIdeales: ColorPaleta[];
  coloresEvitar: ColorPaleta[];
  contrastes: 'alto' | 'medio' | 'suave';
  tonoPiel: string;
  colorOjos: string;
  colorCabello: string;
  recomendacionesMaquillaje: RecomendacionMaquillaje;
  analizadoEn: string;
}

export interface RecomendacionMaquillaje {
  base: string[];
  labios: string[];
  ojos: string[];
  coloretes: string[];
  consejo: string;
}

// ─── Looks y outfits ─────────────────────────────────────────────────────────

export interface Prenda {
  nombre: string;
  marca: string;
  precioMin: number;
  precioMax: number;
  urlCompra?: string;
  colorHex: string;
  descripcion: string;
}

export interface Look {
  id: string;
  titulo: string;
  ocasion: string;
  descripcion: string;
  prendas: Prenda[];
  imagenUrl?: string;
  creadoEn: string;
  guardado: boolean;
}

// ─── Mapas y ubicaciones ─────────────────────────────────────────────────────

export type TipoLugar = 'tienda' | 'restaurante' | 'ocio' | 'cultura' | 'sesion_sandra' | 'parking';

export interface LugarMapa {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  latitud: number;
  longitud: number;
  tipo: TipoLugar;
  descripcion: string;
  horarios?: string;
  precioEstimado?: string;
  etiqueta?: string;
  notaSandra?: string;
  distanciaMetros?: number;
  tiempoMinutos?: number;
  recomendadoPorSandra: boolean;
}

export interface RutaShopping {
  id: string;
  titulo: string;
  ciudad: string;
  duracionEstimadaHoras: number;
  presupuesto: RangoPrecio;
  lugares: LugarMapa[];
  creadaEn: string;
}

// ─── Sesiones y servicios ────────────────────────────────────────────────────

export type TipoSesion =
  | 'imagen_completa'
  | 'colorimetria'
  | 'armario_capsula'
  | 'shopping_personal'
  | 'videollamada'
  | 'seguimiento';

export type EstadoSesion = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

export interface Sesion {
  id: string;
  clientaId: string;
  tipo: TipoSesion;
  estado: EstadoSesion;
  fechaHora: string;
  duracionMinutos: number;
  ubicacion?: string;
  esPresencial: boolean;
  notas?: string;
  notasSandra?: string;
  valoracion?: number;
  precio: number;
  pagado: boolean;
  creadaEn: string;
}

// ─── Pipeline de ventas ──────────────────────────────────────────────────────

export type EtapaKanban =
  | 'nuevo_lead'
  | 'en_conversacion'
  | 'propuesta_enviada'
  | 'sesion_reservada'
  | 'clienta_activa'
  | 'fidelizada'
  | 'inactiva';

export const ETAPAS_KANBAN: Record<EtapaKanban, { label: string; color: string; descripcion: string }> = {
  nuevo_lead: {
    label: 'Nuevo Lead',
    color: '#F0EAE2',
    descripcion: 'Ha contactado, aún no hemos hablado',
  },
  en_conversacion: {
    label: 'En Conversación',
    color: '#E8DDD0',
    descripcion: 'Evaluando sus necesidades',
  },
  propuesta_enviada: {
    label: 'Propuesta Enviada',
    color: '#D4B896',
    descripcion: 'Ha recibido la oferta',
  },
  sesion_reservada: {
    label: 'Sesión Reservada',
    color: '#C4956A',
    descripcion: 'Pagó y reservó su sesión',
  },
  clienta_activa: {
    label: 'Clienta Activa',
    color: '#7A9E7E',
    descripcion: 'En proceso de transformación',
  },
  fidelizada: {
    label: 'Fidelizada',
    color: '#1A1410',
    descripcion: 'Plan anual activo',
  },
  inactiva: {
    label: 'Inactiva',
    color: '#888780',
    descripcion: 'Sin actividad más de 3 meses',
  },
};

// ─── Planes y suscripción ────────────────────────────────────────────────────

export type PlanSuscripcion =
  | 'basico'
  | 'premium'
  | 'transformacion_vital'
  | 'acompanamiento_anual';

export const PLANES: Record<PlanSuscripcion, { label: string; precio: number; descripcion: string }> = {
  basico: {
    label: 'Básico',
    precio: 0,
    descripcion: 'Perfil IA · Paleta de colores · 5 recomendaciones/mes',
  },
  premium: {
    label: 'Premium ★',
    precio: 97,
    descripcion: 'Todo ilimitado · Chat · Looks semanales · Comunidad · AR',
  },
  transformacion_vital: {
    label: 'Transformación Vital',
    precio: 297,
    descripcion: '1 sesión mensual + Premium completo + informe PDF',
  },
  acompanamiento_anual: {
    label: 'Acompañamiento Anual',
    precio: 247,
    descripcion: 'Sesión mensual + Premium + chat + shopping + prioridad',
  },
};

// ─── Gamificación ────────────────────────────────────────────────────────────

export interface Logro {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  puntosRecompensa: number;
  recompensa: string;
  desbloqueadoEn?: string;
  completado: boolean;
}

export const LOGROS_DISPONIBLES: Omit<Logro, 'desbloqueadoEn' | 'completado'>[] = [
  {
    id: 'primera_transformacion',
    titulo: 'Primera transformación',
    descripcion: 'Completa tu perfil y sube tu primera foto',
    icono: '⭐',
    puntosRecompensa: 100,
    recompensa: '10% descuento en primera sesión presencial',
  },
  {
    id: 'colores_descubiertos',
    titulo: 'Colores descubiertos',
    descripcion: 'Descarga tu informe de colorimetría',
    icono: '🎨',
    puntosRecompensa: 150,
    recompensa: 'Acceso a galería premium de tendencias del mes',
  },
  {
    id: 'exploradora_local',
    titulo: 'Exploradora local',
    descripcion: 'Visita 3 lugares recomendados por la app',
    icono: '🗺️',
    puntosRecompensa: 200,
    recompensa: 'Una semana gratis de plan Premium',
  },
  {
    id: 'diario_fiel',
    titulo: 'Diario fiel',
    descripcion: 'Sube foto de progreso durante 4 semanas seguidas',
    icono: '📷',
    puntosRecompensa: 300,
    recompensa: 'Videollamada gratuita de 15 min con Sandra',
  },
  {
    id: 'viajera_de_estilo',
    titulo: 'Viajera de estilo',
    descripcion: 'Activa el Modo Viaje en una nueva ciudad',
    icono: '✈️',
    puntosRecompensa: 250,
    recompensa: 'Pack especial de recomendaciones de esa ciudad',
  },
  {
    id: 'un_ano_transformacion',
    titulo: 'Un año de transformación',
    descripcion: '12 meses consecutivos activa en la app',
    icono: '🏆',
    puntosRecompensa: 1000,
    recompensa: 'Sesión de imagen completa gratis (valor 297€)',
  },
];

// ─── Post-its ────────────────────────────────────────────────────────────────

export type ColorPostit = 'urgente' | 'ideas' | 'seguimiento' | 'personal';

export interface Postit {
  id: string;
  contenido: string;
  color: ColorPostit;
  clientaId?: string;
  fechaLimite?: string;
  completado: boolean;
  creadoEn: string;
}

// ─── Métricas del negocio ────────────────────────────────────────────────────

export interface MetricasNegocio {
  clientasActivas: number;
  sesionesSemana: number;
  ingresosMes: number;
  nuevasSolicitudes: number;
  tasaConversion: number;
  tasaRetencion: number;
  satisfaccionMedia: number;
  ingresosMesAnterior: number;
  proyeccionMesSiguiente: number;
  clientasPorEtapa: Record<EtapaKanban, number>;
  clientasPorMomento: Partial<Record<MomentoVital, number>>;
}

// ─── Informe IA ──────────────────────────────────────────────────────────────

export type TipoInforme =
  | 'imagen_completa'
  | 'colorimetria_detallada'
  | 'plan_accion_30_dias'
  | 'resumen_evolucion'
  | 'propuesta_servicio'
  | 'informe_seguimiento';

export interface InformeIA {
  id: string;
  clientaId: string;
  tipo: TipoInforme;
  titulo: string;
  contenido: string;
  estado: 'borrador' | 'revisado' | 'enviado' | 'descargado';
  pdfUrl?: string;
  creadoEn: string;
  enviadoEn?: string;
}

// ─── Navegación ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  ClienteTabs: undefined;
  AdminDrawer: undefined;
};

export type OnboardingStackParamList = {
  OnboardingBienvenida: undefined;
  OnboardingMomentoVital: undefined;
  OnboardingFoto: undefined;
  OnboardingEstilo: undefined;
  OnboardingCiudad: undefined;
  OnboardingMetas: undefined;
};

export type ClienteTabsParamList = {
  Inicio: undefined;
  MiImagen: undefined;
  MisMapas: undefined;
  MiTransformacion: undefined;
  SandraClub: undefined;
};

export type AdminDrawerParamList = {
  Dashboard: undefined;
  CRM: undefined;
  CRMDetalle: { clientaId: string };
  Agenda: undefined;
  Pipeline: undefined;
  PostIts: undefined;
  InformesIA: undefined;
  Metricas: undefined;
};

// ─── Chat y mensajes ─────────────────────────────────────────────────────────

export interface Mensaje {
  id: string;
  conversacionId: string;
  rol: 'clienta' | 'sandra' | 'ia';
  contenido: string;
  tipo: 'texto' | 'imagen' | 'look' | 'mapa' | 'informe';
  leido: boolean;
  creadoEn: string;
}

// ─── Notificaciones ──────────────────────────────────────────────────────────

export type TipoNotificacion =
  | 'recordatorio_sesion'
  | 'nuevo_look'
  | 'logro_desbloqueado'
  | 'mensaje_sandra'
  | 'modo_viaje'
  | 'aniversario';

export interface Notificacion {
  id: string;
  userId: string;
  tipo: TipoNotificacion;
  titulo: string;
  cuerpo: string;
  leida: boolean;
  datos?: Record<string, unknown>;
  creadaEn: string;
}
