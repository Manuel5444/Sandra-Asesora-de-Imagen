/**
 * Store de administración · Sandra
 * Gestiona CRM, agenda, pipeline, post-its y métricas
 */

import { create } from 'zustand';
import type {
  PerfilClienta,
  Sesion,
  Postit,
  InformeIA,
  MetricasNegocio,
  EtapaKanban,
  TipoInforme,
  ColorPostit,
} from '../types';
import {
  perfilService,
  sesionService,
  postitService,
  informeService,
  metricasService,
} from '../services/supabase';
import { claudeService } from '../services/claude';

interface AdminState {
  clientas: PerfilClienta[];
  clientaSeleccionada: PerfilClienta | null;
  sesiones: Sesion[];
  postits: Postit[];
  informes: InformeIA[];
  metricas: MetricasNegocio | null;
  busquedaCRM: string;
  filtroEtapa: EtapaKanban | null;
  cargando: boolean;
  generandoInforme: boolean;
  error: string | null;

  // Acciones CRM
  cargarClientas: () => Promise<void>;
  seleccionarClienta: (clienta: PerfilClienta | null) => void;
  actualizarEtapaKanban: (clientaId: string, etapa: EtapaKanban) => Promise<void>;
  buscarClientas: (query: string) => Promise<void>;
  filtrarPorEtapa: (etapa: EtapaKanban | null) => void;

  // Acciones agenda
  cargarSesiones: () => Promise<void>;
  crearSesion: (sesion: Omit<Sesion, 'id' | 'creadaEn'>) => Promise<void>;
  actualizarSesion: (id: string, cambios: Partial<Sesion>) => Promise<void>;

  // Acciones post-its
  cargarPostits: () => Promise<void>;
  crearPostit: (contenido: string, color: ColorPostit, clientaId?: string) => Promise<void>;
  actualizarPostit: (id: string, cambios: Partial<Postit>) => Promise<void>;
  eliminarPostit: (id: string) => Promise<void>;
  toggleCompletarPostit: (id: string) => Promise<void>;

  // Acciones informes IA
  cargarInformes: (clientaId?: string) => Promise<void>;
  generarInforme: (clientaId: string, tipo: TipoInforme) => Promise<void>;
  actualizarEstadoInforme: (id: string, estado: InformeIA['estado']) => Promise<void>;

  // Métricas
  cargarMetricas: () => Promise<void>;

  limpiarError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  clientas: [],
  clientaSeleccionada: null,
  sesiones: [],
  postits: [],
  informes: [],
  metricas: null,
  busquedaCRM: '',
  filtroEtapa: null,
  cargando: false,
  generandoInforme: false,
  error: null,

  // ─── CRM ──────────────────────────────────────────────────────────────────

  cargarClientas: async () => {
    set({ cargando: true, error: null });
    try {
      const clientas = await perfilService.obtenerTodasClientas();
      set({ clientas, cargando: false });
    } catch {
      set({ error: 'Error cargando las clientas', cargando: false });
    }
  },

  seleccionarClienta: (clienta) => set({ clientaSeleccionada: clienta }),

  actualizarEtapaKanban: async (clientaId, etapa) => {
    try {
      await perfilService.actualizarPerfil(clientaId, { momentoVital: etapa as never });
      set((state) => ({
        clientas: state.clientas.map((c) =>
          c.id === clientaId ? { ...c, etapaKanban: etapa } : c
        ),
      }));
    } catch {
      set({ error: 'Error actualizando etapa' });
    }
  },

  buscarClientas: async (query) => {
    set({ busquedaCRM: query, cargando: true });
    try {
      if (!query.trim()) {
        const clientas = await perfilService.obtenerTodasClientas();
        set({ clientas, cargando: false });
      } else {
        const clientas = await perfilService.buscarClientas(query);
        set({ clientas, cargando: false });
      }
    } catch {
      set({ error: 'Error en la búsqueda', cargando: false });
    }
  },

  filtrarPorEtapa: (etapa) => set({ filtroEtapa: etapa }),

  // ─── Agenda ───────────────────────────────────────────────────────────────

  cargarSesiones: async () => {
    set({ cargando: true });
    try {
      const sesiones = await sesionService.obtenerSesiones();
      set({ sesiones, cargando: false });
    } catch {
      set({ error: 'Error cargando sesiones', cargando: false });
    }
  },

