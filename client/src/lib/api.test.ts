import {GoogleGenAI, FunctionCallingConfigMode, FunctionDeclaration, Type} from '@google/genai';

const GEMINI_API_KEY = process.env.API_KEY||"AIzaSyC7bs1xhN_da7XkwqmCkyaI-b3iNMh3ur0";

async function main() {
  try {
    const getTopFiveBrokersBuyingAndSellingDeclaration: FunctionDeclaration = {
      name: 'getTopFiveBrokersBuyingAndSelling',
      description: 'Fetches top five brokers buying and selling. Expects brokerId as input.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          brokerId: {
            type: Type.ARRAY,
            description: 'The unique identifier of the broker.',
            items: {
              type: Type.STRING,
            },
          },
        },
        required: ['brokerId'],
      },
    };

    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: 'Fetches top five brokers buying and selling.',
      config: {
        toolConfig: {
          functionCallingConfig: {
            mode: FunctionCallingConfigMode.ANY,
            allowedFunctionNames: ['getTopFiveBrokersBuyingAndSelling'],
          },
        },
        tools: [{functionDeclarations: [getTopFiveBrokersBuyingAndSellingDeclaration]}],
      },
    });

    console.log(response.functionCalls);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();