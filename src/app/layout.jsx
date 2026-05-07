'use client';
import React from 'react';
import Header from './components/Header';
import { Web3Provider } from '../context/Web3Context';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Decentralized crowdfunding platform powered by Web3" />
        <link rel="icon" href="/crowdfunding.svg" sizes="any" />
        <link rel="icon" type="image/png" href="/crowdfunding.svg" />
        <link rel="apple-touch-icon" href="/crowdfunding.svg" />
      </head>
      <body className="bg-white text-black">
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "rpq9qoqysb");`,
          }}
        />
        <Web3Provider>
          <Header />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontSize: '16px',
                fontWeight: '500',
                textAlign: 'center',
              },
              success: {
                duration: 4000,
                theme: {
                  primary: 'green',
                  secondary: 'white',
                },
              },
              error: {
                duration: 5000,
                theme: {
                  primary: 'red',
                  secondary: 'white',
                },
              },
            }}
          />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
