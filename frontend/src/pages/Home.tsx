import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import CategoryList from '../components/CategoryList';
import FoodCard from '../components/FoodCard';
import { getCategories, getFoods } from '../api/menu';
import type { Category, Food } from '../types';

function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getCategories(), getFoods({ sort: 'rating', limit: 4 })])
      .then(([cats, result]) => {
        setCategories(cats);
        setFoods(result.foods);
      })
      .catch((err) => {
  console.error(err);
  setError('Could not load data: ' + (err?.message ?? 'unknown error'));
})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero />
      {loading && <p className="py-10 text-center text-gray-500">Loading...</p>}
      {error && <p className="py-10 text-center font-medium text-red-600">{error}</p>}
      {!loading && !error && (
        <>
          <CategoryList categories={categories} />
          <section className="mx-auto max-w-6xl px-4 pb-14">
            <h2 className="text-2xl font-bold text-gray-900">Popular dishes</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {foods?.map((food) => (
                <FoodCard key={food?.id} food={food} />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default Home;