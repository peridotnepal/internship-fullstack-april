import React, { Suspense } from 'react';
import { GoogleGenAI, FunctionCallingConfigMode } from '@google/genai';
import { async_tool_call, getAllBrokersTopFiveDataDeclaration } from '@/lib/api';

// Add "use client" directive if this is a client component
// use client

// Loading component
function LoadingState() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      <p className="ml-3 text-gray-700">Fetching top brokers data...</p>
    </div>
  );
}

// Component to display broker summary
function BrokerSummary({ brokers }) {
  if (!brokers || !Array.isArray(brokers) || brokers.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-blue-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Selected Brokers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {brokers.map((broker, index) => (
          <div key={broker.id || index} className="bg-white p-3 rounded shadow-sm">
            <div className="font-medium">{broker.name}</div>
            <div className="text-sm text-gray-600">ID: {broker.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component to display top five brokers
function TopBrokersDisplay({ data }) {
  if (!data) {
    return <div className="p-4 text-red-500">No data available</div>;
  }
  
  // Extract data based on the structure returned by getAllBrokersTopFiveData
  const { allBrokers, topFiveData } = data;
  
  if (!Array.isArray(topFiveData) || topFiveData.length === 0) {
    return <div className="p-4 text-red-500">No broker data available</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Top 5 Buying and Selling by Brokers</h1>
      
      {/* Display summary of all brokers */}
      <BrokerSummary brokers={allBrokers} />
      
      {topFiveData.map((brokerData, index) => {
        // Handle case where broker data is not in expected format
        if (!brokerData) {
          return (
            <div key={index} className="bg-yellow-100 p-4 rounded">
              <p>No data available for broker #{index + 1}</p>
            </div>
          );
        }

        // Extract buying and selling data - each should already be top 5 from the API
        // The API returns the top 5 buying and selling transactions per broker
        const buyingData = brokerData.buying || [];
        const sellingData = brokerData.selling || [];
        
        // Get the broker details
        const brokerInfo = allBrokers && allBrokers[index];
        
        return (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-gray-100 p-4 border-b">
              <h2 className="text-xl font-bold">
                {brokerInfo ? brokerInfo.name : `Broker #${index + 1}`}
              </h2>
              {brokerInfo && (
                <p className="text-sm text-gray-600">Broker ID: {brokerInfo.id}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {/* Top 5 Buyers Section */}
              {buyingData && buyingData.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600">Top 5 Buying Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {buyingData.map((item, buyIndex) => (
                          <tr key={buyIndex} className={buyIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-2 whitespace-nowrap">{item.companyName || item.company || 'N/A'}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{item.quantity ? item.quantity.toLocaleString() : 'N/A'}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-green-600 font-medium">
                              {item.amount ? `Rs. ${item.amount.toLocaleString()}` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-gray-500">No buying data available</div>
              )}
              
              {/* Top 5 Sellers Section */}
              {sellingData && sellingData.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600">Top 5 Selling Transactions</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sellingData.map((item, sellIndex) => (
                          <tr key={sellIndex} className={sellIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-2 whitespace-nowrap">{item.companyName || item.company || 'N/A'}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{item.quantity ? item.quantity.toLocaleString() : 'N/A'}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-red-600 font-medium">
                              {item.amount ? `Rs. ${item.amount.toLocaleString()}` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-gray-500">No selling data available</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Main component for fetching data
async function TopBrokersFetcher() {
  try {
    // Get API key from environment variables
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("Missing Gemini API key");
    }
    
    // Get authentication token securely
    const token = process.env.AUTH_TOKEN || "adasdafnakjnsk"; // Replace with your actual token
    
    // Initialize Google GenAI client
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    // Use the auto-fetch function to get everything in one call
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Get top five broker buying and selling data for all brokers.',
      config: {
        toolConfig: {
          functionCallingConfig: {
            mode: FunctionCallingConfigMode.ANY,
            allowedFunctionNames: [getAllBrokersTopFiveDataDeclaration.name],
          },
        },
        tools: [
          { functionDeclarations: [getAllBrokersTopFiveDataDeclaration] },
        ],
      },
    });
    
    // Process the response
    const functionCall = response.functionCalls?.[0];
    if (!functionCall) {
      throw new Error("Failed to get broker data");
    }
    
    // Execute the function call
    const { response: result } = await async_tool_call({
      token,
      functionCall: functionCall,
    });
    
    if (!result || !result.result) {
      throw new Error("No data returned from broker API");
    }
    
    // Return the display component with the data
    return <TopBrokersDisplay data={result.result} />;
  } catch (error) {
    console.error("Failed to fetch top brokers data:", error);
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p className="font-bold">Error</p>
        <p>{error.message || "An unknown error occurred"}</p>
      </div>
    );
  }
}

const AutoFetchTopBrokersComponent = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <Suspense fallback={<LoadingState />}>
        <TopBrokersFetcher />
      </Suspense>
    </div>
  );
};

export default AutoFetchTopBrokersComponent;