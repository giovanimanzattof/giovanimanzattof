
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { UserProfile, MealPlan, ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const mealPlanSchema = {
  type: Type.OBJECT,
  properties: {
    breakfast: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Nome do prato para o café da manhã." },
        calories: { type: Type.NUMBER, description: "Calorias estimadas." },
        description: { type: Type.STRING, description: "Descrição e porções." },
        substitutions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Opções de substituição." }
      },
      required: ["name", "calories", "description", "substitutions"]
    },
    morning_snack: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Nome do lanche da manhã." },
        calories: { type: Type.NUMBER, description: "Calorias estimadas." },
        description: { type: Type.STRING, description: "Descrição e porções." },
        substitutions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Opções de substituição." }
      },
      required: ["name", "calories", "description", "substitutions"]
    },
    lunch: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Nome do prato para o almoço." },
        calories: { type: Type.NUMBER, description: "Calorias estimadas." },
        description: { type: Type.STRING, description: "Descrição e porções." },
        substitutions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Opções de substituição." }
      },
      required: ["name", "calories", "description", "substitutions"]
    },
    afternoon_snack: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Nome do lanche da tarde." },
        calories: { type: Type.NUMBER, description: "Calorias estimadas." },
        description: { type: Type.STRING, description: "Descrição e porções." },
        substitutions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Opções de substituição." }
      },
      required: ["name", "calories", "description", "substitutions"]
    },
    dinner: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Nome do prato para o jantar." },
        calories: { type: Type.NUMBER, description: "Calorias estimadas." },
        description: { type: Type.STRING, description: "Descrição e porções." },
        substitutions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Opções de substituição." }
      },
      required: ["name", "calories", "description", "substitutions"]
    },
  },
  required: ["breakfast", "morning_snack", "lunch", "afternoon_snack", "dinner"],
};


export const generateMealPlan = async (profile: UserProfile): Promise<MealPlan> => {
  const prompt = `
    Crie um plano alimentar detalhado para um dia, em português, para o seguinte perfil de usuário:
    - Nome: ${profile.name}
    - Idade: ${profile.age}
    - Peso: ${profile.weight} kg
    - Altura: ${profile.height} cm
    - Sexo: ${profile.sex}
    - Nível de Atividade: ${profile.activityLevel}
    - Objetivo: ${profile.goal}
    - Restrições Alimentares: ${profile.dietaryRestrictions.join(', ') || 'Nenhuma'}
    - Preferências: ${profile.preferences || 'Nenhuma'}

    O plano deve incluir café da manhã, lanche da manhã, almoço, lanche da tarde e jantar.
    Para cada refeição, forneça o nome do prato, uma estimativa de calorias, a descrição das porções e pelo menos duas opções de substituições inteligentes.
    Seja criativo, saudável e equilibrado.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: mealPlanSchema,
      }
    });
    
    const mealPlan = JSON.parse(response.text);
    return mealPlan as MealPlan;

  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw new Error("Não foi possível gerar o plano alimentar. Tente novamente.");
  }
};

export const getChatResponse = async (history: ChatMessage[], newMessage: string, profile: UserProfile): Promise<string> => {
  const systemInstruction = `
    Você é a "Nutricionista IA", uma assistente de inteligência artificial especializada em nutrição e bem-estar.
    Seu tom é sempre empático, educativo e motivacional. Use frases curtas, diretas e positivas.
    Sempre se dirija ao usuário pelo nome: ${profile.name}.
    Use emojis para deixar a conversa mais leve e amigável. 🍎💪💧
    Contexto do usuário:
    - Objetivo: ${profile.goal}
    - Restrições: ${profile.dietaryRestrictions.join(', ') || 'Nenhuma'}
    Baseado no histórico da conversa e na nova mensagem, forneça uma resposta útil e encorajadora.
  `;

  const chatHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction },
    history: chatHistory
  });

  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Error getting chat response:", error);
    throw new Error("Desculpe, não consegui processar sua mensagem. Poderia tentar novamente?");
  }
};

export const analyzeLabel = async (base64Image: string, mimeType: string): Promise<string> => {
    const prompt = `
        Analise a tabela nutricional e a lista de ingredientes desta imagem de rótulo de alimento.
        Aja como um nutricionista preocupado.
        1. Resuma os pontos principais (calorias, gorduras, açúcares, sódio).
        2. Destaque quaisquer ingredientes potencialmente prejudiciais ou ultraprocessados (ex: xarope de milho rico em frutose, gorduras trans, corantes artificiais, excesso de conservantes).
        3. Dê um veredito final: "Recomendado", "Consumir com Moderação" ou "Evitar".
        Use uma linguagem simples e direta.
    `;
    
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        const textPart = { text: prompt };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing label:", error);
        throw new Error("Não foi possível analisar o rótulo. A imagem está nítida?");
    }
};
