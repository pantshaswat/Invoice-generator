const PDFDocument = require('pdfkit');
const fs = require('fs');
const moment = require('moment');

module.exports = function createInvoice(invoice, companyInfo, footerInfo, path) {
  let doc = new PDFDocument({ margin: 50 });

  generateHeader(doc, companyInfo, invoice);
  generateCustomerInformation(doc, companyInfo, invoice);
  generateInvoiceTable(doc, invoice, companyInfo);
  generateFooter(doc, companyInfo,footerInfo);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc, companyInfo, invoice) {
  doc
    .image(companyInfo.logoPath, 50, 45, { width: 50 })
    .fillColor('#444444')
    .fontSize(20)
    .text(companyInfo.name, 50, 85)
    .fontSize(10)
    .fillColor('gray')
    .text(companyInfo.baseAddress, 50, 110)
    .text(companyInfo.generalAddress, 50, 123)
    .text(companyInfo.contactNumber, 50, 136)
    .fontSize(20)
    .fillColor('#444444')
    .text('Invoice', 200, 50, { align: 'right' })
    .fontSize(10)
    .fillColor('gray')
    .text('INVOICE NO.' + invoice.invoiceNumber, 200, 70, { align: 'right' })
    .text(moment(invoice.date).format("Do MMMM YYYY"), 200, 80, { align: 'right' })
    .moveDown();
}

function generateCustomerInformation(doc, companyInfo, invoice) {
  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text(`TO: ${invoice.clientName}`, 50, customerInformationTop)
    .text(`Service Date: ${moment(invoice.serviceDate).format("Do MMMM YYYY")}`, 50, customerInformationTop + 30)
    .text(`FOR: ${companyInfo.companyService}`, 300, customerInformationTop)
    .text(`Address: ${invoice.clientAddress}`, 300, customerInformationTop + 30)
    .moveDown();

  generateHr(doc, 245);
}

function generateInvoiceTable(doc, invoice, companyInfo) {
  const invoiceTableTop = 300;
  const pageTopMargin = 60;
  let position = invoiceTableTop;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    position,
    'Name',
    'Quantity',
    'Unit Cost',
    'Total',
  );
  generateHr(doc, position + 20);
  doc.font('Helvetica');

  for (let i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    position += 30;

    if (position > doc.page.height - 100) {
      addNewPage(doc, companyInfo);
      position = pageTopMargin + 20; // Reset position for new page
    }

    generateTableRow(
      doc,
      position,
      item.name,
      item.quantity,
      `${companyInfo.currencySymbol} ${item.amount}`,
      `${companyInfo.currencySymbol} ${item.quantity * item.amount}`
    );
    generateHr(doc, position + 20);
  }
    // Adjust position after the last item row for the summary section
  position += 30;

  const subtotalPosition = position + 30;
  if (subtotalPosition > doc.page.height - 100) {
    addNewPage(doc, companyInfo);
    position = pageTopMargin ;
  }

  generateSummary(doc, companyInfo, invoice, position);
}

function addNewPage(doc, companyInfo) {
  doc.addPage();
  doc.font('Helvetica-Bold')
  .fillColor('gray');
  generateTableRow(
    doc,
    50,
    'Name',
    'Quantity',
    'Unit Cost',
    'Total'
  );
  generateHr(doc, 70);
  doc.font('Helvetica');
}

function generateSummary(doc, companyInfo, invoice, position) {
  generateTableRow(
    doc,
    position,
    '',
    '',
    'SUBTOTAL',
    `${companyInfo.currencySymbol} ${invoice.totalCalculation.subtotal}`
  );

  const discountPosition = position + 20;
  generateTableRow(
    doc,
    discountPosition,
    '',
    '',
    `DISCOUNT (${invoice.totalCalculation.discount}%)`,
    `${companyInfo.currencySymbol} ${invoice.totalCalculation.discountedAmount}`
  );

  const gstPosition = discountPosition + 20;
  generateTableRow(
    doc,
    gstPosition,
    '',
    '',
    `GST (${invoice.totalCalculation.gst}%)`,
    `${companyInfo.currencySymbol} ${invoice.totalCalculation.gstAmount}`
  );

  const totalPosition = gstPosition + 20;
  tableBottomPosition = totalPosition;
  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    totalPosition,
    '',
    '',
    'TOTAL',
    `${companyInfo.currencySymbol} ${invoice.totalCalculation.total}`
  );
  doc.font('Helvetica');
}

function generateFooter(doc, companyInfo,footerInfo) {
  const footerMargin = 150;
  if (tableBottomPosition > doc.page.height - footerMargin) {
    doc.addPage();
    tableBottomPosition = 50;
  }

  doc
    .fontSize(10)
    .fillColor('gray')
    for (let i = 0; i < footerInfo.length; i++) {
        if(footerInfo[i]['label'] === 'Email:'){
            doc.text(`${footerInfo[i]['label']} ${footerInfo[i]['value']}`, 50, tableBottomPosition + 20 + i*15, {link: `mailto:${footerInfo[i]['link']}`})
        }

      doc.text(`${footerInfo[i]['label']} ${footerInfo[i]['value']}`, 50, tableBottomPosition + 20 + i*15) // arithmetic sequence starting from 20 and diff 15 to space out the footer
    }
    doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .text(
      'Thank you for your business.',
      50,
      tableBottomPosition + 120,
      { align: 'center', width: 500 }
    );
}

function generateTableRow(doc, y, item, quantity, unitCost, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(quantity, 180, y, { width: 90, align: 'right' })
    .text(unitCost, 300, y, { width: 90, align: 'right' })
    .text(lineTotal, 370, y, { width: 90, align: 'right' });
}

function generateHr(doc, y) {
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}
