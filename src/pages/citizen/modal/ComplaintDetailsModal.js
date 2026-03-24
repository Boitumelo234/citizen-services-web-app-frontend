// ComplaintDetailsModal.jsx
import { useEffect, useState } from 'react';

function ComplaintDetailsModal({ complaint, onClose, formatDate, getImageUrl }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [updateImagesLoaded, setUpdateImagesLoaded] = useState({});

    useEffect(() => {
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!complaint) return null;

    // Handle click on backdrop
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleUpdateImageLoad = (updateId) => {
        setUpdateImagesLoaded(prev => ({ ...prev, [updateId]: true }));
    };

    const handleImageError = (e) => {
        console.log('Image failed to load in modal');
        e.target.style.display = 'none';
        // Show a fallback div
        const parent = e.target.parentElement;
        if (parent && !parent.querySelector('.image-fallback')) {
            const fallback = document.createElement('div');
            fallback.className = 'image-fallback flex items-center justify-center h-48 bg-gray-100 rounded';
            fallback.innerHTML = '<p class="text-gray-400">Image not available</p>';
            parent.appendChild(fallback);
        }
    };

    const mainImageUrl = complaint.photoUrl ? getImageUrl(complaint.photoUrl) : null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
            onClick={handleBackdropClick}
            style={{ backdropFilter: 'blur(4px)' }}
        >
            <div
                className="card overflow-y-auto flex-1"
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: '95vh' }}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-900 truncate pr-4">
                        Complaint {complaint.referenceNumber}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-3xl font-light leading-none focus:outline-none w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full flex-shrink-0"
                        title="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 p-6">
                    <div className="space-y-6">
                        {/* Key info grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500 font-medium">Category</p>
                                <p className="mt-1 font-semibold text-gray-900 break-words">{complaint.category}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500 font-medium">Location</p>
                                <p className="mt-1 font-semibold text-gray-900 break-words">{complaint.location}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500 font-medium">Status</p>
                                <p className={`mt-1 font-semibold capitalize ${
                                    complaint.status?.toLowerCase() === 'resolved' ? 'text-green-600' :
                                        complaint.status?.toLowerCase() === 'in progress' ? 'text-blue-600' :
                                            complaint.status?.toLowerCase() === 'pending' ? 'text-yellow-600' :
                                                'text-gray-600'
                                }`}>
                                    {complaint.status || 'Pending'}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500 font-medium">Submitted</p>
                                <p className="mt-1 font-semibold text-gray-900">{formatDate(complaint.createdAt)}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-2">Description</p>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed break-words">
                                    {complaint.description}
                                </p>
                            </div>
                        </div>

                        {/* Original Photo */}
                        {mainImageUrl && (
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-2">Attached Photo</p>
                                <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-gray-50 p-4">
                                    {!imageLoaded && (
                                        <div className="flex items-center justify-center h-48 bg-gray-100 rounded">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                                <p className="text-gray-400 text-sm">Loading image...</p>
                                            </div>
                                        </div>
                                    )}
                                    <img
                                        src={mainImageUrl}
                                        alt="Complaint attachment"
                                        className={`w-full object-contain mx-auto transition-opacity duration-300 ${
                                            imageLoaded ? 'opacity-100' : 'opacity-0'
                                        }`}
                                        style={{ maxHeight: '400px' }}
                                        onLoad={handleImageLoad}
                                        onError={handleImageError}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Updates Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Updates
                                {complaint.updates?.length > 0 && (
                                    <span className="ml-2 text-sm font-normal text-gray-500">
                                        ({complaint.updates.length})
                                    </span>
                                )}
                            </h3>
                            {complaint.updates?.length > 0 ? (
                                <div className="space-y-4">
                                    {complaint.updates.map((update, index) => {
                                        const updateImageUrl = update.photoUrl ? getImageUrl(update.photoUrl) : null;
                                        const isUpdateImageLoaded = updateImagesLoaded[update.id];

                                        return (
                                            <div
                                                key={update.id}
                                                className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
                                            >
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        Update #{index + 1}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {formatDate(update.createdAt)}
                                                    </span>
                                                </div>

                                                {update.newLocation && (
                                                    <div className="mb-3 bg-white p-2 rounded border border-gray-100">
                                                        <p className="text-xs text-gray-500 mb-1">📍 Updated location</p>
                                                        <p className="font-medium text-gray-800 break-words">{update.newLocation}</p>
                                                    </div>
                                                )}

                                                <div className="mb-3">
                                                    <p className="text-xs text-gray-500 mb-1">💬 Comment</p>
                                                    <p className="text-gray-700 whitespace-pre-wrap break-words bg-white p-3 rounded border border-gray-100">
                                                        {update.comment}
                                                    </p>
                                                </div>

                                                {updateImageUrl && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-2">📷 Additional photo</p>
                                                        <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white p-2">
                                                            {!isUpdateImageLoaded && (
                                                                <div className="flex items-center justify-center h-32 bg-gray-100 rounded">
                                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                                                </div>
                                                            )}
                                                            <img
                                                                src={updateImageUrl}
                                                                alt="Update attachment"
                                                                className={`w-full object-contain mx-auto transition-opacity duration-300 ${
                                                                    isUpdateImageLoaded ? 'opacity-100' : 'opacity-0'
                                                                }`}
                                                                style={{ maxHeight: '200px' }}
                                                                onLoad={() => handleUpdateImageLoad(update.id)}
                                                                onError={handleImageError}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <p className="text-gray-500 italic">
                                        No updates have been added yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Close
                    </button>
                </div>
                <br />
            </div>
        </div>
    );
}

export default ComplaintDetailsModal;