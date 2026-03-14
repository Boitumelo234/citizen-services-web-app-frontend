// src/components/modals/ComplaintDetailsModal.jsx
function ComplaintDetailsModal({ complaint, onClose, formatDate }) {
    if (!complaint) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Complaint {complaint.referenceNumber}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="font-medium">{complaint.category}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium">{complaint.location}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium capitalize">{complaint.status?.toLowerCase()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Submitted</p>
                            <p className="font-medium">{formatDate(complaint.createdAt)}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-1">Description</p>
                        <p className="whitespace-pre-wrap border-l-4 border-blue-500 pl-3 py-1">
                            {complaint.description}
                        </p>
                    </div>

                    {complaint.photoUrl && (
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Attached Photo/Video</p>
                            <img
                                src={`http://localhost:8080${complaint.photoUrl}`}
                                alt="Complaint attachment"
                                className="max-w-full rounded-lg shadow-sm"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ComplaintDetailsModal;