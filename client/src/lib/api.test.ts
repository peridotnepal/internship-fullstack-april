import {GoogleGenAI, FunctionCallingConfigMode, FunctionDeclaration, Type} from '@google/genai';
import { async_tool_call, getTopFiveBrokersBuyingAndSellingDeclaration } from './api';

const GEMINI_API_KEY = process.env.API_KEY||"AIzaSyC7bs1xhN_da7XkwqmCkyaI-b3iNMh3ur0";
const token = "adasdafnakjnsk"

async function main() {
  try {


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

    const x= await response.functionCalls;
    if(!x || x.length==0) throw new Error("No function calls found");
    const {response: top_five_Broker}=await async_tool_call({token,
      functionCall: x[0],})
      console.log(top_five_Broker);
  } catch (error) {
    console.error('Error:', error);
  }
};


main();