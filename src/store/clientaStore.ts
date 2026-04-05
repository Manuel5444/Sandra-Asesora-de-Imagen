/**
 * Store de la clienta · Zustand
 * Gestiona el perfil, looks, colorimetría y gamificación
 */

import { create } from 'zustand';
import type {
  PerfilClienta,
  Look,
  Colorimetria,
  Logro,
  Mensaje,
  Notificacion,
  MomentoVital,
  TipoEstilo,
  RangoPrecio,
} from '../types';
import { LOGROS_DISPONIBLES } from '../types';
import { perfilService, looksService, chatService, notificacionService } from '../services/supabase';
import { claudeService } from '../services/claude';

interface ClientaState {
  perfil: PerfilClienta | null;
  looks: Look[];
  mensajes: Mensaje[];
  notificaciones: Notificacion[];
  logros: Logro[];
  consejoDelDia: string | null;
  modoViaje: string | null;
  cargandoPerfil: boolean;
  cargandoLooks: boolean;
  cargandoChat: boolean;
  error: string | null;

  // Acciones de perfil
  cargarPerfil: (userId: string) => Promise<void>;
  actualizarPerfil: (cambios: Partial<PerfilClienta>) => Promise<void>;
  subirFoto: (uri: string) => Promise<void>;

  // Acciones de looks
  cargarLooks: () => Promise<void>;
  generarNuevosLooks: (ocasion: string, clima?: string) => Promise<void>;
  toggleGuardarLook: (lookId: string) => void;

  // Acciones de chat IA
  cargarMensajes: (conversacionId: string) => Promise<void>;
  enviarMensaje: (contenido: string, conversacionId: string) => Promise<void>;

  // Gamificación
  verificarLogros: () => void;
  agregarPuntos: (puntos: number) => void;

  // Consejo del día
  cargarConsejoDelDia: () => Promise<void>;

  // Modo viaje
  activarModoViaje: (ciudad: string) => void;
  desactivarModoViaje: () => void;

  // Notificaciones
  cargarNotificaciones: (userId: string) => Promise<void>;
  marcarNotificacionLeida: (id: string) => void;

  limpiarError: () => void;
}

