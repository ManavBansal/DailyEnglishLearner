import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse, LearningItem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    dailyLesson: {
      type: Type.ARRAY,
      description: 'A list of words and sentences for learning English.',
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            description: 'The type of item, either "word" or "sentence".',
            enum: ['word', 'sentence'],
          },
          english: {
            type: Type.STRING,
            description: 'The word or sentence in English.'
          },
          hindi: {
            type: Type.STRING,
            description: 'The Hindi translation of the English text.'
          }
        },
        required: ['type', 'english', 'hindi']
      }
    }
  },
  required: ['dailyLesson']
};

const getDifficultyDescription = (level: number): string => {
    const difficulties = [
        "Absolute beginner. Focus on 1-2 word greetings and essential nouns (e.g., Hello, Thank you, Water, Food).", // Level 1
        "Basic vocabulary. Introduce simple verbs and adjectives (e.g., Go, Eat, Good, Big) and 2-3 word phrases (e.g., 'My name is...').", // Level 2
        "Forming simple sentences. Focus on Subject-Verb-Object structure in the present tense (e.g., 'I eat rice.').", // Level 3
        "Asking simple questions. Introduce 'What', 'Where', 'Who' (e.g., 'What is your name?', 'Where is the market?').", // Level 4
        "Using 'is/am/are'. Sentences describing states and ongoing actions (e.g., 'He is a doctor.', 'They are walking.').", // Level 5
        "Slightly more complex sentences. Introduce prepositions like 'in', 'on', 'at' (e.g., 'The book is on the table.').", // Level 6
        "Talking about possession. Use of 'have'/'has' (e.g., 'I have a pen.', 'She has a car.').", // Level 7
        "Simple past tense. Introduce regular verbs with '-ed' (e.g., 'He walked to the shop.').", // Level 8
        "Simple future tense. Using 'will' (e.g., 'I will call you tomorrow.').", // Level 9
        "Confident beginner. Combining simple sentences and using common irregular past tense verbs (e.g., 'I went to the market and bought vegetables.')." // Level 10
    ];
    return difficulties[Math.min(level - 1, difficulties.length - 1)];
};


export async function getDailyLesson(level: number): Promise<LearningItem[]> {
  const difficulty = getDifficultyDescription(level);
  const prompt = `Generate a list of 20 English learning items for a senior citizen from India who is a native Hindi speaker.
The user is at Level ${level}/10.
The difficulty for this level is: "${difficulty}".
Include 10 common, practical words and 10 simple, practical sentences.
Ensure a very gradual increase in complexity from level to level. The content must be useful for daily conversations.
IMPORTANT: The set of words and sentences you provide must be unique and different from any set you might have generated for this level before.
Provide the English and its Hindi translation for each item.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse: GeminiResponse = JSON.parse(jsonText);
    
    if (parsedResponse && Array.isArray(parsedResponse.dailyLesson)) {
        return parsedResponse.dailyLesson;
    } else {
        throw new Error("Invalid response structure from Gemini API.");
    }

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw new Error("Failed to generate or parse the daily lesson.");
  }
}