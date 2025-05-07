const puppeteer = require('puppeteer');

const downloadPdf = async (req, res) => {
  const { advisoryContent, fileName } = req.body;

  if (!advisoryContent) return res.status(400).send('No HTML content provided');

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(advisoryContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${fileName}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {downloadPdf}