export const useClientaStore = create<ClientaState>((set, get) => ({
  perfil: null,
  looks: [],
  mensajes: [],
  notificaciones: [],
  logros: LOGROS_DISPONIBLES.map((logro) => ({
    ...logro,
    completado: false,
  })),
  consejoDelDia: null,
  modoViaje: null,
  cargandoPerfil: false,
  cargandoLooks: false,
  cargandoChat: false,
  error: null,

  // ─── Perfil ───────────────────────────────────────────────────────────────

  cargarPerfil: async (userId) => {
    set({ cargandoPerfil: true, error: null });
    try {
      const perfil = await perfilService.obtenerPerfil(userId);
      set({ perfil, cargandoPerfil: false });

      if (perfil) {
        get().cargarConsejoDelDia();
        get().verificarLogros();
      }
    } catch {
      set({ error: 'Error cargando el perfil', cargandoPerfil: false });
    }
  },

  actualizarPerfil: async (cambios) => {
    const { perfil } = get();
    if (!perfil) return;

    set({ cargandoPerfil: true });
    try {
      await perfilService.actualizarPerfil(perfil.userId, cambios);
      set({ perfil: { ...perfil, ...cambios }, cargandoPerfil: false });
    } catch {
      set({ error: 'Error actualizando el perfil', cargandoPerfil: false });
    }
  },

  subirFoto: async (uri) => {
    const { perfil } = get();
    if (!perfil) return;

    try {
      const fotoUrl = await perfilService.subirFotoPerfil(perfil.userId, uri);
      await get().actualizarPerfil({ fotoUrl });
    } catch {
      set({ error: 'Error subiendo la foto' });
    }
  },

  // ─── Looks ────────────────────────────────────────────────────────────────

  cargarLooks: async () => {
    const { perfil } = get();
    if (!perfil) return;

    set({ cargandoLooks: true });
    try {
      const looks = await looksService.obtenerLooks(perfil.id);
      set({ looks, cargandoLooks: false });
    } catch {
      set({ error: 'Error cargando los looks', cargandoLooks: false });
    }
  },

  generarNuevosLooks: async (ocasion, clima) => {
    const { perfil } = get();
    if (!perfil) return;

    set({ cargandoLooks: true });
    try {
      const nuevosLooks = await claudeService.generarLooks(perfil, ocasion, clima);
      set((state) => ({
        looks: [...nuevosLooks, ...state.looks],
        cargandoLooks: false,
      }));
    } catch {
      set({ error: 'Error generando looks', cargandoLooks: false });
    }
  },

  toggleGuardarLook: (lookId) => {
    set((state) => ({
      looks: state.looks.map((look) =>
        look.id === lookId ? { ...look, guardado: !look.guardado } : look
      ),
    }));
    const look = get().looks.find((l) => l.id === lookId);
    if (look) {
      looksService.toggleGuardado(lookId, !look.guardado).catch(console.error);
    }
  },

  // ─── Chat ─────────────────────────────────────────────────────────────────

  cargarMensajes: async (conversacionId) => {
    set({ cargandoChat: true });
    try {
      const mensajes = await chatService.obtenerMensajes(conversacionId);
      set({ mensajes, cargandoChat: false });
    } catch {
      set({ error: 'Error cargando mensajes', cargandoChat: false });
    }
  },

  enviarMensaje: async (contenido, conversacionId) => {
    const { perfil, mensajes } = get();
    if (!perfil) return;

    // Mensaje optimista
    const mensajeTemp: Mensaje = {
      id: `temp-${Date.now()}`,
      conversacionId,
      rol: 'clienta',
      contenido,
      tipo: 'texto',
      leido: false,
      creadoEn: new Date().toISOString(),
    };

    set({ mensajes: [...mensajes, mensajeTemp] });

    try {
      // Guardar en Supabase
      await chatService.enviarMensaje({
        conversacionId,
        rol: 'clienta',
        contenido,
        tipo: 'texto',
      });

      // Generar respuesta de IA
      const historial = mensajes.slice(-10).map((m) => ({
        role: m.rol === 'clienta' ? 'user' as const : 'assistant' as const,
        content: m.contenido,
      }));

      const respuestaIA = await claudeService.responderChat(
        perfil,
        contenido,
        historial,
        get().modoViaje ?? undefined
      );

      const mensajeIA: Mensaje = {
        id: `ia-${Date.now()}`,
        conversacionId,
        rol: 'ia',
        contenido: respuestaIA,
        tipo: 'texto',
        leido: false,
        creadoEn: new Date().toISOString(),
      };

      set((state) => ({ mensajes: [...state.mensajes, mensajeIA] }));

      await chatService.enviarMensaje({
        conversacionId,
        rol: 'ia',
        contenido: respuestaIA,
        tipo: 'texto',
      });
    } catch {
      set({ error: 'Error enviando mensaje' });
    }
  },

  // ─── Gamificación ─────────────────────────────────────────────────────────

  verificarLogros: () => {
    const { perfil, logros } = get();
    if (!perfil) return;

    const logrosActualizados = logros.map((logro) => {
      if (logro.completado) return logro;

      switch (logro.id) {
        case 'primera_transformacion':
          return {
            ...logro,
            completado: !!perfil.fotoUrl && !!perfil.colorimetria,
            desbloqueadoEn: !!perfil.fotoUrl && !!perfil.colorimetria ? new Date().toISOString() : undefined,
          };
        case 'colores_descubiertos':
          return {
            ...logro,
            completado: !!perfil.colorimetria,
            desbloqueadoEn: !!perfil.colorimetria ? new Date().toISOString() : undefined,
          };
        default:
          return logro;
      }
    });

    set({ logros: logrosActualizados });
  },

  agregarPuntos: (puntos) => {
    const { perfil } = get();
    if (!perfil) return;

    const nuevosPuntos = perfil.puntosSandra + puntos;
    get().actualizarPerfil({ puntosSandra: nuevosPuntos });
  },

  // ─── Consejo del día ──────────────────────────────────────────────────────

  cargarConsejoDelDia: async () => {
    const { perfil } = get();
    if (!perfil) return;

    try {
      const consejo = await claudeService.generarConsejoDelDia(perfil);
      set({ consejoDelDia: consejo });
    } catch {
      set({ consejoDelDia: 'Hoy es un gran día para descubrir un nuevo color que te haga brillar.' });
    }
  },

  // ─── Modo viaje ───────────────────────────────────────────────────────────

  activarModoViaje: (ciudad) => set({ modoViaje: ciudad }),
  desactivarModoViaje: () => set({ modoViaje: null }),

  // ─── Notificaciones ───────────────────────────────────────────────────────

  cargarNotificaciones: async (userId) => {
    try {
      const notificaciones = await notificacionService.obtenerNotificaciones(userId);
      set({ notificaciones });
    } catch {
      console.error('Error cargando notificaciones');
    }
  },

  marcarNotificacionLeida: (id) => {
    set((state) => ({
      notificaciones: state.notificaciones.map((n) =>
        n.id === id ? { ...n, leida: true } : n
      ),
    }));
    notificacionService.marcarLeida(id).catch(console.error);
  },

  limpiarError: () => set({ error: null }),
}));
