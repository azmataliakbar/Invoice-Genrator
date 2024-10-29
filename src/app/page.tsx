"use client";

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF to include lastAutoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

const InvoicePage = () => {
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
  const [customerName, setCustomerName] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [amountGiven, setAmountGiven] = useState(0);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(newItems);
  };

  const calculateTotal = () =>
    items.reduce((total, item) => total + item.quantity * item.price, 0);

  const totalAmount = calculateTotal();
  const change = amountGiven - totalAmount > 0 ? (amountGiven - totalAmount).toFixed(2) : '0.00';

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add customer name and invoice date to the PDF
    doc.text(`Customer Name: ${customerName}`, 14, 10);
    doc.text(`Invoice Date: ${invoiceDate}`, 14, 20);

    // Prepare data for the PDF
    autoTable(doc, {
      head: [['Description', 'Quantity', 'Price', 'Total']],
      body: items.map(item => [
        item.description,
        item.quantity,
        item.price.toFixed(2),
        (item.quantity * item.price).toFixed(2),
      ]),
    });

    // Use lastAutoTable to position the summary text
    doc.text(`Invoice Total: Rs. ${totalAmount.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Amount Given: Rs. ${amountGiven.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(`Change to Return: Rs. ${change}`, 14, doc.lastAutoTable.finalY + 30);

    // Save the PDF
    doc.save('invoice.pdf');
  };

  return (
    <div className="max-w-full sm:max-w-2xl mx-auto p-4 sm:p-8 overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Invoice Generator</h1>

      {/* Customer and Invoice Date */}
      <div className="mb-4">
        <label className="block mb-2">
          Customer Name:
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 border rounded text-black font-bold"
          />
        </label>

        <label className="block">
          Invoice Date:
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            className="w-full p-2 border rounded text-black font-bold"
          />
        </label>
      </div>

      {/* Invoice Items */}
      <h2 className="text-lg sm:text-xl font-semibold mb-2">Items</h2>
      {items.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row sm:items-center mb-2 space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            placeholder="Description"
            value={item.description}
            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
            className="w-full p-2 border rounded text-black font-bold"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={item.quantity}
            min="1"
            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
            className="w-full sm:w-20 p-2 border rounded text-black font-bold"
          />
          <input
            type="number"
            placeholder="Price"
            value={item.price}
            min="0"
            onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
            className="w-full sm:w-24 p-2 border rounded text-black font-bold"
          />
          {/* Display Total Price for the item */}
          <div className="w-full sm:w-56 p-2 border rounded bg-gray-100 text-black font-bold text-center">
            Item Total: Rs. {(item.quantity * item.price).toFixed(2)}
          </div>
        </div>
      ))}

      {/* Add Item Button */}
      <button onClick={addItem} className="w-full sm:w-auto px-4 py-2 mt-2 bg-blue-500 text-white rounded">
        Add Item
      </button>

      {/* Amount Given by Customer */}
      <div className="mt-4">
        <label className="block mb-2">
          Amount Given (e.g., 10, 20, 50, 100, 500, 1000, 5000):
          <input
            type="number"
            value={amountGiven}
            onChange={(e) => setAmountGiven(parseFloat(e.target.value))}
            placeholder="Enter amount given by customer"
            className="w-full p-2 border rounded text-red-500 font-bold text-xl"
          />
        </label>
      </div>

      {/* Invoice Total and Change Calculation */}
      <div className="mt-4 border-t pt-4">
        <h2 className="text-lg sm:text-xl font-semibold text-green-400">Invoice Total: Rs. {totalAmount.toFixed(2)}</h2>
        <h2 className="text-base sm:text-xl font-bold text-yellow-300">
          Change to Return: Rs. {change}
        </h2>
      </div>

      {/* Generate PDF Button */}
      <button onClick={generatePDF} className="w-full sm:w-auto px-4 py-2 mt-4 bg-green-500 text-white rounded font-bold">
        Generate PDF
      </button>
      <h4 className="text-gray-500 mt-2 font-bold">Author: Azmat Ali</h4>
    </div>
  );
};

export default InvoicePage;
