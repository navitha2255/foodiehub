import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/getErrorMessage';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const inputClass =
  'mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500';

function Register() {
  const { user, register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  if (user) return <Navigate to="/" replace />;

  const onSubmit = async (values: RegisterForm) => {
    try {
      await registerUser({ name: values.name, email: values.email, password: values.password });
      toast.success('Account created!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">Join us and start ordering.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <div>
            <label className="text-sm font-medium text-gray-700">Full name</label>
            <input
              className={inputClass}
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
              })}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

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
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
                maxLength: { value: 72, message: 'At most 72 characters' },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Confirm password</label>
            <input
              type="password"
              className={inputClass}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === getValues('password') || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;