import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, ShoppingCart, UtensilsCrossed, X } from 'lucide-react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/categories', label: 'Categories' },
  { to: '/my-orders', label: 'My Orders' },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition hover:text-brand-600 ${
      isActive ? 'text-brand-600' : 'text-gray-600'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-600">
          <UtensilsCrossed size={26} />
          FoodieHub
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative rounded-full p-2 text-gray-700 hover:bg-brand-100">
            <ShoppingCart size={22} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs text-white">
              0
            </span>
          </Link>
          <Link to="/login" className="hidden text-sm font-medium text-gray-700 hover:text-brand-600 sm:block">
            Login
          </Link>
          <Link
            to="/register"
            className="hidden rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 sm:block"
          >
            Register
          </Link>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="flex flex-col gap-4 border-t bg-white px-4 py-4 md:hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-gray-700">
            Login
          </Link>
          <Link to="/register" onClick={() => setOpen(false)} className="text-sm font-medium text-brand-600">
            Register
          </Link>
        </nav>
      )}
    </header>
  );
}

export default Navbar;