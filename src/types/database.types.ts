/**
 * Tipos generados automáticamente desde Supabase
 * Proyecto: ybmlbtdusohvzahobjxe · eu-west-1 (RGPD ✓)
 * NO editar manualmente — regenerar con: npx supabase gen types typescript
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      informes_ia: {
        Row: {
          clienta_id: string
          contenido: string
          creado_en: string
          enviado_en: string | null
          estado: string
          id: string
          pdf_url: string | null
          tipo: Database["public"]["Enums"]["tipo_informe"]
          titulo: string
        }
        Insert: {
          clienta_id: string
          contenido: string
          creado_en?: string
          enviado_en?: string | null
          estado?: string
          id?: string
          pdf_url?: string | null
          tipo: Database["public"]["Enums"]["tipo_informe"]
          titulo: string
        }
        Update: {
          clienta_id?: string
          contenido?: string
          creado_en?: string
          enviado_en?: string | null
          estado?: string
          id?: string
          pdf_url?: string | null
          tipo?: Database["public"]["Enums"]["tipo_informe"]
          titulo?: string
        }
      }
      looks: {
        Row: {
          clienta_id: string
          creado_en: string
          descripcion: string
          guardado: boolean
          id: string
          imagen_url: string | null
          ocasion: string
          prendas: Json
          titulo: string
        }
        Insert: {
          clienta_id: string
          creado_en?: string
          descripcion?: string
          guardado?: boolean
          id?: string
          imagen_url?: string | null
          ocasion: string
          prendas?: Json
          titulo: string
        }
        Update: {
          clienta_id?: string
          creado_en?: string
          descripcion?: string
          guardado?: boolean
          id?: string
          imagen_url?: string | null
          ocasion?: string
          prendas?: Json
          titulo?: string
        }
      }
      mensajes: {
        Row: {
          contenido: string
          conversacion_id: string
          creado_en: string
          id: string
          leido: boolean
          rol: string
          tipo: string
        }
        Insert: {
          contenido: string
          conversacion_id: string
          creado_en?: string
          id?: string
          leido?: boolean
          rol: string
          tipo?: string
        }
        Update: {
          contenido?: string
          conversacion_id?: string
          creado_en?: string
          id?: string
          leido?: boolean
          rol?: string
          tipo?: string
        }
      }
      notificaciones: {
        Row: {
          creada_en: string
          cuerpo: string
          datos: Json | null
          id: string
          leida: boolean
          tipo: string
          titulo: string
          user_id: string
        }
        Insert: {
          creada_en?: string
          cuerpo: string
          datos?: Json | null
          id?: string
          leida?: boolean
          tipo: string
          titulo: string
          user_id: string
        }
        Update: {
          creada_en?: string
          cuerpo?: string
          datos?: Json | null
          id?: string
          leida?: boolean
          tipo?: string
          titulo?: string
          user_id?: string
        }
      }
      perfiles_clientas: {
        Row: {
          actualizado_en: string
          apellidos: string
          ciudad: string
          colorimetria: Json | null
          creado_en: string
          edad: number
          etapa_kanban: Database["public"]["Enums"]["etapa_kanban"]
          foto_url: string | null
          id: string
          latitud: number | null
          logros: string[]
          longitud: number | null
          metas_personales: string[]
          momento_vital: Database["public"]["Enums"]["momento_vital"]
          nombre: string
          notas_privadas: string | null
          pais: string
          plan: Database["public"]["Enums"]["plan_suscripcion"]
          puntos_sandra: number
          rango_precio: Database["public"]["Enums"]["rango_precio"]
          tipo_estilo: Database["public"]["Enums"]["tipo_estilo"]
          user_id: string
        }
        Insert: {
          actualizado_en?: string
          apellidos?: string
          ciudad?: string
          colorimetria?: Json | null
          creado_en?: string
          edad: number
          etapa_kanban?: Database["public"]["Enums"]["etapa_kanban"]
          foto_url?: string | null
          id?: string
          latitud?: number | null
          logros?: string[]
          longitud?: number | null
          metas_personales?: string[]
          momento_vital?: Database["public"]["Enums"]["momento_vital"]
          nombre: string
          notas_privadas?: string | null
          pais?: string
          plan?: Database["public"]["Enums"]["plan_suscripcion"]
          puntos_sandra?: number
          rango_precio?: Database["public"]["Enums"]["rango_precio"]
          tipo_estilo?: Database["public"]["Enums"]["tipo_estilo"]
          user_id: string
        }
        Update: {
          actualizado_en?: string
          apellidos?: string
          ciudad?: string
          colorimetria?: Json | null
          creado_en?: string
          edad?: number
          etapa_kanban?: Database["public"]["Enums"]["etapa_kanban"]
          foto_url?: string | null
          id?: string
          latitud?: number | null
          logros?: string[]
          longitud?: number | null
          metas_personales?: string[]
          momento_vital?: Database["public"]["Enums"]["momento_vital"]
          nombre?: string
          notas_privadas?: string | null
          pais?: string
          plan?: Database["public"]["Enums"]["plan_suscripcion"]
          puntos_sandra?: number
          rango_precio?: Database["public"]["Enums"]["rango_precio"]
          tipo_estilo?: Database["public"]["Enums"]["tipo_estilo"]
          user_id?: string
        }
      }
      postits: {
        Row: {
          clienta_id: string | null
          color: Database["public"]["Enums"]["color_postit"]
          completado: boolean
          contenido: string
          creado_en: string
          fecha_limite: string | null
          id: string
        }
        Insert: {
          clienta_id?: string | null
          color?: Database["public"]["Enums"]["color_postit"]
          completado?: boolean
          contenido: string
          creado_en?: string
          fecha_limite?: string | null
          id?: string
        }
        Update: {
          clienta_id?: string | null
          color?: Database["public"]["Enums"]["color_postit"]
          completado?: boolean
          contenido?: string
          creado_en?: string
          fecha_limite?: string | null
          id?: string
        }
      }
      sesiones: {
        Row: {
          clienta_id: string
          creada_en: string
          duracion_minutos: number
          es_presencial: boolean
          estado: Database["public"]["Enums"]["estado_sesion"]
          fecha_hora: string
          id: string
          notas: string | null
          notas_sandra: string | null
          pagado: boolean
          precio: number
          tipo: Database["public"]["Enums"]["tipo_sesion"]
          ubicacion: string | null
          valoracion: number | null
        }
        Insert: {
          clienta_id: string
          creada_en?: string
          duracion_minutos?: number
          es_presencial?: boolean
          estado?: Database["public"]["Enums"]["estado_sesion"]
          fecha_hora: string
          id?: string
          notas?: string | null
          notas_sandra?: string | null
          pagado?: boolean
          precio?: number
          tipo: Database["public"]["Enums"]["tipo_sesion"]
          ubicacion?: string | null
          valoracion?: number | null
        }
        Update: {
          clienta_id?: string
          creada_en?: string
          duracion_minutos?: number
          es_presencial?: boolean
          estado?: Database["public"]["Enums"]["estado_sesion"]
          fecha_hora?: string
          id?: string
          notas?: string | null
          notas_sandra?: string | null
          pagado?: boolean
          precio?: number
          tipo?: Database["public"]["Enums"]["tipo_sesion"]
          ubicacion?: string | null
          valoracion?: number | null
        }
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      obtener_metricas_negocio: { Args: Record<never, never>; Returns: Json }
    }
    Enums: {
      color_postit: "urgente" | "ideas" | "seguimiento" | "personal"
      estado_sesion: "pendiente" | "confirmada" | "completada" | "cancelada"
      etapa_kanban:
        | "nuevo_lead"
        | "en_conversacion"
        | "propuesta_enviada"
        | "sesion_reservada"
        | "clienta_activa"
        | "fidelizada"
        | "inactiva"
      momento_vital:
        | "cambio_laboral"
        | "menopausia"
        | "nido_vacio"
        | "separacion"
        | "nueva_decada_40"
        | "nueva_decada_50"
        | "nueva_decada_60"
        | "otro"
      plan_suscripcion:
        | "basico"
        | "premium"
        | "transformacion_vital"
        | "acompanamiento_anual"
      rango_precio: "economico" | "medio" | "medio_alto" | "premium"
      temporada_color: "primavera" | "verano" | "otono" | "invierno"
      tipo_estilo:
        | "clasico_elegante"
        | "casual_sofisticado"
        | "editorial_moderno"
        | "bohemio_natural"
        | "minimalista_limpio"
        | "romantico_femenino"
      tipo_informe:
        | "imagen_completa"
        | "colorimetria_detallada"
        | "plan_accion_30_dias"
        | "resumen_evolucion"
        | "propuesta_servicio"
        | "informe_seguimiento"
      tipo_sesion:
        | "imagen_completa"
        | "colorimetria"
        | "armario_capsula"
        | "shopping_personal"
        | "videollamada"
        | "seguimiento"
    }
  }
}
