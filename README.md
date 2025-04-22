# Broker Analysis Tool

A React-based tool for analyzing broker buying and selling activities using the Gemini AI API.

## Overview

This project provides a comprehensive view of broker activities in the stock market, focusing on the top 5 buying and selling transactions for each broker and their brokers details 

## Features

- Fetch all available brokers from the system
- Get detailed information about specific brokers
- Display top five buying and selling transactions for each broker


## File Structure
-`src/lib/api.ts`: Contains the API functions for fetching data from the Gemini AI API.
-`src/lib/axios.ts`: Configures the Axios instance for making API requests.
-`src/app/page.tsx`: The main component that fetches and displays broker data.

## API Functions

The tool uses the following API functions:

### `getAllBrokers({ token })`

Fetches a list of all brokers available in the system.

**Parameters:**
- `token` (string): Authentication token

**Returns:** Array of broker objects

### `getBrokerDetails({ token }, { brokerId })`

Fetches detailed information about a specific broker.

**Parameters:**
- `token` (string): Authentication token
- `brokerId` (string): Unique identifier for the broker

**Returns:** Broker detail object

### `getTopFiveBrokersBuyingAndSellingForAll(brokerIds, token)`

Fetches the top five buying and selling transactions for a list of broker IDs.

**Parameters:**
- `brokerIds` (string[]): Array of broker IDs
- `token` (string): Authentication token

**Returns:** Array of broker data with buying and selling information

### `getAllBrokersTopFiveData({ token })`

Fetches all brokers and their top five buying and selling transactions in one call.

**Parameters:**
- `token` (string): Authentication token

**Returns:** Object containing `allBrokers` and `topFiveData`

## Function Declarations

These declarations are used for Gemini AI function calling:

- `getAllBrokersDeclaration`
- `getBrokerDetailsDeclaration`
- `getTopFiveBrokersBuyingAndSellingDeclaration`
- `getAllBrokersTopFiveDataDeclaration`

## Main Component

`src/app/test/page.tsx` is a React component that:

1. Fetches data using Gemini AI and the API functions
2. Shows top 5 buying and selling transactions for each broker
3. Handles loading states and errors

## Setup

### Prerequisites

- Node.js and npm/yarn
- Gemini API key
- Authentication token for the broker API

### Environment Variables

Create a `.env` file with the following variables:
-GEMINI_API_KEY=your_gemini_api_key
-AUTH_TOKEN=your_auth_token

### Installation

1. Clone the repository
2. Install dependencies: `npm install`

3. Start the development server: `npm run dev`

### Dependencies

1. @google/genai: Gemini AI client library
2. React: Front-end framework
3. Tailwind CSS: Styling