  crearSesion: async (sesion) => {
    try {
      const nueva = await sesionService.crearSesion(sesion);
      set((state) => ({ sesiones: [nueva, ...state.sesiones] }));
    } catch {
      set({ error: 'Error creando sesión' });
    }
  },

  actualizarSesion: async (id, cambios) => {
    try {
      const actualizada = await sesionService.actualizarSesion(id, cambios);
      set((state) => ({
        sesiones: state.sesiones.map((s) => (s.id === id ? actualizada : s)),
      }));
    } catch {
      set({ error: 'Error actualizando sesión' });
    }
  },

  // ─── Post-its ─────────────────────────────────────────────────────────────

  cargarPostits: async () => {
    try {
      const postits = await postitService.obtenerPostits();
      set({ postits });
    } catch {
      set({ error: 'Error cargando post-its' });
    }
  },

  crearPostit: async (contenido, color, clientaId) => {
    try {
      const nuevo = await postitService.crearPostit({
        contenido,
        color,
        clientaId,
        completado: false,
      });
      set((state) => ({ postits: [nuevo, ...state.postits] }));
    } catch {
      set({ error: 'Error creando post-it' });
    }
  },

  actualizarPostit: async (id, cambios) => {
    try {
      const actualizado = await postitService.actualizarPostit(id, cambios);
      set((state) => ({
        postits: state.postits.map((p) => (p.id === id ? actualizado : p)),
      }));
    } catch {
      set({ error: 'Error actualizando post-it' });
    }
  },

  eliminarPostit: async (id) => {
    try {
      await postitService.eliminarPostit(id);
      set((state) => ({ postits: state.postits.filter((p) => p.id !== id) }));
    } catch {
      set({ error: 'Error eliminando post-it' });
    }
  },

  toggleCompletarPostit: async (id) => {
    const postit = get().postits.find((p) => p.id === id);
    if (!postit) return;
    await get().actualizarPostit(id, { completado: !postit.completado });
  },

  // ─── Informes IA ──────────────────────────────────────────────────────────

  cargarInformes: async (clientaId) => {
    try {
      const informes = await informeService.obtenerInformes(clientaId);
      set({ informes });
    } catch {
      set({ error: 'Error cargando informes' });
    }
  },

  generarInforme: async (clientaId, tipo) => {
    const { clientas } = get();
    const clienta = clientas.find((c) => c.id === clientaId);
    if (!clienta) return;

    set({ generandoInforme: true });
    try {
      const contenido = await claudeService.generarInforme(clienta, tipo);

      const titulos: Record<TipoInforme, string> = {
        imagen_completa: `Informe de Imagen Completa · ${clienta.nombre}`,
        colorimetria_detallada: `Análisis de Colorimetría · ${clienta.nombre}`,
        plan_accion_30_dias: `Plan de Acción 30 Días · ${clienta.nombre}`,
        resumen_evolucion: `Resumen de Evolución · ${clienta.nombre}`,
        propuesta_servicio: `Propuesta de Servicio · ${clienta.nombre}`,
        informe_seguimiento: `Informe de Seguimiento · ${clienta.nombre}`,
      };

      const nuevoInforme = await informeService.guardarInforme({
        clientaId,
        tipo,
        titulo: titulos[tipo],
        contenido,
        estado: 'borrador',
      });

      set((state) => ({
        informes: [nuevoInforme, ...state.informes],
        generandoInforme: false,
      }));
    } catch {
      set({ error: 'Error generando informe', generandoInforme: false });
    }
  },

  actualizarEstadoInforme: async (id, estado) => {
    try {
      const actualizado = await informeService.actualizarEstado(id, estado);
      set((state) => ({
        informes: state.informes.map((i) => (i.id === id ? actualizado : i)),
      }));
    } catch {
      set({ error: 'Error actualizando estado del informe' });
    }
  },

  // ─── Métricas ─────────────────────────────────────────────────────────────

  cargarMetricas: async () => {
    try {
      const metricas = await metricasService.obtenerMetricasNegocio();
      set({ metricas });
    } catch {
      set({ error: 'Error cargando métricas' });
    }
  },

  limpiarError: () => set({ error: null }),
}));
