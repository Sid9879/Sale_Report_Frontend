import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import  jsPDF  from 'jspdf';
import html2canvas from 'html2canvas';

export default function PrintPage() {
  const { state } = useLocation();
  const printRef = useRef();
  const [data, setData] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (state) {
      setData(state);
      const randomInvoice = 'INV-' + Math.floor(100000 + Math.random() * 900000);
      setInvoiceNumber(randomInvoice);
    }
  }, [state]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Function to download PDF using jsPDF and html2canvas
  const downloadPDF = async () => {
    const input = printRef.current;
    html2canvas(input).then((canvas)=>{
        const pdf = new jsPDF('p','mm', 'a4',true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeigh();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth/imgWidth , pdfHeight/imgHeight);
        const imgX = (pdfWidth-imgWidth*ratio)/2;
        const imgY = 30;
        pdf.addImage(ImageData,'PNG',imgX,imgWidth*ratio,imgHeight*ratio);
        pdf.save('invoice.pdf');
    })
   
  };

  if (!data) return <p className="text-center text-lg mt-10">Loading Invoice...</p>;

  return (
    <div className="p-6 bg-gray-100 text-black min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow" ref={printRef}>
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold uppercase text-blue-700">Om</h1>
          <p className="text-sm text-gray-600">Sales Invoice</p>
        </div>

        {/* Invoice details */}
        <div className="mb-4 text-sm">
          <p><strong>Invoice No:</strong> {invoiceNumber}</p>
          <p><strong>Date:</strong> {currentTime.toLocaleDateString()}</p>
          <p><strong>Time:</strong> {currentTime.toLocaleTimeString()}</p>
          <p><strong>Customer:</strong> {data.customer?.name} | <strong>Mobile:</strong> {data.customer?.phoneNumber}</p>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border mb-6 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Product</th>
              <th className="border px-2 py-1">Size</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.todaySale?.map((item, index) => (
              <tr key={index}>
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                <td className="border px-2 py-1">{item?.title}</td>
                <td className="border px-2 py-1">{item?.size}</td>
                <td className="border px-2 py-1 text-center">{item?.quantity}</td>
                <td className="border px-2 py-1 text-right">₹{item?.price}</td>
                <td className="border px-2 py-1 text-right">₹{item?.price * item?.quantity}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" className="border text-right px-2 py-1 font-bold">Total</td>
              <td className="border px-2 py-1 text-right font-bold">₹{data.Amount}</td>
            </tr>
          </tfoot>
        </table>

        {/* Footer note */}
        <div className="mt-6 border-t pt-4 text-sm text-gray-600 text-center">
          <p><strong>Jurisdiction:</strong> GKP only</p>
          <p className="italic">Once sold, items cannot be returned.</p>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={downloadPDF}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
