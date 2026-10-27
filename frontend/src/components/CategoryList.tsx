import { Link } from 'react-router-dom';
import type { Category } from '../types';
import { getCategoryEmoji } from '../utils/categoryEmoji';

interface Props {
  categories: Category[];
}

function CategoryList({ categories }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="text-2xl font-bold text-gray-900">Browse by category</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((c) => (
          <Link
            key={c.id}
           to={`/menu?category=${encodeURIComponent(c.name)}`}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
           <span className="text-4xl">{getCategoryEmoji(c.name)}</span>
            <span className="text-sm font-semibold text-gray-700">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryList;