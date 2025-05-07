const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const addAdvisory = async (req, res) => {
  try {
    const {
      selectedSector: sector,
      fromDate,
      toDate,
      htmlContent,
      selectedStockDetails: stocks,
    } = req.body;

    const advisory = await prisma.stockAdvisory.create({
      data: {
        sector,
        fromDate,
        toDate,
        htmlContent,
        stocks: {
          create: stocks.map((stock) => ({
            symbol: stock.symbol,
            companyName: stock.companyName,
          })),
        },
      },
    });

    res.status(201).json({ message: "Advisory added successfully", advisory });
  } catch (error) {
    console.error("Error adding advisory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { addAdvisory };