import React from "react";

interface Props {
  onClose: () => void;
  setGoldPrice: (data: number) => void;
  setSilverPrice: (data: number) => void;
}

const GoldSidebar = ({ onClose, setGoldPrice, setSilverPrice }: Props) => {
  return (
    // Overlay (full screen)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-xl w-[350px] p-6 flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Enter Data</h1>
          <button
            className="p-2 border rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-3"
        >
          {/* Gold */}
          <label>Gold Price</label>
          <input
            type="number"
            placeholder="Enter gold price"
            className="p-2 border rounded-xl"
            onChange={(e) => setGoldPrice(Number(e.target.value))}
          />

          {/* Silver */}
          <label>Silver Price</label>
          <input
            type="number"
            placeholder="Enter silver price"
            className="p-2 border rounded-xl"
            onChange={(e) => setSilverPrice(Number(e.target.value))}
          />

          <button className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600" onClick={onClose}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoldSidebar;