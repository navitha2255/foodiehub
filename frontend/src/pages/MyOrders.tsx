import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cancelOrder, getMyOrders } from '../api/orders';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { Order, OrderStatus } from '../types';

const statusStyles: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Preparing: 'bg-purple-100 text-purple-800',
  'Out for Delivery': 'bg-orange-100 text-orange-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const canCancel = (status: OrderStatus) => status === 'Pending' || status === 'Confirmed';

function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Cancel this order?')) return;
    setCancellingId(id);
    try {
      const updated = await cancelOrder(id);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

      {loading && <p className="py-16 text-center text-gray-500">Loading...</p>}
      {error && <p className="py-16 text-center font-medium text-red-600">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-gray-500">You have not placed any orders yet.</p>
          <Link
            to="/menu"
            className="mt-4 inline-block rounded-full bg-brand-600 px-6 py-2 font-semibold text-white hover:bg-brand-700"
          >
            Browse menu
          </Link>
        </div>
      )}

      <div className="mt-6 space-y-5">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900">Order #{order.id}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
              >
                {order.status}
              </span>
            </div>

            <ul className="mt-4 divide-y divide-gray-100">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-100">
                    {item.food?.imageUrl && (
                      <img
                        src={item.food.imageUrl}
                        alt={item.food.name}
                        className="h-full w-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                  </div>
                  <span className="flex-1 text-sm text-gray-800">
                    {item.food?.name ?? 'Item'} × {item.quantity}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            {order.address && (
              <p className="mt-3 text-xs text-gray-500">
                Deliver to: {order.address.fullName}, {order.address.addressLine},{' '}
                {order.address.city}, {order.address.state} {order.address.postalCode}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <p className="font-bold text-gray-900">
                Total: <span className="text-brand-600">₹{Number(order.totalAmount).toFixed(2)}</span>
              </p>
              {canCancel(order.status) && (
                <button
                  onClick={() => handleCancel(order.id)}
                  disabled={cancellingId === order.id}
                  className="rounded-full border border-red-500 px-4 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  {cancellingId === order.id ? 'Cancelling...' : 'Cancel order'}
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-400">Payment: Cash on Delivery</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;