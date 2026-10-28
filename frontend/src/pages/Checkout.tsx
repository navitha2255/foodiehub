import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createAddress, getAddresses, type AddressPayload } from '../api/addresses';
import { createOrder } from '../api/orders';
import { useCart } from '../hooks/useCart';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { Address } from '../types';

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500';

function Checkout() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressPayload>();

  useEffect(() => {
    getAddresses()
      .then((list) => {
        setAddresses(list);
        setSelectedId(list[0]?.id ?? null);
        setShowForm(list.length === 0);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  const onAddAddress = async (values: AddressPayload) => {
    try {
      const created = await createAddress(values);
      setAddresses((prev) => [created, ...prev]);
      setSelectedId(created.id);
      setShowForm(false);
      reset();
      toast.success('Address saved');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const placeOrder = async () => {
    if (!selectedId) {
      toast.error('Please select or add a delivery address');
      return;
    }
    setPlacing(true);
    try {
      await createOrder({
        addressId: selectedId,
        items: cart.items.map((item) => ({ foodId: item.foodId, quantity: item.quantity })),
      });
      toast.success('Order placed! Pay cash on delivery.');
      navigate('/my-orders');
      await refreshCart(); // the backend already removed the items
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <Link
          to="/menu"
          className="mt-6 inline-block rounded-full bg-brand-600 px-8 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  const field = (label: string, name: keyof AddressPayload, rules: object = {}) => (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        className={inputClass}
        {...register(name, { required: `${label} is required`, ...rules })}
      />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Delivery address</h2>

            {loading && <p className="mt-4 text-sm text-gray-500">Loading...</p>}

            <div className="mt-4 space-y-3">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className={`flex cursor-pointer gap-3 rounded-xl border p-4 text-sm ${
                    selectedId === a.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedId === a.id}
                    onChange={() => setSelectedId(a.id)}
                    className="mt-1 accent-brand-600"
                  />
                  <span>
                    <span className="block font-semibold text-gray-900">
                      {a.fullName} · {a.phone}
                    </span>
                    <span className="text-gray-600">
                      {a.addressLine}, {a.city}, {a.state} {a.postalCode}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {!showForm && !loading && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-sm font-semibold text-brand-600 hover:underline"
              >
                + Add new address
              </button>
            )}

            {showForm && (
              <form
                onSubmit={handleSubmit(onAddAddress)}
                noValidate
                className="mt-5 grid gap-4 sm:grid-cols-2"
              >
                {field('Full name', 'fullName')}
                {field('Phone', 'phone', {
                  pattern: { value: /^[0-9+\-\s]{7,15}$/, message: 'Enter a valid phone number' },
                })}
                <div className="sm:col-span-2">{field('Address', 'addressLine')}</div>
                {field('City', 'city')}
                {field('State', 'state')}
                {field('Postal code', 'postalCode', {
                  maxLength: { value: 10, message: 'At most 10 characters' },
                })}
                <div className="flex items-end gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                  >
                    {isSubmitting ? 'Saving...' : 'Save address'}
                  </button>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Payment</h2>
            <p className="mt-2 text-sm text-gray-600">
              Cash on Delivery. You pay when the food arrives.
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2">
                <span className="text-gray-700">
                  {item.food.name} × {item.quantity}
                </span>
                <span>₹{(item.food.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-3 font-bold">
            <span>Total</span>
            <span className="text-brand-600">₹{cart.subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={placeOrder}
            disabled={placing}
            className="mt-6 w-full rounded-full bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {placing ? 'Placing order...' : 'Place order'}
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">
            The final amount is confirmed by the server.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;