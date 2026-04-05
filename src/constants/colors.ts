/**
 * Paleta de color oficial · Sandra Manresa · Asesora de Imagen
 * REGLA DE ORO: Nunca usar blanco frío como fondo. Siempre crema cálido.
 * La app debe sentirse como una boutique mediterránea de lujo accesible.
 */

export const Colors = {
  // Paleta principal de marca
  negrocacao: '#1A1410',    // Fondo oscuro, textos sobre fondo claro
  doradoarena: '#D4B896',   // Acentos dorados, elementos premium
  camel: '#C4956A',         // Botones, CTA, elementos activos
  cremacalida: '#FAF8F5',   // Fondo principal (NUNCA blanco frío)
  lino: '#F0EAE2',          // Fondo secundario, tarjetas
  piedra: '#888780',        // Textos secundarios, iconos inactivos

  // Variantes funcionales
  primary: '#C4956A',       // Camel — color de acción principal
  secondary: '#D4B896',     // Dorado arena — color de acento
  background: '#FAF8F5',    // Crema cálida — fondo de la app
  surface: '#F0EAE2',       // Lino — fondo de tarjetas
  text: '#1A1410',          // Negro cacao — texto principal
  textSecondary: '#888780', // Piedra — texto secundario
  textLight: '#FAF8F5',     // Crema — texto sobre fondo oscuro

  // Colores de estado
  success: '#7A9E7E',       // Verde musgo apagado
  warning: '#D4A843',       // Ámbar cálido
  error: '#C4614A',         // Terracota
  info: '#7A96B4',          // Azul polvoriento

  // Paleta de momentos vitales (para etiquetas de clientas)
  momentoCambioLaboral: '#C4956A',
  momentoMenopausia: '#D4B896',
  momentoNidoVacio: '#888780',
  momentoSeparacion: '#C4614A',
  momentoNuevaDecada: '#1A1410',

  // Colores del sistema Kanban
  kanbanNuevoLead: '#F0EAE2',
  kanbanEnConversacion: '#E8DDD0',
  kanbanPropuesta: '#D4B896',
  kanbanReservada: '#C4956A',
  kanbanActiva: '#7A9E7E',
  kanbanFidelizada: '#1A1410',
  kanbanInactiva: '#888780',

  // Colores de post-its
  postitUrgente: '#E8C5A0',
  postitIdeas: '#C8DFB8',
  postitSeguimiento: '#B8CDE8',
  postitPersonal: '#E8D4B8',

  // Transparencias sobre negro cacao
  overlay: 'rgba(26, 20, 16, 0.5)',
  overlayLight: 'rgba(26, 20, 16, 0.15)',
  overlayDark: 'rgba(26, 20, 16, 0.8)',

  // Gradientes (como arrays para LinearGradient)
  gradientPrimary: ['#C4956A', '#D4B896'] as const,
  gradientDark: ['#1A1410', '#2A2018'] as const,
  gradientLight: ['#FAF8F5', '#F0EAE2'] as const,
  gradientGold: ['#D4B896', '#C4956A', '#B8855A'] as const,
} as const;

export type ColorKey = keyof typeof Colors;
