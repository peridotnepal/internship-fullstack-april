interface MetalRate {
  tenGram?: number;
  oneTola?: number;
}

export function cleanData(rawData: string[], metaType: string): MetalRate {
  const cleanData: MetalRate = {};

  rawData.forEach((item) => {
    const clean = item?.trim();

    if (clean?.includes(metaType) && clean.includes("10 grm")) {
      const match = clean.match(/Nrs\s?(\d+(\.\d+)?)/);
      if (match) cleanData.tenGram = parseFloat(match[1]);
    }

    if (clean?.includes(metaType) && clean.includes("1 tola")) {
      const match = clean.match(/रु\s?(\d+(\.\d+)?)/);
      if (match) cleanData.oneTola = parseFloat(match[1]);
    }
  });

  return cleanData;
}
