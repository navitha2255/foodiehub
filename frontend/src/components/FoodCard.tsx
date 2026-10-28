import { Plus, Star } from 'lucide-react';
import type { Food } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/getErrorMessage';

interface Props {
  food: Food;
}

function FoodCard({ food }: Props) {
    const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!user) {
      toast.error('Please log in to add items to your cart');
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    setAdding(true);
    try {
      await addItem(food.id);
      toast.success(`${food.name} added to cart`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setAdding(false);
    }
  };
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="h-44 bg-brand-100">
        <img
          src={food.imageUrl}
          alt={food.name}
          className="h-full w-full object-cover"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900">{food.name}</h3>
          <span className="flex items-center gap-1 text-sm font-medium text-amber-500">
            <Star size={14} fill="currentColor" /> {food.rating}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{food.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-brand-600">₹{food.price}</span>
                   <button
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center gap-1 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            <Plus size={16} /> {adding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;