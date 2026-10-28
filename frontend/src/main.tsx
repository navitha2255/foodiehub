import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.tsx';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <BrowserRouter>
  <AuthProvider>
    <CartProvider>
      <App />
      <Toaster position="top-right" />
    </CartProvider>
  </AuthProvider>
</BrowserRouter>
  </StrictMode>,
);