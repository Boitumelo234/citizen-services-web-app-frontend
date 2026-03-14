import {useState} from "react";

function AddUpdateModal({ complaint, onClose, onSubmit }) {
    const [comment, setComment] = useState('');

    const handleSubmit = async (comment) => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`http://localhost:8080/api/complaints/${complaint.id}/updates`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to submit update');
            }

            alert('Update submitted successfully!');
            onClose();
            // Optional: refresh complaints list
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">

                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Add Update – {complaint?.referenceNumber}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your update / comment
                        </label>
                        <textarea
                            rows="5"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Describe progress, additional information, new photos, questions to admin, etc..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                            required
                        />
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                        Note: Backend support for updates is not implemented yet.
                        This will be sent when you add the endpoint.
                    </p>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            Submit Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUpdateModal;