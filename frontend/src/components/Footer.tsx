import { UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-10 bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold text-white">
            <UtensilsCrossed size={24} className="text-brand-500" /> FoodieHub
          </div>
          <p className="mt-3 text-sm text-gray-400">
            Fresh, hot and tasty food delivered fast.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Quick links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/menu" className="hover:text-brand-500">Menu</Link></li>
            <li><Link to="/my-orders" className="hover:text-brand-500">My Orders</Link></li>
            <li><Link to="/login" className="hover:text-brand-500">Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Contact</h4>
          <p className="mt-3 text-sm text-gray-400">support@foodiehub.example</p>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} FoodieHub. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;