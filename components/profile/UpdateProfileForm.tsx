'use client';

import { updateUserProfile } from '@/lib/actions/userActions';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';

interface UserProfileData {
    id: string;
    email?: string;
    full_name: string | null;
    phone: string | null;
}

interface UpdateProfileFormProps {
    userProfile: UserProfileData;
}

const initialState = {
    message: '',
    error: null as string | null,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            aria-disabled={pending}
            disabled={pending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
            {pending ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
    );
}

export default function UpdateProfileForm({ userProfile }: UpdateProfileFormProps) {
    const [state, formAction] = useFormState(updateUserProfile, initialState);

    useEffect(() => {
        if (state.message && !state.error) {
            alert(state.message);
        } else if (state.error) {
            alert(`Lỗi: ${state.error}`);
        }
    }, [state]);

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Họ và tên
                </label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    defaultValue={userProfile.full_name || ''}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={userProfile.phone || ''}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <SubmitButton />

            {state?.message && !state.error && (
                <p className="text-sm text-green-600 mt-2">{state.message}</p>
            )}
            {state?.error && (
                <p className="text-sm text-red-600 mt-2">{state.error}</p>
            )}
        </form>
    );
}
