/**
 * Cliente Supabase · Sandra Manresa
 * Base de datos, autenticación, almacenamiento y APIs
 * RGPD: todos los datos se almacenan en servidores europeos
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  PerfilClienta,
  Sesion,
  InformeIA,
  Postit,
  Mensaje,
  Look,
  Notificacion,
  MetricasNegocio,
  EtapaKanban,
  MomentoVital,
} from '../types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ─── Autenticación ────────────────────────────────────────────────────────────

export const authService = {
  async signInWithEmail(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signUpWithEmail(email: string, password: string) {
    return supabase.auth.signUp({ email, password });
  },

  async signInWithGoogle() {
    return supabase.auth.signInWithOAuth({ provider: 'google' });
  },

  async signInWithApple() {
    return supabase.auth.signInWithOAuth({ provider: 'apple' });
  },

  async signOut() {
    return supabase.auth.signOut();
  },

  async getSession() {
    return supabase.auth.getSession();
  },

  async resetPassword(email: string) {
    return supabase.auth.resetPasswordForEmail(email);
  },

  onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// ─── Perfil de clienta ────────────────────────────────────────────────────────

export const perfilService = {
  async obtenerPerfil(userId: string): Promise<PerfilClienta | null> {
    const { data, error } = await supabase
      .from('perfiles_clientas')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error obteniendo perfil:', error);
      return null;
    }
    return data;
  },

  async crearPerfil(perfil: any) {
    // Mapeamos camelCase → snake_case antes de enviar a Supabase
    const row: Record<string, any> = {
      nombre: perfil.nombre,
      apellidos: perfil.apellidos || '',
      ciudad: perfil.ciudad || '',
      plan: perfil.plan || 'basico',
      puntos_sandra: perfil.puntosSandra ?? 0,
      logros: perfil.logros || [],
      metas_personales: perfil.metasPersonales || [],
    };
    if (perfil.userId) row.user_id = perfil.userId;
    if (perfil.edad) row.edad = perfil.edad;
    if (perfil.pais) row.pais = perfil.pais;
    if (perfil.momentoVital) row.momento_vital = perfil.momentoVital;
    if (perfil.tipoEstilo) row.tipo_estilo = perfil.tipoEstilo;
    if (perfil.rangoPrecio) row.rango_precio = perfil.rangoPrecio;
    if (perfil.fotoUrl) row.foto_url = perfil.fotoUrl;
    if (perfil.etapaKanban) row.etapa_kanban = perfil.etapaKanban;

    const { data, error } = await supabase
      .from('perfiles_clientas')
      .insert([row])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async actualizarPerfil(userId: string, cambios: Partial<PerfilClienta>) {
    const { data, error } = await supabase
      .from('perfiles_clientas')
      .update({ ...cambios, actualizado_en: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async subirFotoPerfil(userId: string, uri: string): Promise<string> {
    const filename = `${userId}/foto-perfil-${Date.now()}.jpg`;

    const response = await fetch(uri);
    const blob = await response.blob();

    const { error } = await supabase.storage
      .from('fotos-clientas')
      .upload(filename, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;

    const { data } = supabase.storage.from('fotos-clientas').getPublicUrl(filename);
    return data.publicUrl;
  },

  async obtenerTodasClientas(): Promise<PerfilClienta[]> {
    const { data, error } = await supabase
      .from('perfiles_clientas')
      .select('*')
      .order('actualizado_en', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async buscarClientas(query: string): Promise<PerfilClienta[]> {
    const { data, error } = await supabase
      .from('perfiles_clientas')
      .select('*')
      .or(`nombre.ilike.%${query}%,apellidos.ilike.%${query}%,email.ilike.%${query}%`);

    if (error) throw error;
    return data ?? [];
  },

  async filtrarPorEtapa(etapa: EtapaKanban): Promise<PerfilClienta[]> {
    const { data, error } = await supabase
      .from('perfiles_clientas')
      .select('*')
      .eq('etapa_kanban', etapa)
      .order('actualizado_en', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async filtrarPorMomento(momento: MomentoVital): Promise<PerfilClienta[]> {
    const { data, error } = await supabase
      .from('perfiles_clientas')
      .select('*')
      .eq('momento_vital', momento);

    if (error) throw error;
    return data ?? [];
  },
};

// ─── Sesiones ─────────────────────────────────────────────────────────────────

export const sesionService = {
  async obtenerSesiones(clientaId?: string): Promise<Sesion[]> {
    let query = supabase.from('sesiones').select('*').order('fecha_hora', { ascending: true });

    if (clientaId) {
      query = query.eq('clienta_id', clientaId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async obtenerSesionesSemana(): Promise<Sesion[]> {
    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 7);

    const { data, error } = await supabase
      .from('sesiones')
      .select('*')
      .gte('fecha_hora', inicio.toISOString())
      .lte('fecha_hora', fin.toISOString())
      .order('fecha_hora', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async crearSesion(sesion: Omit<Sesion, 'id' | 'creadaEn'>) {
    const { data, error } = await supabase
      .from('sesiones')
      .insert([sesion])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async actualizarSesion(id: string, cambios: Partial<Sesion>) {
    const { data, error } = await supabase
      .from('sesiones')
      .update(cambios)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ─── Informes IA ──────────────────────────────────────────────────────────────

export const informeService = {
  async obtenerInformes(clientaId?: string): Promise<InformeIA[]> {
    let query = supabase.from('informes_ia').select('*').order('creado_en', { ascending: false });

    if (clientaId) {
      query = query.eq('clienta_id', clientaId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async guardarInforme(informe: Omit<InformeIA, 'id' | 'creadoEn'>) {
    const { data, error } = await supabase
      .from('informes_ia')
      .insert([informe])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async actualizarEstado(id: string, estado: InformeIA['estado']) {
    const { data, error } = await supabase
      .from('informes_ia')
      .update({ estado })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ─── Post-its ─────────────────────────────────────────────────────────────────

export const postitService = {
  async obtenerPostits(): Promise<Postit[]> {
    const { data, error } = await supabase
      .from('postits')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async crearPostit(postit: Omit<Postit, 'id' | 'creadoEn'>) {
    // Mapeamos clientaId → clienta_id (snake_case para Supabase)
    const row: Record<string, any> = {
      contenido: postit.contenido,
      color: postit.color,
      completado: postit.completado,
    };
    if (postit.clientaId) row.clienta_id = postit.clientaId;
    if (postit.fechaLimite) row.fecha_limite = postit.fechaLimite;

    const { data, error } = await supabase
      .from('postits')
      .insert([row])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async actualizarPostit(id: string, cambios: Partial<Postit>) {
    const { data, error } = await supabase
      .from('postits')
      .update(cambios)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async eliminarPostit(id: string) {
    const { error } = await supabase.from('postits').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Looks ────────────────────────────────────────────────────────────────────

export const looksService = {
  async obtenerLooks(clientaId: string): Promise<Look[]> {
    const { data, error } = await supabase
      .from('looks')
      .select('*')
      .eq('clienta_id', clientaId)
      .order('creado_en', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async guardarLook(look: Omit<Look, 'id' | 'creadoEn'>) {
    const { data, error } = await supabase
      .from('looks')
      .insert([look])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async toggleGuardado(id: string, guardado: boolean) {
    const { error } = await supabase.from('looks').update({ guardado }).eq('id', id);
    if (error) throw error;
  },
};

// ─── Mensajes / Chat ──────────────────────────────────────────────────────────

export const chatService = {
  async obtenerMensajes(conversacionId: string): Promise<Mensaje[]> {
    const { data, error } = await supabase
      .from('mensajes')
      .select('*')
      .eq('conversacion_id', conversacionId)
      .order('creado_en', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async enviarMensaje(mensaje: Omit<Mensaje, 'id' | 'creadoEn' | 'leido'>) {
    const { data, error } = await supabase
      .from('mensajes')
      .insert([{ ...mensaje, leido: false }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  suscribirseAMensajes(conversacionId: string, callback: (mensaje: Mensaje) => void) {
    return supabase
      .channel(`mensajes:${conversacionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes',
          filter: `conversacion_id=eq.${conversacionId}`,
        },
        (payload) => callback(payload.new as Mensaje)
      )
      .subscribe();
  },
};

// ─── Métricas ─────────────────────────────────────────────────────────────────

export const metricasService = {
  async obtenerMetricasNegocio(): Promise<MetricasNegocio> {
    const { data, error } = await supabase.rpc('obtener_metricas_negocio');

    if (error) {
      console.error('Error obteniendo métricas:', error);
      // Retornar métricas vacías como fallback
      return {
        clientasActivas: 0,
        sesionesSemana: 0,
        ingresosMes: 0,
        nuevasSolicitudes: 0,
        tasaConversion: 0,
        tasaRetencion: 0,
        satisfaccionMedia: 0,
        ingresosMesAnterior: 0,
        proyeccionMesSiguiente: 0,
        clientasPorEtapa: {} as MetricasNegocio['clientasPorEtapa'],
        clientasPorMomento: {},
      };
    }

    return data;
  },
};

// ─── Notificaciones ───────────────────────────────────────────────────────────

export const notificacionService = {
  async obtenerNotificaciones(userId: string): Promise<Notificacion[]> {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('user_id', userId)
      .order('creada_en', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data ?? [];
  },

  async marcarLeida(id: string) {
    const { error } = await supabase.from('notificaciones').update({ leida: true }).eq('id', id);
    if (error) throw error;
  },
};
