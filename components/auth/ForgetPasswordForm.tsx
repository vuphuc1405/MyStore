'use client';

import { useFormStatus } from 'react-dom';
import { requestPasswordReset } from '@/lib/actions/authActions';
import { useActionState } from 'react';

type AuthState = {
  message: string;
  error: string | null;
  success: boolean;
};

const initialState: AuthState = {
  message: '',
  error: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
    >
      {pending ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
    </button>
  );
}

export default function ForgotPasswordForm() {
const [state, formAction] = useActionState(requestPasswordReset, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Địa chỉ email
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <SubmitButton />
      </div>

      {state?.message && (
        <p className={`mt-2 text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.message}
        </p>
      )}
      {/* Nếu bạn muốn tách riêng error message ra khỏi message chung */}
      {state?.error && !state.message && (
         <p className="mt-2 text-sm text-red-600">{state.error}</p>
      )}
    </form>
  );
}