import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { getCategories, getFoods } from '../api/menu';
import type { Category, Food } from '../types';

function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? '';

  const [text, setText] = useState(search);
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    getFoods({
      search: search || undefined,
      category: category || undefined,
      sort: sort || undefined,
    })
      .then((result) => setFoods(result.foods))
      .catch(() => setError('Could not load food. Is the backend running?'))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update('search', text.trim());
          }}
          className="relative flex-1"
        >
          <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search food by name..."
            className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-brand-500"
          />
        </form>
        <select
          value={sort}
          onChange={(e) => update('sort', e.target.value)}
          className="rounded-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
        >
          <option value="">Sort: Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[{ id: 0, name: '' }, ...categories].map((c) => (
          <button
            key={c.id}
            onClick={() => update('category', c.name)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === c.name
                ? 'bg-brand-600 text-white'
                : 'bg-white text-gray-700 hover:bg-brand-100'
            }`}
          >
            {c.name || 'All'}
          </button>
        ))}
      </div>

      {loading && <p className="py-16 text-center text-gray-500">Loading...</p>}
      {error && <p className="py-16 text-center font-medium text-red-600">{error}</p>}
      {!loading && !error && foods.length === 0 && (
        <p className="py-16 text-center text-gray-500">No food found. Try another search.</p>
      )}
      {!loading && !error && foods.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Menu;