"use client";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

const UpiQrGenerator = ({ upiId, amount, name = "", merchantCode = "" }) => {
  const [qrValue, setQrValue] = useState("");
  const [isUpiValid, setIsUpiValid] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Validate UPI ID format
    const isValid = upiId && upiId.includes('@');
    setIsUpiValid(isValid);

    if (isValid) {
      // Build UPI payment URL with all parameters
      let upiUrl = `upi://pay?pa=${upiId}`;
      
      if (name) upiUrl += `&pn=${encodeURIComponent(name)}`;
      if (amount && !isNaN(parseFloat(amount))) upiUrl += `&am=${amount}`;
      if (merchantCode) upiUrl += `&mc=${merchantCode}`;
      
      // Add currency (INR by default)
      upiUrl += `&cu=INR`;
      
      setQrValue(upiUrl);
    }
  }, [upiId, amount, name, merchantCode]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isUpiValid) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center">
        Invalid UPI ID format. Please use format: username@provider
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
        <QRCodeSVG 
          value={qrValue}
          size={240}
          fgColor="#000000"
          bgColor="#ffffff"
          level="H"
          includeMargin={true}
        />
      </div>
      
      <div className="mt-4 w-full">
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <span className="font-medium text-gray-700">{upiId}</span>
          <button 
            onClick={handleCopyUpi}
            className="bg-[#3247C5] text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        
        <div className="text-sm text-gray-500 mt-2 text-center">
          Scan with any UPI app to pay
        </div>
      </div>
    </div>
  );
};

export default UpiQrGenerator;