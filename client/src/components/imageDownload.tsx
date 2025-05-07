import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
  const handleDownload = async (chartRef: React.RefObject<HTMLDivElement | null>, name: string) => {
    if (!chartRef.current) return;
    try {      
      const dataUrl = await toPng(chartRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        style: {
          transform: "none",
          margin: "0",
          padding: "0",
        },
      });
      saveAs(dataUrl, `${name}.png`);
    } catch (err) {
      console.error("Error generating image:", err);
    }
  };

  export default handleDownload;