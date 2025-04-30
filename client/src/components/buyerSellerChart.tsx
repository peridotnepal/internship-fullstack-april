"use client";
import type React from "react";
import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Image from "next/image";

interface BrokerStocksData {
  symbol: string;
  totalAmount: number;
  units: number;
}

interface StockData {
  contractQuantity: number;
  brokerName: string;
  brokerId: string;
  contractAmount: number;
}

interface BuyerSellerData {
  topBuyer: BrokerStocksData[];
  topseller: BrokerStocksData[];
}

interface chartProps {
  chartData: BuyerSellerData[];
  isTopFiveLoading: boolean;
  displayMode: "buyer" | "seller";
  selectedBroker: string;
  selectedStockName: string;
  topStockBuyingSellingBrokers: StockData[];
  activeTab: "broker" | "stocks";
  selectedCompany: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const BuyerSellerDonutChart: React.FC<chartProps> = ({
  chartData,
  isTopFiveLoading,
  displayMode,
  selectedBroker,
  selectedStockName,
  topStockBuyingSellingBrokers,
  activeTab,
  selectedCompany,
}) => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({});

  useEffect(() => {
    if (!isTopFiveLoading && (chartData || topStockBuyingSellingBrokers)) {
      let chartTitle: string;
      let chartSubtitle: string;
      let seriesData: any[] = [];

      // Define gradient colors for buyers and sellers
      const buyerGradients = [
        ["#00E676", "#00C853"], // Bright green to darker green
        ["#1DE9B6", "#00BFA5"], // Teal green variations
        ["#64FFDA", "#00B8D4"], // Aqua variations
        ["#18FFFF", "#00E5FF"], // Cyan variations
        ["#40C4FF", "#0091EA"], // Light blue to blue
      ];
      
      const sellerGradients = [
        ["#FF1744", "#D50000"], // Bright red to darker red
        ["#FF5252", "#FF1744"], // Red variations
        ["#FF8A80", "#FF5252"], // Light red variations
        ["#FF80AB", "#FF4081"], // Pink variations
        ["#EA80FC", "#AA00FF"], // Purple variations
      ];

      if (activeTab === "broker") {
        // Handle broker tab data (existing functionality)
        const { topBuyer, topseller } = chartData as unknown as BuyerSellerData;

        if (displayMode === "buyer") {
          chartTitle = "Top 5 Market Buyers";
          seriesData = topBuyer.map((item, index) => ({
            name: `${item.symbol} (${formatNumber(item.totalAmount)}, ${
              item.units
            } units)`,
            y: item.totalAmount,
            custom: {
              symbol: item.symbol,
              units: item.units,
            },
            color: {
              radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
              stops: [
                [0, buyerGradients[index % buyerGradients.length][0]],
                [1, buyerGradients[index % buyerGradients.length][1]],
              ],
            },
          }));
        } else {
          chartTitle = "Top 5 Market Sellers";
          seriesData = topseller.map((item, index) => ({
            name: `${item.symbol} (${formatNumber(item.totalAmount)}, ${
              item.units
            } units)`,
            y: item.totalAmount,
            custom: {
              symbol: item.symbol,
              units: item.units,
            },
            color: {
              radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
              stops: [
                [0, sellerGradients[index % sellerGradients.length][0]],
                [1, sellerGradients[index % sellerGradients.length][1]],
              ],
            },
          }));
        }

        chartSubtitle = `${selectedBroker}`;
      } else {
        // Handle stocks tab data (new functionality)
        if (displayMode === "buyer") {
          chartTitle = "Top Brokers Buying";
          chartSubtitle = `${selectedStockName}`;
        } else {
          chartTitle = "Top Brokers Selling";
          chartSubtitle = `${selectedStockName}`;
        }

        // Use topStockBuyingSellingBrokers data for stocks tab
        seriesData = topStockBuyingSellingBrokers.map((item, index) => ({
          name: `${item.brokerName} (${formatNumber(item.contractAmount)}, ${
            item.contractQuantity
          } units)`,
          y: item.contractAmount,
          custom: {
            brokerName: item.brokerName,
            contractQuantity: item.contractQuantity,
          },
          color: {
            radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
            stops: [
              [
                0,
                displayMode === "buyer"
                  ? buyerGradients[index % buyerGradients.length][0]
                  : sellerGradients[index % sellerGradients.length][0],
              ],
              [
                1,
                displayMode === "buyer"
                  ? buyerGradients[index % buyerGradients.length][1]
                  : sellerGradients[index % sellerGradients.length][1],
              ],
            ],
          },
        }));
      }

      setChartOptions({
        chart: {
          type: "pie",
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, "#121212"],
              [1, "#202040"],
            ],
          },
          style: {
            fontFamily: "'Poppins', Arial, sans-serif",
            color: "#E0E0E0",
          },
          borderRadius: 12,
          shadow: {
            color: "rgba(0, 0, 0, 0.3)",
            offsetX: 0,
            offsetY: 5,
            width: 10,
          },
        },
        title: {
          text: chartTitle,
          style: {
            fontSize: "22px",
            fontWeight: "bold",
            color: "#FFFFFF",
            textTransform: "uppercase",
            textShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
          },
          align: "center",
          margin: 20,
        },
        subtitle: {
          text: chartSubtitle,
          style: {
            fontSize: "16px",
            color: "#BDBDBD",
            fontStyle: "italic",
          },
          align: "center",
        },
        tooltip: {
          pointFormat:
            activeTab === "broker"
              ? '<div style="padding:10px"><span style="font-size:14px;font-weight:bold;color:{point.color}">{point.custom.symbol}</span><br><span style="font-size:12px">Amount: <b>{point.y:,.0f}</b></span><br><span style="font-size:12px">Units: <b>{point.custom.units}</b></span></div>'
              : '<div style="padding:10px"><span style="font-size:14px;font-weight:bold;color:{point.color}">{point.custom.brokerName}</span><br><span style="font-size:12px">Amount: <b>{point.y:,.0f}</b></span><br><span style="font-size:12px">Units: <b>{point.custom.contractQuantity}</b></span></div>',
          backgroundColor: "rgba(25, 25, 35, 0.9)",
          borderWidth: 0,
          borderRadius: 8,
          shadow: true,
          style: {
            color: "#E0E0E0",
            fontSize: "12px",
          },
          useHTML: true,
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            borderWidth: 2,
            borderColor: "#121212",
            dataLabels: {
              enabled: true,
              format:
                activeTab === "broker"
                  ? "<b>{point.custom.symbol}</b><br>{point.percentage:.1f}%"
                  : "<b>{point.custom.brokerName}</b><br>{point.percentage:.1f}%",
              style: {
                fontSize: "13px",
                fontWeight: "bold",
                color: "#FFFFFF",
                textOutline: "2px rgba(25, 25, 35, 0.8)",
              },
              distance: 20,
              filter: {
                property: "percentage",
                operator: ">",
                value: 4,
              },
            },
            showInLegend: true,
            size: "75%",
            innerSize: "50%",
            center: ["50%", "50%"],
          },
        },
        legend: {
          enabled: true,
          layout: "horizontal",
          align: "center",
          verticalAlign: "bottom",
          itemStyle: {
            fontSize: "12px",
            fontWeight: "bold",
            color: "#E0E0E0",
          },
          itemHoverStyle: {
            color: "#FFFFFF",
          },
          itemMarginTop: 5,
          itemMarginBottom: 5,
          symbolRadius: 4,
          symbolWidth: 12,
          symbolHeight: 12,
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            name: displayMode === "buyer" ? "Top Buyers" : "Top Sellers",
            type: "pie",
            data: seriesData,
            size: "75%",
            innerSize: "45%",
            center: ["50%", "50%"],
            shadow: {
              color:
                displayMode === "buyer"
                  ? "rgba(0, 255, 120, 0.2)"
                  : "rgba(255, 0, 80, 0.2)",
              width: 10,
              offsetX: 0,
              offsetY: 0,
            },
            animation: {
              duration: 1000,
            },
          },
        ],
      });
    }
  }, [
    chartData,
    isTopFiveLoading,
    displayMode,
    activeTab,
    topStockBuyingSellingBrokers,
    selectedBroker,
    selectedStockName,
  ]);

  if (isTopFiveLoading) {
    return (
      <div className="flex justify-center items-center h-full bg-gradient-to-b from-gray-900 to-black rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400 mb-2"></div>
          <span className="text-gray-300 font-medium">
            Loading market data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 rounded-xl shadow-2xl p-6 border border-gray-800">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
          Market Activity Dashboard
        </h2>
        <p className="text-sm text-gray-400 mt-2 italic">
          {activeTab === "broker"
            ? `${
                displayMode === "buyer" ? "Top Buyers" : "Top Sellers"
              } by Volume and Transaction Value`
            : `${
                displayMode === "buyer" ? "Top Buying" : "Top Selling"
              } Brokers for ${selectedStockName}`}
        </p>
      </div>

      {Object.keys(chartOptions).length > 0 && (
        <div className="w-full bg-gradient-to-b from-zinc-900 to-black p-4 rounded-xl border border-gray-800 shadow-inner">
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            containerProps={{
              className: "w-full",
              style: {
                height: "500px",
                width: "100%",
                margin: "0 auto",
              },
            }}
          />
        </div>
      )}

      <div className="mt-6 px-5 flex justify-between items-center">
        <div className="flex gap-2">
          <Image
            className="rounded-full"
            src={`/${selectedCompany}.webp`}
            alt="logo"
            height={30}
            width={30}
          />
          <p
            className={`text-[14px] font-semibold font-sans bg-clip-text text-transparent bg-gradient-to-br ${
              selectedCompany === "PortfolioNepal"
                ? "from-[#FFD700] via-[#FFA500] to-[#B8860B]"
                : "from-green-400 to-pink-400"
            }`}
          >{`${selectedCompany}`}</p>
        </div>
        <div className="text-xs text-gray-400 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
          Data as of{" "}
          <span className="font-semibold text-teal-400">
            {new Date().toLocaleDateString()}
          </span>{" "}
          •
          <span className="ml-2 text-xs text-gray-500">Updated every hour</span>
        </div>
      </div>
    </div>
  );
};

export default BuyerSellerDonutChart;
