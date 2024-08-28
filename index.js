const createInvoice = require('./pdfPage');

// dummy data to pass to the invoice
const companyInfo = {
  name: 'Sydney Shine',
  logoPath: 'sslogo.png',
  email: 'infosydneyshinefacility@gmail.com',
  abnNumber: '325325362',
  bsb: '0662184',
  accNumber: '12076185',
  accName: 'Sydney Shine pty. ltd.',
  baseAddress: 'U1701 588b-600',
  generalAddress: 'Hurstville, NSW, 2220',
  contactNumber:'0426262335, 0452327336',
  companyService: 'Cleaning Service',
  currencySymbol: '$'
}
const footerInfo =[
 {
    label: 'ABN NO.:',
    value: companyInfo.abnNumber
  },
 {
    label: 'Email:',
    value: companyInfo.email,
    link: `mailto:${companyInfo.email}`
  },
   {
    label: 'Contact:',
    value: companyInfo.contactNumber
  },
{
    label: 'BSB:',
    value: companyInfo.bsb
  },
   {
    label: 'Account No.:',
    value: companyInfo.accNumber
  },
   {
    label: 'Account name:',
    value: companyInfo.accName
  }
]
  
  



// Example usage
const invoice = {
  invoiceNumber: '2024-0001',
  clientName: 'John Doe',
  clientAddress: '2001, 456 Another St, Sydney, NSW ',

  date: new Date(),
  serviceDate: new Date(),
  subtotal: 80000,
  paid: 30000,
  items: [
    {
      name: '001',
      description: 'Service A',
      amount: 50000,
      quantity: 1
    },
    
    {
      name: '001',
      description: 'Service A',
      amount: 50000,
      quantity: 1
    },
    {
      name: '001',
      description: 'Service A',
      amount: 50000,
      quantity: 1
    },
        {
      name: '001',
      description: 'Service A',
      amount: 50000,
      quantity: 1
    },
    {
      name: '001',
      description: 'Service A',
      amount: 50000,
      quantity: 1
    },
  
    {
      name: '001',
      description: 'Service A',
      amount: 50000,
      quantity: 1
    },
    {
      name: '002',
      description: 'Service B',
      amount: 30000,
      quantity: 1
    },
    {
      name: '001',
      description: 'Service A',
      amount: 50000,
      quantity: 1
    },
    {
      name: '002',
      description: 'Service B',
      amount: 30000,
      quantity: 1
    },
    {
      name: '001',
      description: 'Service A',
      amount: 50000,
      quantity: 1
    },
    {
      name: '002',
      description: 'Service B',
      amount: 30000,
      quantity: 1
    },
    {
      name: '001',
      description: 'Service A',
      amount: 50000,
      quantity: 1
    },
    {
      name: '002',
      description: 'Service B',
      amount: 30000,
      quantity: 1
    },
    {
      name: '003',
      description: 'Service C',
      amount: 30000,
      quantity: 3
    }
  ],
  totalCalculation:{
    subtotal: 170000,
    discount: 10,
    discountedAmount: 17000,
    gst: 10,
    gstAmount: 3245,
    total: 15000,
  }
};

createInvoice(invoice,companyInfo,footerInfo,'invoice.pdf')