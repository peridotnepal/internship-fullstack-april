// src/main.ts

import { readFileSync } from "fs";
import { parseTransaction } from "./lib/textParse";
import path from 'path';
import { fileURLToPath } from "url";




// Example email content
const emailContent = `
From: Linch Stock Market <info@linch.com.np>
Date: Thu, Feb 27, 2025 at 3:24 PM
Subject: Sales Transaction of KHAGENDRA BAHADUR BOHARA for 27/02/2025 AD
Linch Stock Market Ltd.
Broker Code: 41
Phone No: 014569068,014569367
*Sold Shares for 27/02/2025 AD*
Client Name Transaction No Stock Quantity Rate Amount Bill Amt.
KHAGENDRA BOHARA (20250237893) 9865455167 ADBL 10.00 1,038.40
10,384.00 10,345.06
`;

// Example PDF content
const pdfContent = `
Naasa Securities Company Ltd.
Nepal, Lal Durbar
PAN No: 30250999
Dear ISHANI KARKI (6969696969) [Account Code: 4444444] (Phone: 9865449167),
As per your order, we have sold undermentioned stocks in the stock market.
Transaction No.         Company Name             Qty Rate     Base     Amount   Comm.  Comm.  CGT SEBI    Ed.    Total   CO. Qty.  CO. Amt.   Payout
                                                      Price                   Rate                 Comm.  Cess
323081160744673 (ID)    Himalaya Reinsurance Limited   10  658.74  500.00   6,587.40  0.35/0.4  0.40%   25.40   317.95   0.92  6587.75   1    0.00    Yes
Share Amount:           6,320.00             Share Quantity:                    10
SEBI Commission:        0.95                 Capital Gain Tax:               317.90
Net Payable Amount:     5,980.75             Closeout Amount:                 0.00
Net Payable Less Closeout: 5,980.75          DP Amount:                     25.00
Clearance Date:         01/01/2024           Total Commission:              25.40
Amount in Words: FIVE THOUSAND NINE HUNDRED EIGHTY AND SEVENTY FIVE PAISA ONLY
Original (Print Count: 1)                                              Naasa Securities Company Ltd.
                                                                       Naasa Broker No. 56
`;

