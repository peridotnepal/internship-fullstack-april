interface MetalRate {
    tenGram?: number;
    oneTola?: number;
  }

  
export function cleanData(rawData: string[], metaType: string): MetalRate {
    const cleanData: MetalRate = {};
  
    rawData.forEach((item) => {
      const clean = item?.trim();
  
      if (clean?.includes(metaType) && clean.includes("10 grm")) {
        const match = clean.match(/Nrs\s?(\d+)/);
        if (match) cleanData.tenGram = parseInt(match[1], 10);
      }
  
      if (clean?.includes(metaType) && clean.includes("1 tola")) {
        const match = clean.match(/रु\s?(\d+)/);
        if (match) cleanData.oneTola = parseInt(match[1], 10);
      }
    });
  
    return cleanData;
  }