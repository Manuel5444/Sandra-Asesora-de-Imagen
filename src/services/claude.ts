/**
 * Servicio Claude API · Sandra Manresa
 * Incluye el SYSTEM PROMPT MAESTRO textualmente (sección 9 del documento)
 * NO MODIFICAR el system prompt — incluir en cada llamada al modelo
 */

import type { PerfilClienta, Look, Colorimetria, TipoInforme } from '../types';

const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY ?? '';
const CLAUDE_MODEL = process.env.EXPO_PUBLIC_CLAUDE_MODEL ?? 'claude-sonnet-4-6';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// ─── SYSTEM PROMPT MAESTRO — NO MODIFICAR ────────────────────────────────────
// Fuente: Sección 9 del documento de especificación v3.0
const SYSTEM_PROMPT_MAESTRO = `Eres la asistente digital de Sandra Manresa, asesora de imagen con sede en Madrid. Tu misión es ayudar a las mujeres a ser más felices a través de la moda, la belleza y su estilo de vida. Entiendes la belleza como la armonía total entre el físico, la apariencia y el estilo de vida. No eres una asesora genérica: eres una acompañante de los cambios vitales de las mujeres. Tu tono es cálido, empoderador, directo y sofisticado — como una amiga muy estilosa que te conoce de verdad. Cada respuesta debe sentirse escrita personalmente para esa mujer en ese momento de su vida. Ten siempre en cuenta: (1) momento vital actual, (2) colorimetría personal, (3) temporada del año, (4) ciudad de residencia, (5) historial previo, (6) presupuesto estimado, (7) si está en modo viaje. Cuando recomiendes lugares, da siempre la dirección exacta. Cuando recomiendes prendas, da siempre la marca y el rango de precio. Nunca digas "colores que te favorecen": di exactamente cuáles, por qué y cómo combinarlos.`;

// ─── Función base de llamada a la API ────────────────────────────────────────