// Another broker format
const anotherBrokerFormat = ` <table border='1' cellspacing='0' cellpadding='5'><tr><td>Dipshikha</td><td>Dhitopatra</td><td>Karobar</td><td>Company</td><td>Pvt.</td><td>Ltd</td><td>Anamnagar</td><td>,</td><td>Kathmandu</td></tr><tr><td>Phone:</td><td>01-4102532</td><td>,</td><td>4102534</td><td>Fax:</td><td>01-5705490</td><td>Fiscal</td><td>Year:</td><td>081-082</td></tr><tr><td>Schedule</td><td>-3</td><td>Relating</td><td>to</td><td>Sub-Regulation</td><td>(I)</td><td>of</td><td>Regulation</td><td>16</td><td>Information</td><td>note</td><td>to</td><td>clients</td><td>on</td><td>execution</td><td>of</td><td>Transaction</td></tr><tr><td>PAN</td><td>No.</td><td>302754016</td></tr><tr><td>Dear</td><td>RAHUL</td><td>CHAUDHARY</td><td>(20221141138)</td><td>[Account</td><td>Code:</td><td>372110]</td><td>(Phone:</td><td>9842407391),</td><td>As</td><td>per</td><td>your</td><td>order,</td><td>we</td><td>have</td><td>sold</td><td>undernoted</td><td>stocks</td><td>in</td><td>the</td><td>stock</td><td>market.</td></tr><tr><td>SellBill</td><td>Number:</td><td>S/0187971/081-082</td><td>Bill</td><td>Date:</td><td>05/08/2025</td><td>AD</td></tr><tr><td>Transaction</td><td>No.</td><td>Company</td><td>Name</td><td>Qty</td><td>Rate</td><td>Base</td><td>Price</td><td>Amount</td><td>Comm.</td><td>Rate</td></tr><tr><td>Comm.</td><td>Amt.</td><td>CGT</td><td>SEBO</td></tr><tr><td>Eff.</td><td>Rate</td><td>Total</td><td>CO.</td><td>Qty.</td><td>CO.</td><td>Amt.</td><td>Payout</td></tr><tr><td>Comm.</td></tr><tr><td>2025050804043299</td><td>(D)</td><td>Himal</td><td>Dolakha</td><td>Hydropower</td><td>Company</td><td>Limited</td><td>20</td><td>220.00</td><td>221.57</td><td>4,400.00</td><td>0.36</td><td>%</td><td>15.84</td><td>0.00</td><td>0.66</td><td>219.18</td><td>4,383.50</td><td>0</td><td>0.00</td><td>Yes</td></tr><tr><td>Share</td><td>Amount:</td><td>4,400.00;</td><td>Share</td><td>Quantity:</td><td>20</td><td>NEPSE</td><td>Commission</td><td>3.17</td><td>SEBO</td><td>Commission:</td><td>0.66</td><td>Capital</td><td>Gain</td><td>Tax:</td><td>0.00</td><td>SEBON</td><td>Regulatory</td><td>Fee:</td><td>0.10</td><td>Net</td><td>Payable</td><td>Amount:</td><td>4,358.50</td><td>Closeout</td><td>Amount:</td><td>0.00</td><td>Broker</td><td>Commission:</td><td>12.57</td><td>Net</td><td>Payable</td><td>Less</td><td>Closeout:</td><td>4,358.50</td><td>DP</td><td>Amount:</td><td>25.00</td><td>Total</td><td>Commission:</td><td>15.84</td><td>Clearance</td><td>Date:</td><td>05/11/2025</td><td>Amount</td><td>In</td><td>Words:</td><td>FOUR</td><td>THOUSAND</td><td>THREE</td><td>HUNDRED</td><td>FIFTY</td><td>EIGHT</td><td>AND</td><td>FIVE</td><td>PAISA</td><td>ONLY</td></tr><tr><td>------------------------------</td><td>Dipshikha</td><td>Dhitopatra</td><td>Karobar</td></tr><tr><td>Original</td><td>(Print</td><td>Count:</td><td>1)</td></tr><tr><td>Company</td><td>Pvt.</td><td>Ltd</td><td>Nepse</td><td>Broker</td><td>No.</td><td>38</td></tr></table>`;

// extractPdf.ts
const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);

const mdText = readFileSync(path.join(__dirname, "../output.md"), "utf-8");
// import { fileURLToPath } from 'url';
// import { execFile } from 'child_process';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const pdfPath = path.join(__dirname, '..', 'public', 'kb.pdf');
// const pythonScriptPath = path.join(__dirname, '..', 'extract_pdf.py');

// execFile('python', [pythonScriptPath, pdfPath], (error, stdout, ) => {
//   if (error) {
//     console.error('Python script error:', error);
//     return;
//   }

//   // Output is HTML
//   const htmlContent = stdout;
//   console.log('Extracted HTML:\n', htmlContent);

//   // Optionally: Inject into an HTML file or serve via API
// });





// Test with proper extraction of text data based on actual content
async function run() {
  try {
    // Set the environment variable for testing purposes
    // In production, this would be set through your environment configuration
    // process.env.GEMINI_API_KEY = 'your-api-key-here';
    
    console.log("=== PROCESSING EMAIL FORMAT ===");
    const emailResult = await parseTransaction(emailContent);
    console.log(JSON.stringify(emailResult, null, 2));
    
    console.log("\n=== PROCESSING PDF FORMAT ===");
    const pdfResult = await parseTransaction(pdfContent);
    console.log(JSON.stringify(pdfResult, null, 2));
    
    console.log("\n=== PROCESSING ALTERNATIVE FORMAT ===");
    const alternativeResult = await parseTransaction(anotherBrokerFormat);
    console.log(JSON.stringify(alternativeResult, null, 2));
    const mdResult = await parseTransaction(mdText);
    console.log(JSON.stringify(mdResult, null, 2));
  } catch (err) {
    console.error("Parsing failed:", err);
  }
}

// Execute the function
run(); // ✅ No top-level await used