import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import logo from '../assets/logo.png'
import sidsign from '../assets/sidsign.jpg'

export default function PrintPage() {
  const { state } = useLocation();
  const printRef = useRef();
  const [data, setData] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (state) {
      setData(state);
      const randomInvoice = "INV-" + Math.floor(100000 + Math.random() * 900000);
      setInvoiceNumber(randomInvoice);
    }
  }, [state]);

  useEffect(() => {
    setCurrentTime(new Date());
    setTimeout(() => window.print(), 1000); // Delay to ensure render
  }, []);

  if (!data) return <p className="text-center mt-8">Loading Invoice...</p>;

  return (
    <div
      ref={printRef}
      className=" w-full p-5 font-sans text-black bg-white hidden print:block"
    >
      {/* Header */}
      <div className="text-center mb-5">
        <img
          src={logo}
          alt="Logo"
          className="mb-1 mx-auto w-[100px] h-[100px]"
        />
        <h1 className="text-2xl font-bold text-blue-800">Om Agro Center</h1>
        <p className="text-sm">Gorakhpur, Uttar Pradesh - 273306</p>
        <p className="text-sm">Phone: 7394090894 | GSTIN: XX-XXXXXXXXXX</p>
      </div>

      {/* Invoice Info */}
      <div className="text-sm mb-4">
        <p><strong>Invoice No:</strong> {invoiceNumber}</p>
        <p><strong>Date:</strong> {currentTime.toLocaleDateString()} | <strong>Time:</strong> {currentTime.toLocaleTimeString()}</p>
        <p><strong>Customer:</strong> {data.customer?.name} | <strong>Mobile:</strong> {data.customer?.phoneNumber}</p>
      </div>

      {/* Product Table */}
      <table className="w-full border border-gray-300 text-sm mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className={th}>Sr.No.</th>
            <th className={th}>Product</th>
            <th className={th}>Size</th>
            <th className={th}>Qty</th>
            <th className={th}>Price</th>
            <th className={th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.todaySale?.map((item, index) => (
            <tr key={index}>
              <td className={tdCenter}>{index + 1}</td>
              <td className={td}>{item.title}</td>
              <td className={td}>{item.size}</td>
              <td className={tdCenter}>{item.quantity}</td>
              <td className={tdRight}>₹{item.price}</td>
              <td className={tdRight}>₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5" className={`${tdRight} font-bold`}>Total</td>
            <td className={`${tdRight} font-bold`}>₹{data.Amount}</td>
          </tr>
        </tfoot>
      </table>

      {/* QR & Signature */}
      <div className="flex justify-between mt-10">
        <div>
          <p className="text-xs mb-1">Scan QR for invoice info:</p>
          <QRCode
            value={`Invoice No: ${invoiceNumber}\nAmount: ₹${data.Amount}`}
            size={80}
          />
        </div>

        <div className="text-right">
          <div className="w-36 ml-auto">
            <img className="w-[150px] h-[30px]" src={sidsign} alt="sign" />
          </div>
          <p className="text-xs mb-12">Authorized Signature</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-10 text-xs border-t border-gray-300 pt-2">
        <p>Thank you for your business!</p>
        <p><strong>Jurisdiction:</strong> Gorakhpur only | <em>No return after sale</em></p>
      </div>
    </div>
  );
}

const th = "border border-gray-300 px-2 py-1 text-left";
const td = "border border-gray-300 px-2 py-1";
const tdCenter = `${td} text-center`;
const tdRight = `${td} text-right`;
