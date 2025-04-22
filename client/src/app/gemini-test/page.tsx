import Container from "@/components/shared/container";
import {
  checkDividendsDeclaration,
  async_dividend_tool_call,
} from "@/lib/dividends-api";
import { FunctionCallingConfigMode, GoogleGenAI } from "@google/genai";

const page = async () => {
  const token = process.env.NEXT_PUBLIC_TOKEN;
  if (!token) throw new Error("Token is not defined");

  const config = {
    tools: [
      {
        functionDeclarations: [checkDividendsDeclaration],
      },
    ],
  };

  // Initialize the Gemini model correctly
  const genAI = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  //   console.log("ai model:", genAI);

  const userPrompt =
    "Can you check dividends for the fiscal period 2078/2079? which CashDividend only";

  const res = genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [userPrompt],
    config: {
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingConfigMode.ANY,
        },
      },
      tools: [
        {
          functionDeclarations: [checkDividendsDeclaration],
        },
      ],
    },
  });

  const data = (await res).functionCalls;

  if (!data || data.length === 0) {
    throw new Error("No function calls returned from the AI model.");
  }

  const { response: companyDividends } = await async_dividend_tool_call({
    token,
    functionCall: data[0],
  });

  return (
    <div>
      <Container>{JSON.stringify(companyDividends)}</Container>
    </div>
  );
};

export default page;
