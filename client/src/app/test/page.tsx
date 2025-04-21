import React from 'react'
import {GoogleGenAI, FunctionCallingConfigMode} from '@google/genai';
import { async_tool_call, getTopFiveBrokersBuyingAndSellingDeclaration } from '@/lib/api';


const GEMINI_API_KEY = process.env.API_KEY||"AIzaSyC7bs1xhN_da7XkwqmCkyaI-b3iNMh3ur0";
const token = "adasdafnakjnsk"
const Test =async () => {
    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
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
        const {response: top_five_broker}=await async_tool_call({token,
          functionCall: x[0],})
  return (
 <div>
  {JSON.stringify(top_five_broker)}
 </div>
  )
}

export default Test