async function llamarClaude(
  mensajes: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens = 1024,
  systemExtra?: string
): Promise<string> {
  const systemPrompt = systemExtra
    ? `${SYSTEM_PROMPT_MAESTRO}\n\n${systemExtra}`
    : SYSTEM_PROMPT_MAESTRO;

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: mensajes,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error API Claude: ${response.status} — ${error}`);
  }

  const data = await response.json();
  return data.content[0].text as string;
}

// ─── Construcción del contexto de clienta ────────────────────────────────────

function construirContextoClienta(perfil: PerfilClienta, modoViaje?: string): string {
  const ahora = new Date();
  const temporadas = ['invierno', 'primavera', 'verano', 'otoño'];
  const mesActual = ahora.getMonth();
  const temporada =
    mesActual < 3
      ? 'invierno'
      : mesActual < 6
        ? 'primavera'
        : mesActual < 9
          ? 'verano'
          : 'otoño';

  return `
DATOS DE LA CLIENTA:
- Nombre: ${perfil.nombre} ${perfil.apellidos}
- Edad: ${perfil.edad} años
- Ciudad: ${perfil.ciudad}, ${perfil.pais}
- Momento vital: ${perfil.momentoVital}
- Tipo de estilo: ${perfil.tipoEstilo}
- Rango de presupuesto: ${perfil.rangoPrecio}
- Temporada actual: ${temporada}
- Puntos Sandra acumulados: ${perfil.puntosSandra}
${modoViaje ? `- MODO VIAJE ACTIVO: La clienta está en ${modoViaje}` : ''}
${perfil.colorimetria ? `- Temporada de color: ${perfil.colorimetria.temporadaColor}` : ''}
${perfil.colorimetria ? `- Colores ideales: ${perfil.colorimetria.coloresIdeales.map((c) => c.nombre).join(', ')}` : ''}
${perfil.metasPersonales.length > 0 ? `- Metas personales: ${perfil.metasPersonales.join(', ')}` : ''}
  `.trim();
}

// ─── Servicios de IA ──────────────────────────────────────────────────────────

export const claudeService = {
  /**
   * Análisis de imagen personal con colorimetría
   * Analiza la foto de la clienta y genera su perfil de color completo
   */
  async analizarImagenPersonal(
    perfil: PerfilClienta,
    imagenBase64?: string
  ): Promise<Colorimetria> {
    const contexto = construirContextoClienta(perfil);

    const prompt = `
${contexto}

Realiza un análisis completo de imagen personal para esta clienta.
${imagenBase64 ? 'He adjuntado su fotografía para el análisis.' : 'Basándote en su descripción, genera una propuesta de colorimetría.'}

Responde en formato JSON con esta estructura exacta:
{
  "temporadaColor": "primavera|verano|otono|invierno",
  "subtemporada": "descripción breve de la subtemporada",
  "coloresIdeales": [
    {
      "hex": "#XXXXXX",
      "nombre": "Nombre del color",
      "descripcion": "Por qué la favorece específicamente",
      "combinaciones": ["#XXXXXX", "#XXXXXX"]
    }
  ],
  "coloresEvitar": [
    {
      "hex": "#XXXXXX",
      "nombre": "Nombre del color",
      "descripcion": "Por qué no la favorece específicamente",
      "combinaciones": []
    }
  ],
  "contrastes": "alto|medio|suave",
  "tonoPiel": "descripción del tono",
  "colorOjos": "descripción del color",
  "colorCabello": "descripción del color",
  "recomendacionesMaquillaje": {
    "base": ["producto1", "producto2"],
    "labios": ["color1", "color2"],
    "ojos": ["tecnica1", "tecnica2"],
    "coloretes": ["tono1", "tono2"],
    "consejo": "consejo personalizado de una frase"
  }
}
    `.trim();

    const respuesta = await llamarClaude([{ role: 'user', content: prompt }], 2048);

    try {
      const jsonMatch = respuesta.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return {
          ...JSON.parse(jsonMatch[0]),
          analizadoEn: new Date().toISOString(),
        } as Colorimetria;
      }
    } catch {
      console.error('Error parseando colorimetría:', respuesta);
    }

    throw new Error('No se pudo generar el análisis de colorimetría');
  },

  /**
   * Generación de looks personalizados
   * 3 looks según el armario, el evento y el tiempo
   */
  async generarLooks(
    perfil: PerfilClienta,
    ocasion: string,
    clima?: string
  ): Promise<Look[]> {
    const contexto = construirContextoClienta(perfil);

    const prompt = `
${contexto}

Ocasión: ${ocasion}
${clima ? `Clima actual: ${clima}` : ''}

Genera 3 looks completos y personalizados para esta clienta.
Cada look debe ser diferente en nivel de formalidad y propuesta de color.

Responde en JSON con este formato exacto:
[
  {
    "titulo": "Nombre del look (evocador, no genérico)",
    "ocasion": "${ocasion}",
    "descripcion": "2-3 frases describiendo el look y el efecto que consigue",
    "prendas": [
      {
        "nombre": "Nombre exacto de la prenda",
        "marca": "Marca específica recomendada",
        "precioMin": 000,
        "precioMax": 000,
        "colorHex": "#XXXXXX",
        "descripcion": "Cómo llevarla y por qué le favorece"
      }
    ]
  }
]
    `.trim();

    const respuesta = await llamarClaude([{ role: 'user', content: prompt }], 2048);

    try {
      const jsonMatch = respuesta.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const looks = JSON.parse(jsonMatch[0]) as Omit<Look, 'id' | 'creadoEn' | 'guardado'>[];
        return looks.map((look, i) => ({
          ...look,
          id: `look-${Date.now()}-${i}`,
          creadoEn: new Date().toISOString(),
          guardado: false,
        }));
      }
    } catch {
      console.error('Error parseando looks:', respuesta);
    }

    throw new Error('No se pudieron generar los looks');
  },

  /**
   * Respuesta al asistente de chat de la clienta
   */
  async responderChat(
    perfil: PerfilClienta,
    mensajeUsuaria: string,
    historial: Array<{ role: 'user' | 'assistant'; content: string }>,
    modoViaje?: string
  ): Promise<string> {
    const contexto = construirContextoClienta(perfil, modoViaje);

    const systemExtra = `
${contexto}

Responde de forma cálida, directa y personalizada. Máximo 150 palabras a menos que la pregunta requiera más detalle.
Si la clienta pregunta por lugares, incluye siempre la dirección exacta.
Si recomienda prendas, incluye marca y precio aproximado.
    `.trim();

    const mensajes = [
      ...historial.slice(-10), // Últimos 10 mensajes para contexto
      { role: 'user' as const, content: mensajeUsuaria },
    ];

    return llamarClaude(mensajes, 512, systemExtra);
  },

  /**
   * Respuesta al asistente de voz
   * Respuestas más cortas y conversacionales
   */
  async responderVoz(
    perfil: PerfilClienta,
    comandoVoz: string,
    modoViaje?: string
  ): Promise<string> {
    const contexto = construirContextoClienta(perfil, modoViaje);

    const systemExtra = `
${contexto}

Estás respondiendo a un comando de voz. La respuesta se convertirá a audio.
Sé MUY concisa: máximo 3-4 frases cortas.
Habla de forma natural y conversacional, como si fueras su amiga más estilosa.
NO uses listas con puntos. Solo texto fluido y natural.
    `.trim();

    return llamarClaude(
      [{ role: 'user', content: comandoVoz }],
      256,
      systemExtra
    );
  },

  /**
   * Generación de informes completos en PDF
   */
  async generarInforme(
    perfil: PerfilClienta,
    tipo: TipoInforme,
    historialSesiones?: string
  ): Promise<string> {
    const contexto = construirContextoClienta(perfil);

    const tiposInforme: Record<TipoInforme, string> = {
      imagen_completa: 'informe completo de imagen personal con análisis de colorimetría, siluetas, prendas recomendadas, maquillaje y estilo de vida',
      colorimetria_detallada: 'análisis detallado de colorimetría con la paleta completa de colores ideales y a evitar, combinaciones, maquillaje y ejemplos de prendas',
      plan_accion_30_dias: 'plan de acción de 30 días con objetivos semanales concretos, compras recomendadas y cambios de imagen progresivos',
      resumen_evolucion: 'resumen de la evolución de la clienta desde el inicio del acompañamiento con logros y próximos pasos',
      propuesta_servicio: 'propuesta personalizada de servicio con los planes recomendados y el plan de transformación sugerido',
      informe_seguimiento: 'informe de seguimiento mensual con avances, ajustes de estilo y recomendaciones para el próximo mes',
    };

    const descripcionTipo = tiposInforme[tipo];

    const prompt = `
${contexto}
${historialSesiones ? `\nHistorial de sesiones:\n${historialSesiones}` : ''}

Genera un ${descripcionTipo} para esta clienta.

El informe debe:
- Estar escrito en segunda persona, dirigido directamente a la clienta
- Incluir secciones claramente diferenciadas con títulos
- Ser específico y personalizado, no genérico
- Incluir recomendaciones concretas con marcas y precios donde aplique
- Tener un tono cálido y empoderador
- Finalizar con un mensaje motivador personalizado
- Estar listo para enviar por email o descargar como PDF

Formato: Markdown estructurado con encabezados, listas y énfasis.
    `.trim();

    return llamarClaude([{ role: 'user', content: prompt }], 4096);
  },

  /**
   * Consejo del día personalizado (para el home)
   * Tarjeta negra/dorada con texto breve y foto de Sandra
   */
  async generarConsejoDelDia(perfil: PerfilClienta): Promise<string> {
    const contexto = construirContextoClienta(perfil);
    const dia = new Date().toLocaleDateString('es-ES', { weekday: 'long' });

    const prompt = `
${contexto}

Es ${dia}. Genera el "Consejo del día" de Sandra para esta clienta.

El consejo debe:
- Ser muy breve: exactamente 2-3 frases
- Estar completamente personalizado a su momento vital y colorimetría
- Sonar como si Sandra lo escribiera personalmente para ella
- Ser inspirador y concreto a la vez, no vago
- Referirse al día, la temporada o su momento actual de transformación

Solo devuelve el texto del consejo, sin títulos ni formato adicional.
    `.trim();

    return llamarClaude([{ role: 'user', content: prompt }], 150);
  },

  /**
   * Recomendaciones de lugares para los mapas
   */
  async generarRecomendacionesLugares(
    perfil: PerfilClienta,
    ciudad: string,
    tipo: 'shopping' | 'gastronomia' | 'ocio' | 'cultura',
    modoViaje = false
  ): Promise<string> {
    const contexto = construirContextoClienta(perfil);

    const prompt = `
${contexto}

${modoViaje ? `La clienta está de viaje en ${ciudad}.` : `La clienta vive en ${ciudad}.`}

Genera una lista de 5 recomendaciones de ${tipo} para esta clienta en ${ciudad}.

Para cada lugar incluye:
- Nombre exacto del establecimiento
- Dirección exacta (calle, número, barrio, ciudad)
- Por qué se adapta específicamente a su estilo y momento vital
- Una nota breve y personal de Sandra (como si ella lo recomendara)

Sé específica y real. No inventes lugares que no existan.
Formato JSON:
[
  {
    "nombre": "Nombre del lugar",
    "direccion": "Dirección exacta",
    "descripcion": "Por qué es perfecto para ella",
    "notaSandra": "Nota personal de Sandra",
    "tipo": "${tipo}"
  }
]
    `.trim();

    return llamarClaude([{ role: 'user', content: prompt }], 1024);
  },
};
