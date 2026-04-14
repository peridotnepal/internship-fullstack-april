"use client";
import React, { useEffect, useState } from "react";

const Agm = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/agm");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("History API error:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const removeNullValues = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) => value !== null && value !== undefined,
      ),
    );
  };

  const agms = data?.agms || [];
  const cleanStocks = agms.map(removeNullValues);

  if(!data) {
    return <div className="flex justify-center h-screen items-center">Wait a few seconds ! data is loading...</div>
  }

  return (
    <div className="p-5 m-5">
      <h1 className="text-2xl font-bold text-center mb-6">
        AGM Details Daily Updates
      </h1>

      {/* GRID CONTAINER */}
      <div className="flex flex-col gap-4">
        {cleanStocks.map((item, idx) => (
          <div
            key={idx}
            className="w-full flex items-start justify-between gap-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            {/* LEFT SIDE - TITLE */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <span className="mt-1 text-gray-400">📢</span>

                <h2 className="text-sm md:text-base font-medium text-gray-800 leading-relaxed">
                  {item.title}
                </h2>
              </div>
            </div>

            {/* RIGHT SIDE - DATES */}
            <div className="w-[220px] shrink-0 text-xs md:text-sm text-gray-600 space-y-1">

                
              <div className="flex justify-between">
                <span className="text-gray-400">Start</span>
                <span>{item.start_date }</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">End</span>
                <span>{item.end_date }</span>
              </div>

              {item.published_date && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Published</span>
                  <span className="text-gray-700">{item.published_date}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agm;
