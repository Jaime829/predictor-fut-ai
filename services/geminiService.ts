import { GoogleGenAI } from "@google/genai";
import type { Prediction } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT = `
Eres un analista experto en fútbol con dominio de estadísticas deportivas y modelado predictivo. Tu tarea es buscar información actualizada en la web sobre los partidos de fútbol más relevantes del día de hoy y los próximos 2 días para generar una predicción razonada y estructurada para cada uno.

Considera las siguientes ligas principales: Premier League (Inglaterra), LaLiga (España), Serie A (Italia), Bundesliga (Alemania), Ligue 1 (Francia), Copa Libertadores, Champions League y Europa League.

Para cada partido encontrado, analiza los siguientes factores clave:
1.  Posición actual en la tabla de su respective liga.
2.  Resultados de los últimos 5 partidos (rachas).
3.  Promedio de goles anotados y recibidos.
4.  La ventaja de jugar como local.
5.  Resultados de los enfrentamientos directos más recientes.
6.  Bajas importantes por lesión o suspensión, si la información está disponible.
7.  Busca y proporciona una URL pública y funcional para el escudo (logo) de cada equipo.

Basado en tu análisis, genera una predicción final.

Tu respuesta DEBE SER EXCLUSIVAMENTE un string JSON válido que contenga un array de objetos. No incluyas texto, explicaciones, o la palabra "json" antes o después del string JSON. El JSON debe seguir esta estructura exacta:

[
  {
    "partido": "Equipo Local vs Equipo Visitante",
    "liga": "Nombre de la Liga o Torneo",
    "fecha": "Fecha y hora del partido en formato ISO 8601 UTC (YYYY-MM-DDTHH:mm:ssZ)",
    "prediccion": "uno de ['Local', 'Empate', 'Visitante']",
    "probabilidad": {
      "local": <número entero entre 0 y 100>,
      "empate": <número entero entre 0 y 100>,
      "visitante": <número entero entre 0 y 100>
    },
    "razonamiento": "Una explicación breve y concisa de 1-2 frases que justifique la predicción.",
    "escudoLocal": "URL del escudo del equipo local",
    "escudoVisitante": "URL del escudo del equipo visitante"
  }
]

Asegúrate de que la suma de las probabilidades (local, empate, visitante) para cada partido sea exactamente 100. Genera predicciones para al menos 5-8 partidos relevantes. No devuelvas un array vacío.
`;

export async function fetchPredictions(): Promise<Prediction[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: PROMPT,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    let text = response.text;
    
    // Clean the response text to ensure it's valid JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("La IA no devolvió un JSON válido.");
    }

    text = jsonMatch[0];

    const predictions = JSON.parse(text) as Prediction[];

    // Validate and adjust probabilities to sum to 100
    const validatedPredictions = predictions.map(prediction => {
      const { local, empate, visitante } = prediction.probabilidad;
      const sum = local + empate + visitante;

      if (sum === 100) {
        return prediction;
      }
      
      // Handle case where sum is 0 to avoid division by zero, distribute evenly
      if (sum === 0) {
        return {
          ...prediction,
          probabilidad: { local: 33, empate: 34, visitante: 33 }
        };
      }
      
      const factor = 100 / sum;
      const adjustedLocal = Math.round(local * factor);
      const adjustedEmpate = Math.round(empate * factor);
      // Assign the remainder to the last one to ensure the sum is exactly 100
      const adjustedVisitante = 100 - adjustedLocal - adjustedEmpate;

      return {
        ...prediction,
        probabilidad: {
          local: adjustedLocal,
          empate: adjustedEmpate,
          visitante: adjustedVisitante,
        }
      };
    });

    return validatedPredictions;
  } catch (error) {
    console.error("Error fetching predictions from Gemini:", error);
    if (error instanceof SyntaxError) {
       throw new Error("Error al procesar la respuesta de la IA. Inténtalo de nuevo.");
    }
    throw new Error("No se pudieron obtener las predicciones. La API puede estar ocupada.");
  }
}