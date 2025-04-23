"use client"
import Image from 'next/image';

interface DividendDataProps {
  company: string;
  fiscalYear: string;
  lastTradingPrice: string;
  cashDividend: string;
  bonusDividend: string;
  bookClose: string;
  sector: string;
  symbol: string;
  product: string;
}

export default function PremiumDividendAnnouncement({
  company, 
  fiscalYear, 
  lastTradingPrice, 
  cashDividend, 
  bonusDividend,
  bookClose, 
  sector,
  symbol,
  product
}: DividendDataProps) {

  const totalDividend = Number(cashDividend) + Number(bonusDividend);

  const formatDateFromText = (dateStr: string) => {
    const date = new Date(dateStr);
  
    if (isNaN(date.getTime())) return '';
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
  
    return `${day}.${month}.${year}`;
  };
  return (
    //original
    // <div className="flex items-center justify-center bg-p2 "
    //   style={{
    //     width: '448px',
    //     height: 'auto',
    //     margin: 0,
    //     boxSizing: 'border-box'
    //   }}
    // >
    //   <div className="w-full max-w-md relative">    
    //     {/* Main card */}
    //     <div className="relative bg-slate-100  overflow-hidden"
    //          style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.15)' }}
    //          >
          
    //       {/* Gold ornamental header */}
    //       <div className="relative h-14 overflow-hidden">
    //         <div className="absolute inset-0 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700"></div>
    //         <div className="absolute inset-0 flex items-center justify-center">
    //           <h1 className="text-black font-bold text-xl tracking-wider">DIVIDEND ANNOUNCEMENT</h1>
    //         </div>
    //       </div>
          
    //       {/* Company branding */}
    //       <div className="pt-4 pb-6 px-8 text-center">
    //         <div className="inline-flex items-center justify-center">
    //           <div className="w-16 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
    //           <div className="px-4">
    //             <h2 className="text-lg font-bold flex items-center flex-col">
    //               <Image
    //               key={symbol}
    //               priority={true}
    //               unoptimized={true}
    //                src={`${process.env.NEXT_PUBLIC_GET_LOGO}/${symbol}.webp?ts=${Date.now()}`} alt={`${symbol} Logo`} width={120} height={120} className='rounded-md' />
    //               <span className="text-black text-base">{company}</span>
    //             </h2>
    //           </div>
    //           <div className="w-12 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
    //         </div>
    //         <p className="text-yellow-600 text-sm mt-1 tracking-wider font-medium" 
    //            style={{ textShadow: '0 0 5px rgba(234, 179, 8, 0.5)' }}>
    //           {sector}
    //         </p>
    //       </div>
          
    //       {/* Fiscal Year */}
    //       <div className="mx-8 bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-3">
    //         <div className="flex justify-between items-center">
    //           <div className='ml-1'>
    //             <p className="text-zinc-100 text-xs font-bold">FISCAL YEAR</p>
    //             <p className="text-white font-bold text-lg">{fiscalYear}</p>
    //           </div>
    //           <div className="bg-zinc-900 border border-zinc-500 rounded px-1 py-1">
    //             <p className="text-zinc-100 text-xs  font-medium">LAST TRADED</p>
    //             <p className="text-yellow-500 text-right font-medium">{Number(lastTradingPrice).toFixed(2)}</p>
    //           </div>
    //         </div>
    //       </div>
          
    //       {/* Dividend Details */}
    //       <div className="px-8 pb-8">
    //         {/* Cash Dividend */}
    //         <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-3 relative overflow-hidden">
    //           <div className="absolute top-0 right-0 w-16 h-16">
    //             <div className="absolute transform rotate-45 bg-yellow-600 text-xs text-black font-bold py-1 text-center -right-10 top-3 w-32">CASH</div>
    //           </div>
    //           <div className="mr-6 ml-1">
    //             <p className="text-zinc-100 text-xs mb-1 font-bold">CASH DIVIDEND</p>
    //             <div className="flex items-baseline">
    //               <p className="text-white text-xl font-medium">{Number(cashDividend).toFixed(4)}</p>
    //               <p className="text-yellow-500 text-lg ml-1">%</p>
    //             </div>
    //           </div>
    //         </div>
            
    //         {/* Bonus Dividend */}
    //         <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-3 relative overflow-hidden">
    //           <div className="absolute top-0 right-0 w-16 h-16">
    //             <div className="absolute transform rotate-45 bg-yellow-600 text-xs text-black font-bold py-1 text-center -right-10 top-3 w-32">BONUS</div>
    //           </div>
    //           <div className="mr-6 ml-1">
    //             <p className="text-zinc-100 text-xs mb-1 font-bold">BONUS DIVIDEND</p>
    //             <div className="flex items-baseline">
    //               <p className="text-white text-xl font-medium">{Number(bonusDividend).toFixed(4)}</p>
    //               <p className="text-yellow-500 text-lg ml-1">%</p>
    //             </div>
    //           </div>
    //         </div>
            
    //         {/* Total Dividend */}
    //         <div className="bg-zinc-900 border border-yellow-900/50 rounded-lg p-[2px] relative overflow-hidden">
    //           <div className="absolute inset-0 opacity-10">
    //             <div className="absolute inset-0"
    //                  style={{ 
    //                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23FFD700\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'3\'/%3E%3Ccircle cx=\'0\' cy=\'50\' r=\'3\'/%3E%3Ccircle cx=\'100\' cy=\'50\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
    //                    backgroundSize: '24px 24px'
    //                  }}></div>
    //           </div>
    //           <div className="relative">
    //             <div className="flex justify-between items-center">
    //               <div className='ml-1'>
    //                 <p className="text-zinc-100 text-xs mb-1 font-bold">TOTAL DIVIDEND</p>
    //                 <div className="flex items-baseline">
    //                   <p className="text-xl text-white font-medium">{totalDividend.toFixed(4)}</p>
    //                   <p className="text-yellow-500 text-lg ml-1">%</p>
    //                 </div>
    //               </div>
    //               <div className="h-14 w-14 rounded-full border-4 border-yellow-500/30 flex items-center justify-center">
    //                 <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-700 to-yellow-500 flex items-center justify-center">
    //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
    //                     <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
    //                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    //                   </svg>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
          
    //       {/* Footer with emblem and Portfolio Nepal branding */}
    //       <div className="px-8 pb-6 flex justify-between items-center">
    //         <div className="flex items-center">
    //           <div className="w-8 h-8 rounded-full bg-zinc-900 border border-yellow-700/50 flex items-center justify-center">
    //             <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-700 to-yellow-500"></div>
    //           </div>
    //           <div className="ml-2">
    //             <div className="text-xs text-yellow-600 font-semibold uppercase tracking-wider">Verified</div>
    //             <div className="text-zinc-800 font-extrabold text-xs">{product}</div>
    //           </div>
    //         </div>
    //         <div className="text-right">
    //           <p className="text-zinc-500 text-xs">Record Date</p>
    //           <p className="text-zinc-400 text-sm">{formatDateFromText(bookClose)}</p>
    //         </div>
    //       </div>
          
    //       {/* Bottom ornamental border */}
    //       <div className="h-2 bg-gradient-to-r from-yellow-900 via-yellow-500 to-yellow-900"></div>
    //     </div>
        
    //     {/* Watermark line */}
    //      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 text-center">
    //       <div className="text-yellow-900/50 text-xs font-medium tracking-wider">{product}</div>
    //     </div> 
    //   </div>
    // </div>

    //black and gold with progress bar 
  //   <div className="flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black"
  //   style={{
  //     width: '448px',
  //     height: 'auto',
  //     margin: 0,
  //     boxSizing: 'border-box',
  //     padding: '20px'
  //   }}
  // >
  //   <div className="w-full max-w-md relative">    
  //     {/* Main card */}
  //     <div className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl overflow-hidden"
  //          style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.2)' }}
  //     >
        
  //       {/* Premium gold header */}
  //       <div className="relative h-16 overflow-hidden">
  //         <div className="absolute inset-0 bg-gradient-to-r from-yellow-800 via-yellow-500 to-yellow-800"></div>
  //         <div className="absolute inset-0">
  //           <div className="h-full w-full opacity-30"
  //                style={{ 
  //                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23FFFFFF\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
  //                  backgroundSize: '8px 8px'
  //                }}>
  //           </div>
  //         </div>
  //         <div className="absolute inset-0 flex items-center justify-center">
  //           <h1 className="text-zinc-900 font-extrabold text-2xl tracking-wider" style={{ textShadow: '0 1px 2px rgba(255, 215, 0, 0.6)' }}>DIVIDEND ANNOUNCEMENT</h1>
  //         </div>
  //       </div>
        
  //       {/* Company branding section */}
  //       <div className="pt-6 pb-4 px-6 text-center">
  //         <div className="flex items-center justify-center mb-2">
  //           <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg" style={{ boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)' }}>
  //             <Image
  //               priority={true}
  //               unoptimized={true}
  //               src={`${process.env.NEXT_PUBLIC_GET_LOGO}/${symbol}.webp?ts=${Date.now()}`} 
  //               alt={`${symbol} Logo`} 
  //               width={80} 
  //               height={80} 
  //               className="rounded-full object-contain"
  //             />
  //           </div>
  //         </div>
  //         <h2 className="text-white text-xl font-bold mt-2">{company}</h2>
  //         <div className="flex items-center justify-center mt-1">
  //           <div className="px-3 py-1 bg-yellow-500/20 rounded-full">
  //             <p className="text-yellow-400 text-sm tracking-wider font-medium">
  //               {sector}
  //             </p>
  //           </div>
  //         </div>
  //       </div>
        
  //       {/* Info card */}
  //       <div className="mx-6 bg-zinc-800 rounded-xl p-4 mb-4" 
  //            style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.05)' }}>
  //         <div className="flex justify-between items-center mb-3">
  //           <div>
  //             <p className="text-zinc-400 text-xs font-medium uppercase">Fiscal Year</p>
  //             <p className="text-white font-bold text-lg">{fiscalYear}</p>
  //           </div>
  //           <div className="bg-zinc-900/80 rounded-lg px-3 py-2">
  //             <p className="text-zinc-400 text-xs uppercase">Last Traded</p>
  //             <p className="text-yellow-400 text-right font-bold">${Number(lastTradingPrice).toFixed(2)}</p>
  //           </div>
  //         </div>
          
  //         {/* Dividend Progress Bars */}
  //         <div className="space-y-4 mt-4">
  //           {/* Cash Dividend */}
  //           <div>
  //             <div className="flex justify-between mb-1">
  //               <span className="text-zinc-300 text-sm font-medium">Cash Dividend</span>
  //               <span className="text-yellow-400 font-bold">{Number(cashDividend).toFixed(2)}%</span>
  //             </div>
  //             <div className="w-full bg-zinc-700 rounded-full h-2.5">
  //               <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2.5 rounded-full" 
  //                    style={{ width: `${Math.min(Number(cashDividend) * 4, 100)}%` }}></div>
  //             </div>
  //           </div>
            
  //           {/* Bonus Dividend */}
  //           <div>
  //             <div className="flex justify-between mb-1">
  //               <span className="text-zinc-300 text-sm font-medium">Bonus Dividend</span>
  //               <span className="text-yellow-400 font-bold">{Number(bonusDividend).toFixed(2)}%</span>
  //             </div>
  //             <div className="w-full bg-zinc-700 rounded-full h-2.5">
  //               <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2.5 rounded-full" 
  //                    style={{ width: `${Math.min(Number(bonusDividend) * 4, 100)}%` }}></div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
        
  //       {/* Total Dividend Highlight */}
  //       <div className="mx-6 mb-6">
  //         <div className="bg-gradient-to-r from-yellow-900 to-yellow-700 rounded-lg p-0.5">
  //           <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg p-4">
  //             <div className="flex items-center justify-between">
  //               <div>
  //                 <p className="text-zinc-400 text-xs uppercase mb-1">Total Dividend</p>
  //                 <p className="text-white text-3xl font-bold">{totalDividend.toFixed(2)}%</p>
  //               </div>
  //               <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-400 flex items-center justify-center shadow-lg"
  //                    style={{ boxShadow: '0 0 20px rgba(234, 179, 8, 0.4)' }}>
  //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-900" viewBox="0 0 20 20" fill="currentColor">
  //                   <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
  //                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
  //                 </svg>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
        
  //       {/* Footer with record date */}
  //       <div className="px-6 py-4 bg-zinc-900 flex justify-between items-center">
  //         <div className="flex items-center">
  //           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-700 to-yellow-500 flex items-center justify-center shadow-md">
  //             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-900" viewBox="0 0 20 20" fill="currentColor">
  //               <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  //             </svg>
  //           </div>
  //           <div className="ml-3">
  //             <p className="text-yellow-500 text-xs font-bold uppercase tracking-wider">Verified by</p>
  //             <p className="text-white font-bold">Portfolio Nepal</p>
  //           </div>
  //         </div>
  //         <div className="text-right">
  //           <p className="text-zinc-400 text-xs uppercase">Record Date</p>
  //           <p className="text-white font-medium">{formatDateFromText(bookClose)}</p>
  //         </div>
  //       </div>
        
  //       {/* Bottom accent bar */}
  //       <div className="h-2 bg-gradient-to-r from-yellow-800 via-yellow-500 to-yellow-800"></div>
  //     </div>
      
  //     {/* Watermark */}
  //     <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full text-center">
  //       <div className="text-yellow-700 text-xs font-medium tracking-widest">PORTFOLIO NEPAL • FINANCIAL INSIGHTS</div>
  //     </div>
  //   </div>
  // </div>

  //other than gold theme
//   <div className="flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900"
//   style={{
//     width: '448px',
//     height: 'auto',
//     margin: 0,
//     boxSizing: 'border-box',
//     padding: '24px'
//   }}
// >
//   <div className="w-full max-w-md relative">    
//     {/* Main card */}
//     <div className="relative bg-white rounded-3xl overflow-hidden"
//          style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 80px rgba(139, 92, 246, 0.3)' }}
//     >
//       {/* Decorative top elements */}
//       <div className="absolute top-0 left-0 w-32 h-32">
//         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-br-full opacity-90"></div>
//       </div>
//       <div className="absolute top-0 right-0 w-24 h-24">
//         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-fuchsia-500 to-purple-600 rounded-bl-full opacity-80"></div>
//       </div>
      
//       {/* Header */}
//       <div className="relative pt-8 px-6 text-center z-10">
//         <h1 className="text-gray-800 font-extrabold text-2xl tracking-tight">DIVIDEND ANNOUNCEMENT</h1>
//         <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mt-2 rounded-full"></div>
//       </div>
      
//       {/* Company branding section */}
//       <div className="pt-4 pb-2 px-6 text-center relative z-10">
//         <div className="flex items-center justify-center mb-2">
//           <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-white p-1.5"
//                style={{ boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' }}>
//             <Image
//               priority={true}
//               unoptimized={true}
//               src={`${process.env.NEXT_PUBLIC_GET_LOGO}/${symbol}.webp?ts=${Date.now()}`} 
//               alt={`${symbol} Logo`} 
//               width={80} 
//               height={80} 
//               className="rounded-lg object-contain"
//             />
//           </div>
//         </div>
//         <h2 className="text-gray-800 text-xl font-bold mt-2">{company}</h2>
//         <div className="inline-block px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2">
//           <p className="text-white text-sm font-medium">
//             {sector}
//           </p>
//         </div>
//       </div>
      
//       {/* Fiscal year and trading info */}
//       <div className="px-6 py-3 mt-2">
//         <div className="flex justify-between items-center">
//           <div className="bg-gray-50 px-4 py-2 rounded-xl">
//             <p className="text-gray-500 text-xs font-medium uppercase">Fiscal Year</p>
//             <p className="text-gray-800 font-bold text-lg">{fiscalYear}</p>
//           </div>
//           <div className="bg-gray-50 px-4 py-2 rounded-xl">
//             <p className="text-gray-500 text-xs uppercase">Last Traded</p>
//             <p className="text-purple-600 text-right font-bold">${Number(lastTradingPrice).toFixed(2)}</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Dividend data visualization section */}
//       <div className="px-6 py-1">
//         <div className="bg-gray-50 rounded-2xl p-5">
//           <h3 className="text-gray-800 font-bold mb-1">Dividend Distribution</h3>
//           {/* Visual distribution chart */}
//           <div className="flex h-32 mb-4 items-end">
//             {/* Cash dividend bar */}
//             <div className="flex-1 flex flex-col items-center justify-end mx-2">
//               <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg relative"
//                    style={{ height: `${Math.max(Number(cashDividend) * 1.5, 15)}%` }}>
//                 <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-600 font-bold text-lg">
//                   {Number(cashDividend).toFixed(2)}%
//                 </div>
//               </div>
//               <div className="bg-gradient-to-r from-blue-200 to-blue-100 w-full h-1.5 rounded-b-lg"></div>
//               <p className="text-gray-500 text-xs mt-2 font-medium">CASH</p>
//             </div>
            
//             {/* Bonus dividend bar */}
//             <div className="flex-1 flex flex-col items-center justify-end mx-2">
//               <div className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg relative"
//                    style={{ height: `${Math.max(Number(bonusDividend) * 1.5, 15)}%` }}>
//                 <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-purple-600 font-bold text-lg">
//                   {Number(bonusDividend).toFixed(2)}%
//                 </div>
//               </div>
//               <div className="bg-gradient-to-r from-purple-200 to-purple-100 w-full h-1.5 rounded-b-lg"></div>
//               <p className="text-gray-500 text-xs mt-2 font-medium">BONUS</p>
//             </div>
            
//             {/* Total dividend bar */}
//             <div className="flex-1 flex flex-col items-center justify-end mx-2">
//               <div className="w-full bg-gradient-to-t from-pink-600 to-pink-400 rounded-t-lg relative"
//                    style={{ height: `${Math.max(totalDividend * 1.5, 15)}%` }}>
//                 <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-pink-600 font-bold text-lg">
//                   {totalDividend.toFixed(2)}%
//                 </div>
//               </div>
//               <div className="bg-gradient-to-r from-pink-200 to-pink-100 w-full h-1.5 rounded-b-lg"></div>
//               <p className="text-gray-500 text-xs mt-2 font-medium">TOTAL</p>
//             </div>
//           </div>
          
//           {/* Total dividend highlight */}
//           <div className=" p-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl">
//             <div className="bg-white rounded-xl p-4 flex items-center justify-between">
//               <div>
//                 <p className="text-gray-400 text-xs uppercase font-medium">Total Dividend</p>
//                 <p className="text-gray-800 text-2xl font-bold">{totalDividend.toFixed(2)}%</p>
//               </div>
//               <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center"
//                    style={{ boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)' }}>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
//                   <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Footer with date and verification */}
//       <div className="px-6 pb-6">
//         <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-3">
//           <div className="flex items-center">
//             <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-gray-400 text-xs uppercase">Verified by</p>
//               <p className="text-gray-700 font-bold">Portfolio Nepal</p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="text-gray-400 text-xs uppercase">Record Date</p>
//             <p className="text-gray-700 font-medium">{formatDateFromText(bookClose)}</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Bottom decorative element */}
//       <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
//     </div>
    
//     {/* Watermark */}
//     <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full text-center">
//       <div className="text-indigo-300 text-xs font-medium tracking-widest">PORTFOLIO NEPAL • MARKET INSIGHTS</div>
//     </div>
//   </div>
// </div>


 <div className="flex items-center justify-center bg-gradient-to-br from-black to-zinc-900"
style={{
  width: '448px',
  height: 'auto',
  margin: 0,
  boxSizing: 'border-box',
  // padding: '24px'
}}
>
<div className="w-full max-w-md relative">    
  {/* Main card */}
  <div className="relative bg-black rounded-2xl overflow-hidden"
       style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 70px rgba(234, 179, 8, 0.2)' }}
  > 
    {/* Header */}
    <div className="relative pt-8 px-6 text-center z-10">
      <h1 className="text-yellow-500 font-extrabold text-2xl tracking-wider whitespace-nowrap">DIVIDEND ANNOUNCEMENT</h1>
      <div className="w-full h-1 bg-gradient-to-r from-yellow-700 via-amber-500 to-yellow-700 mx-auto mt-2 rounded-full"></div>
    </div>
    
    {/* Company branding section */}
    <div className="pt-4 pb-2 px-6 text-center relative z-10">
      <div className="flex items-center justify-center mb-2">
        <div className="  "
          >
          <Image
            priority={true}
            unoptimized={true}
            src={`${process.env.NEXT_PUBLIC_GET_LOGO}/${symbol}.webp?ts=${Date.now()}`} 
            alt={`${symbol} Logo`} 
            width={120} 
            height={120} 
            // className=" object-contain  "   
          />
        </div>
      </div>
      <h2 className="text-white text-xl font-bold mt-2">{company}</h2>
      <div className="inline-block px-4 py-1 bg-gradient-to-r from-yellow-700 to-amber-600 rounded-full mt-2">
        <p className="text-black text-sm font-medium">
          {sector}
        </p>
      </div>
    </div>
    
    {/* Fiscal year and trading info */}
    <div className="px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs font-medium uppercase">Fiscal Year</p>
          <p className="text-white font-bold text-lg">{fiscalYear}</p>
        </div>
        <div className="bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase">Last Traded</p>
          <p className="text-yellow-500 text-right font-bold">${Number(lastTradingPrice).toFixed(2)}</p>
        </div>
      </div>
    </div>
    
    {/* Dividend data visualization section - more compact */}
    <div className="px-6 pb-4">
      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
        <h3 className="text-white font-bold ">Dividend Distribution</h3>
        
        {/* Visual distribution chart - reduced height */}
        <div className="flex h-24 mb-2 items-end">
          {/* Cash dividend bar */}
          <div className="flex-1 flex flex-col items-center justify-end mx-2">
            <div className="w-full bg-gradient-to-t from-yellow-700 to-amber-500 rounded-t-lg relative"
                 style={{ height: `${Math.max(Number(cashDividend) * 1.8, 12)}%` }}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-500 font-bold">
                {Number(cashDividend).toFixed(2)}%
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-900 to-amber-800 w-full h-1 rounded-b-lg"></div>
            <p className="text-zinc-400 text-xs mt-1 font-medium">CASH</p>
          </div>
          
          {/* Bonus dividend bar */}
          <div className="flex-1 flex flex-col items-center justify-end mx-2">
            <div className="w-full bg-gradient-to-t from-amber-700 to-yellow-500 rounded-t-lg relative"
                 style={{ height: `${Math.max(Number(bonusDividend) * 1.8, 12)}%` }}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-500 font-bold">
                {Number(bonusDividend).toFixed(2)}%
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-900 to-yellow-800 w-full h-1 rounded-b-lg"></div>
            <p className="text-zinc-400 text-xs mt-1 font-medium">BONUS</p>
          </div>
          
          {/* Total dividend bar */}
          <div className="flex-1 flex flex-col items-center justify-end mx-2">
            <div className="w-full bg-gradient-to-t from-yellow-600 to-amber-400 rounded-t-lg relative"
                 style={{ height: `${Math.max(totalDividend * 1.8, 12)}%` }}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-500 font-bold">
                {totalDividend.toFixed(2)}%
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-800 to-amber-700 w-full h-1 rounded-b-lg"></div>
            <p className="text-zinc-400 text-xs mt-1 font-medium">TOTAL</p>
          </div>
        </div>
        
        {/* Total dividend highlight */}
        <div className="mt-3 p-0.5 bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-700 rounded-lg">
          <div className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-xs uppercase font-medium">Total Dividend</p>
              <p className="text-white text-2xl font-bold">{totalDividend.toFixed(2)}%</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-700 via-amber-600 to-yellow-500 flex items-center justify-center"
                 style={{ boxShadow: '0 5px 15px rgba(234, 179, 8, 0.3)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-black" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Footer with date and verification - Made more compact */}
    <div className="px-6 pb-6">
      <div className="flex justify-between items-center bg-zinc-900 rounded-xl px-4 py-3 border border-zinc-800">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-700 to-amber-500 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-zinc-400 text-xs uppercase">Verified by</p>
            <p className="text-white font-bold">{product}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-zinc-400 text-xs uppercase">Record Date</p>
          <p className="text-white font-medium">{formatDateFromText(bookClose)}</p>
        </div>
      </div>
    </div>
    
    {/* Bottom decorative element */}
    <div className="h-2 bg-gradient-to-r from-yellow-800 via-amber-600 to-yellow-800"></div>
  </div>
  
  {/* Watermark */}
  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full text-center">
    <div className="text-yellow-800/70 text-xs font-medium tracking-widest">{product} • PREMIUM INSIGHTS</div>
  </div>
</div>
</div> 

  );
}