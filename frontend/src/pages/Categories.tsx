    import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/menu';
import { getCategoryEmoji } from '../utils/categoryEmoji';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { Category } from '../types';

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
      <p className="mt-1 text-gray-500">Pick a category to see its dishes.</p>

      {loading && <p className="py-16 text-center text-gray-500">Loading...</p>}
      {error && <p className="py-16 text-center font-medium text-red-600">{error}</p>}
      {!loading && !error && categories.length === 0 && (
        <p className="py-16 text-center text-gray-500">No categories yet.</p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/menu?category=${encodeURIComponent(c.name)}`}
            className="group rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-4xl">
              {getCategoryEmoji(c.name)}
            </div>
            <h2 className="mt-4 text-lg font-bold text-gray-900">{c.name}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {c.description ?? 'Delicious dishes'}
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-brand-600 group-hover:underline">
              View dishes →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Categories;