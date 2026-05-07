'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only run client-side code after hydration
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error('MetaMask is required! Please Install MetaMask Extension');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      
      toast.success(`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
      
    } catch (error) {
      console.error('Wallet connection failed', error);
      
      // Handle user rejections differently
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        toast.error('You rejected the connection request');
      } else {
        toast.error('Wallet connection failed. Try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add wallet event listeners
  useEffect(() => {
    if (!mounted) return;
    
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const setupWalletEventListeners = () => {
      if (window.ethereum) {
        // Account changed event
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            const newAddress = accounts[0];
            setAccount(newAddress);
            toast.success(`Account changed: ${newAddress.slice(0, 6)}...${newAddress.slice(-4)}`);
          } else {
            // User disconnected all accounts
            setAccount(null);
            toast.info('Wallet disconnected');
          }
        });

        // Chain changed event
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      }
    };
    
    // Check if already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const address = accounts[0].address;
            setAccount(address);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    
    setupWalletEventListeners();
    checkConnection();
    
    // Cleanup event listeners on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [mounted]); // Only run this effect when component is mounted

  return (
    <Web3Context.Provider value={{ account, connectWallet, isLoading }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);