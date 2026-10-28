import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/getErrorMessage';

interface LoginForm {
  email: string;
  password: string;
}

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500';

function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  if (user) return <Navigate to={from} replace />;

  const onSubmit = async (values: LoginForm) => {
    try {
      await login(values.email, values.password);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">Log in to order your favourite food.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className={inputClass}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className={inputClass}
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          New here?{' '}
          <Link to="/register" className="font-semibold text-brand-600">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;