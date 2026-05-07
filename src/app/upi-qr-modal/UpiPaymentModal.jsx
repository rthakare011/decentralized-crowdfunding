"use client";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const UpiPaymentModal = ({ isOpen, onClose, upiId, campaignTitle }) => {
  const [amount, setAmount] = useState("");

  // Generate dynamic UPI payment link
  const generateUpiLink = () => {
    let baseLink = `upi://pay?pa=${upiId}`;
    if (campaignTitle) baseLink += `&pn=${encodeURIComponent(campaignTitle)}`;
    if (amount && !isNaN(parseFloat(amount))) baseLink += `&am=${amount}`;
    baseLink += "&cu=INR";
    return baseLink;
  };
  // Close modal on escape key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    
    window.addEventListener("keydown", handleEsc);
    
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle click outside modal to close
  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      onClose();
    }
  };

  // Handle copy UPI ID to clipboard
  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    alert("UPI ID copied to clipboard!");
  };

  if (!isOpen) return null;

  return (
    <div 
      id="modal-backdrop"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full mx-auto animate-fadeIn">
        <div className="bg-[#3247C5] text-white p-4">
          <h3 className="text-xl font-bold">Pay with UPI</h3>
        </div>
        
        <div className="p-6">
          <h4 className="text-lg font-semibold mb-2">Campaign: {campaignTitle}</h4>
          
          <div className="flex flex-col items-center justify-center my-6">
            <div className="mb-4 w-full">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="amount">
                Enter Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3247C5]"
                min="1"
                step="any"
              />
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-md">
              <QRCodeSVG 
                value={generateUpiLink()} 
                size={200} 
                fgColor="#000000"
                bgColor="#ffffff"
                level="H"
                includeMargin={true}
              />
            </div>
            
            <p className="mt-4 text-gray-600 text-center">
              Scan this QR code with any UPI app to contribute
            </p>
          </div>
          
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-4">
            <span className="font-medium text-gray-700">{upiId}</span>
            <button 
              onClick={copyUpiId}
              className="bg-[#3247C5] text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              Copy
            </button>
          </div>
          
          <div className="text-xs text-gray-500 text-center mb-4">
            QR code updates dynamically based on the amount entered
          </div>
          
          <div className="text-center mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpiPaymentModal;