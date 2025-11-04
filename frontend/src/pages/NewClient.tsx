import { useNavigate } from 'react-router';
import { PageLayout } from '@/components/PageLayout';

export function NewClient() {
    const navigate = useNavigate();

    return (
        <PageLayout title="New Client" >

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">New Client</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
                >
                    ← Back
                </button>
            </div>

            {/* Card */}
            <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <form className="grid gap-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            placeholder="Ada Lovelace"
                            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="ada@math.io"
                            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
                        />
                    </div>

                    <div className="mt-2 flex justify-end gap-3">
                        <button
                            type="submit"
                            disabled
                            className="cursor-not-allowed rounded bg-indigo-400 px-4 py-2 text-sm font-medium text-white opacity-60"
                            title="Save logic coming soon"
                        >
                            Save
                        </button>
                         <button
                            type="button"
                            onClick={() => navigate('/clients')}
                            className="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"            >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </PageLayout>
    );
}