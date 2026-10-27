import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function Hero() {
  return (
    <section className="bg-linear-to-br from-brand-100 to-brand-50">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="rounded-full bg-white px-4 py-1 text-sm font-medium text-brand-600 shadow-sm">
            🔥 Fast delivery in 30 minutes
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            Delicious food, <span className="text-brand-600">delivered</span> to your door
          </h1>
          <p className="mt-4 max-w-md text-gray-600">
            Order your favourite pizzas, burgers, biryani and more from the comfort of your home.
          </p>
          <Link
            to="/menu"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-700"
          >
            Order Now <ArrowRight size={18} />
          </Link>
        </div>

        <div className="flex aspect-square max-h-105 items-center justify-center overflow-hidden rounded-3xl bg-brand-500/20 shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80"
            alt="Delicious pizza"
            className="h-full w-full object-cover"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
         
        </div>
      </div>
    </section>
  );
}

export default Hero;