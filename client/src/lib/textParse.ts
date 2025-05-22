import { GoogleGenAI } from '@google/genai';
import { htmlToText } from 'html-to-text';
import * as cheerio from 'cheerio';

export type ParsedTransactionItem = {
  companyName: string;
  qty: number;
  rate: number;
  amount: number;
  billDate: string;
};

export type ParsedTransaction = {
  name: string;
  clientCode: string;
  transactionNo: string;
  transactions: ParsedTransactionItem[];
  billAmount: number;
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('⚠️ No GEMINI_API_KEY found. Using mock data for fallback.');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || 'dummy-key' });

/**
 * Improved function to check if content is HTML
 */
function isHtmlContent(content: string): boolean {
  const htmlPatterns = [
    /<\s*(!doctype|html|head|body|div|table|tr|td|th|p|a|span|img|h1|h2|h3|h4|h5|h6)\b[^>]*>/i,
    /<\s*\/\s*(html|head|body|div|table|tr|td|th|p|a|span|img|h1|h2|h3|h4|h5|h6)\s*>/i
  ];
  
  return htmlPatterns.some(pattern => pattern.test(content));
}

/**
 * Optimized HTML parsing to extract only relevant transaction information
 */
function extractRelevantTransactionData(html: string): string {
  try {
    // First try to process with cheerio if it's valid HTML
    const $ = cheerio.load(html);
    let relevantData = '';
    
   
    
    // // Extract client name and code information (expanded patterns)
    // const nameElements = $('*:contains("Client"), *:contains("Name"), *:contains("Customer"), *:contains("Dear")');
    // nameElements.each((_, elem) => {
    //   const text = $(elem).text().trim();
    //   if ((text.includes('Client') || text.includes('Name') || 
    //        text.includes('Customer') || text.includes('Dear')) && text.length < 250) {
    //     const cleanText = text.replace(/\s+/g, ' ').trim();
    //     if (cleanText && !relevantData.includes(cleanText)) {
    //       relevantData += cleanText + '\n';
    //     }
    //   }
    // });
    
    // Extract account/client code information (expanded patterns)
    const codeElements = $('*:contains("Code"), *:contains("ID"), *:contains("Account"), *:contains("Phone")');
    codeElements.each((_, elem) => {
      const text = $(elem).text().trim();
      if ((text.includes('Code') || text.includes('ID') || 
           text.includes('Account') || text.includes('Phone')) && text.length < 250) {
        const cleanText = text.replace(/\s+/g, ' ').trim();
        if (cleanText && !relevantData.includes(cleanText)) {
          relevantData += cleanText + '\n';
        }
      }
    });
    
    // // Extract transaction/bill number information (expanded patterns)
    // const transactionElements = $('*:contains("Transaction"), *:contains("Order"), *:contains("Bill"), *:contains("Ref")');
    // transactionElements.each((_, elem) => {
    //   const text = $(elem).text().trim();
    //   if ((text.includes('Transaction') || text.includes('Order') || 
    //        text.includes('Bill') || text.includes('Ref')) && text.length < 250) {
    //     const cleanText = text.replace(/\s+/g, ' ').trim();
    //     if (cleanText && !relevantData.includes(cleanText)) {
    //       relevantData += cleanText + '\n';
    //     }
    //   }
    // });
    
    // Extract amount/quantity information (expanded patterns)
    const amountElements = $('*:contains("Amount"), *:contains("Quantity"), *:contains("Qty"), *:contains("Rate")');
    amountElements.each((_, elem) => {
      const text = $(elem).text().trim();
      if ((text.includes('Amount') || text.includes('Quantity') || 
           text.includes('Qty') || text.includes('Rate')) && text.length < 250) {
        const cleanText = text.replace(/\s+/g, ' ').trim();
        if (cleanText && !relevantData.includes(cleanText)) {
          relevantData += cleanText + '\n';
        }
      }
    });
    
    // Extract share/stock information
    const shareElements = $('*:contains("Share"), *:contains("Stock"), *:contains("Company")');
    shareElements.each((_, elem) => {
      const text = $(elem).text().trim();
      if ((text.includes('Share') || text.includes('Stock') || 
           text.includes('Company')) && text.length < 250) {
        const cleanText = text.replace(/\s+/g, ' ').trim();
        if (cleanText && !relevantData.includes(cleanText)) {
          relevantData += cleanText + '\n';
        }
      }
    });
    
    // Extract table data specifically for transaction details
    const tableRows: string[] = [];
    
    // Look for tables with stock/share related information
    $('table').each((_, table) => {
      const tableHtml = $(table).html() || '';
      const tableText = $(table).text().toLowerCase();
      
      // Process any table that might contain transaction data (broader matching)
      if (tableText.includes('qty') || tableText.includes('quantity') || 
          tableText.includes('rate') || tableText.includes('amount') || 
          tableText.includes('price') || tableText.includes('stock') ||
          tableText.includes('share') || tableText.includes('bill') ||
          tableText.includes('transaction') || tableText.includes('company')) {
        
        $(table).find('tr').each((_, row) => {
          const cells: string[] = [];
          $(row).find('th, td').each((_, cell) => {
            cells.push($(cell).text().trim());
          });
          
          if (cells.length > 0) {
            tableRows.push(cells.join(' | '));
          }
        });
      }
    });
    
    if (tableRows.length > 0) {
      relevantData += '\nTransaction Details:\n' + tableRows.join('\n');
    }
    
    // Extract any lines with key financial information (colon-separated or key terms)
    const bodyText = $('body').text();
    const lines = bodyText.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 0 && trimmedLine.length < 250) {
        // Look for lines with financial data indicators
        if (trimmedLine.includes(':') || 
            /amount|quantity|rate|share|bill|transaction|code|client|name/i.test(trimmedLine)) {
          if (!relevantData.includes(trimmedLine)) {
            relevantData += trimmedLine + '\n';
          }
        }
      }
    }
    
    return relevantData || bodyText.substring(0, 2000); // Fallback to limited body text
  } catch (error) {
    console.warn('Cheerio parsing failed, falling back to basic html-to-text:', error);
    
    // Simple fallback that limits the extracted text
    return htmlToText(html, {
      wordwrap: false,
      selectors: [
        { selector: 'table', format: 'dataTable' },
        { selector: '*', format: 'skip' } // Skip everything else
        
      ],
      limits: {
        maxInputLength: 10000 // Limit input processing
      }
    }).substring(0, 2000); // Further limit output text
  }
}

/**
 * Parse transaction details from various email formats
 */
/**
 * Parse transaction details from various email formats
 */
export async function parseTransaction(rawContent: string): Promise<ParsedTransaction> {
  // Detect if content is HTML
  const isHtml = isHtmlContent(rawContent);
  
  // Extract only relevant transaction text from HTML or use raw content
  const relevantText = isHtml ? extractRelevantTransactionData(rawContent) : rawContent;
  
  console.log('Extracted relevant text for parsing:', relevantText);
  
  if (!GEMINI_API_KEY) {
    console.log('🧪 Using mock transaction data for testing');
    return {
      name: "Test Client",
      clientCode: "000000",
      transactionNo: "B/123456/12345",
      transactions: [
        {
          companyName: "TEST COMPANY LTD",
          qty: 100,
          rate: 500.00,
          amount: 50000.00,
          billDate: "05/21/2025"
        }
      ],
      billAmount: 49950.00,
    };
  }

  // Enhanced prompt that focuses on identifying multiple transactions correctly
  const prompt = `
Extract the stock transaction details from this financial document into exactly this JSON format:
{
  "name": "Client name (full name of the person)",
  "clientCode": "Client ID/code/account number",
  "transactionNo": "Transaction/Bill reference number",
  "transactions": [
    {
      "companyName": "Name of the company/stock (NOT the brokerage firm)",
      "qty": Number of shares (numeric only),
      "rate": Price per share (numeric only), 
      "amount": Total transaction amount (numeric only),
      "billDate": "Date in MM/DD/YYYY format"
    }
  ],
  "billAmount": Final net receivable amount (numeric only)
}

Important extraction rules:
- For numeric fields, extract ONLY the number (remove currency symbols, commas)
- Client name often appears after "Dear" or with "Account" labels
- Client code might be labeled as "Account Code" or appear in brackets/parentheses
- Bill/Transaction number usually has a format like "B/0056687/081-082" or "BuyBill Number:" or similar
- If there's a table with stock transactions, look at EACH ROW and create a separate transaction object for each
- Do NOT use the brokerage company name (like "Imperial Securities") as a stock name
- CRITICAL: Create SEPARATE transaction objects for EACH distinct company/stock found
- Make sure the "companyName" field contains the actual stock/company being traded, not the brokerage firm name
- Return only valid JSON, no explanations.

Document content:
${relevantText}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.1,
        topP: 0.8,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    let parsedResponse: any;

    try {
      parsedResponse = typeof text === 'string' ? JSON.parse(text) : text;
    } catch {
      // Try to extract JSON if wrapped in text
      const jsonMatch = typeof text === 'string' ? text.match(/\{[\s\S]*\}/) : null;
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON in Gemini response');
      }
    }

    // Enhanced validation for transactions
    let transactions: ParsedTransactionItem[] = [];
    
    if (Array.isArray(parsedResponse?.transactions)) {
      transactions = parsedResponse.transactions.map((item: any) => ({
        companyName: item?.companyName || '',
        qty: item?.qty !== null && item?.qty !== undefined ? Number(item.qty) : 0,
        rate: item?.rate !== null && item?.rate !== undefined ? Number(item.rate) : 0,
        amount: item?.amount !== null && item?.amount !== undefined ? Number(item.amount) : 0,
        billDate: item?.billDate || ''
      }));
    } else if (parsedResponse?.stock || parsedResponse?.companyName) {
      // Fall back to creating a single transaction from flat fields if present
      transactions = [{
        companyName: parsedResponse?.stock || parsedResponse?.companyName || '',
        qty: parsedResponse?.quantity !== null && parsedResponse?.quantity !== undefined ? 
              Number(parsedResponse.quantity) : 0,
        rate: parsedResponse?.rate !== null && parsedResponse?.rate !== undefined ? 
              Number(parsedResponse.rate) : 0,
        amount: parsedResponse?.amount !== null && parsedResponse?.amount !== undefined ? 
                Number(parsedResponse.amount) : 0,
        billDate: parsedResponse?.billDate || parsedResponse?.date || ''
      }];
    }

    // Fallback to direct table extraction if no transactions found or likely incorrect parsing
    if (transactions.length === 0 || 
        (transactions.length === 1 && 
         (transactions[0].companyName.toLowerCase().includes('imperial') || 
          transactions[0].companyName.toLowerCase().includes('securities')))) {
      
      // Try direct table extraction from HTML
      if (isHtml) {
        const extractedTransactions = extractTransactionsFromTable(rawContent);
        if (extractedTransactions.length > 0) {
          transactions = extractedTransactions;
        }
      }
    }

    const result: ParsedTransaction = {
      name: parsedResponse?.name || '',
      clientCode: parsedResponse?.clientCode || '',
      transactionNo: parsedResponse?.transactionNo || '',
      transactions: transactions,
      billAmount: parsedResponse?.billAmount !== null && parsedResponse?.billAmount !== undefined ? 
                  Number(parsedResponse.billAmount) : 0,
    };

    return result;
  } catch (error) {
    console.error('❌ Gemini API parsing error:', error);
    throw new Error('Failed to parse transaction data using Gemini.');
  }
}

/**
 * Direct extraction of transactions from HTML tables as a fallback
 */
function extractTransactionsFromTable(html: string): ParsedTransactionItem[] {
  try {
    const $ = cheerio.load(html);
    const transactions: ParsedTransactionItem[] = [];
    
    // Find tables that might contain transaction data
    $('table').each((_, table) => {
      const tableText = $(table).text().toLowerCase();
      
      // Only process tables that likely contain transaction data
      if (tableText.includes('Qty') || tableText.includes('Rate') || 
          tableText.includes('Total') || tableText.includes('company Name')) {
        
        // Get header row to understand column positions
        const headerRow = $(table).find('tr').first();
        const headers: string[] = [];
        
        headerRow.find('th, td').each((_, cell) => {
          headers.push($(cell).text().trim().toLowerCase());
        });
        
        
        // Find column indexes
        const companyNameIndex = headers.findIndex(h => 
          h.includes('company Name') || h.includes('stock') || h.includes('share'));
        const qtyIndex = headers.findIndex(h => 
          h.includes('Qty') || h.includes('quantity'));
        const rateIndex = headers.findIndex(h => 
          h.includes('Rate') || h.includes('price'));
        const amountIndex = headers.findIndex(h => 
          h.includes('amount') || h.includes('Total'));
        
        // Skip header row(s)
        $(table).find('tr').each((rowIndex, row) => {
          if (rowIndex === 0) return; // Skip header
          
          const cells = $(row).find('td, th');
          if (cells.length < 3) return; // Skip rows without enough columns
          
          // Extract cell values
          let companyName = '';
          let qty = 0;
          let rate = 0;
          let amount = 0;
          
          if (companyNameIndex >= 0 && $(cells[companyNameIndex]).text()) {
            companyName = $(cells[companyNameIndex]).text().trim();
          }
          
          if (qtyIndex >= 0 && $(cells[qtyIndex]).text()) {
            const qtyText = $(cells[qtyIndex]).text().trim();
            qty = parseFloat(qtyText.replace(/[^\d.]/g, '')) || 0;
          }
          
          if (rateIndex >= 0 && $(cells[rateIndex]).text()) {
            const rateText = $(cells[rateIndex]).text().trim();
            rate = parseFloat(rateText.replace(/[^\d.]/g, '')) || 0;
          }
          
          if (amountIndex >= 0 && $(cells[amountIndex]).text()) {
            const amountText = $(cells[amountIndex]).text().trim();
            amount = parseFloat(amountText.replace(/[^\d.]/g, '')) || 0;
          }
          
          // Only add if we have meaningful data
          if (companyName && companyName.length > 1 && 
              (qty > 0 || rate > 0 || amount > 0)) {
            
            // Skip rows that are likely summary rows
            if (!companyName.toLowerCase().includes('total') && 
                !companyName.toLowerCase().includes('amount')) {
              
              // Find bill date from document
              const billDateMatch = html.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
              const billDate = billDateMatch ? billDateMatch[0] : '';
              
              transactions.push({
                companyName,
                qty,
                rate,
                amount,
                billDate
              });
            }
          }
        });
      }
    });
    
    return transactions;
  } catch (error) {
    console.error('Error extracting transactions from table:', error);
    return [];
  }
}