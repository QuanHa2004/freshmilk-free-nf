import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './styles/index.css'
import AppRoutes from './routes/app-routes';
import { CartProvider } from './context/cart-context.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  </CartProvider>
);
