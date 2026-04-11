import { useState, useEffect } from "react";

function AddUpdateModal({ complaint, onClose, onSuccess }) {
    const [comment, setComment] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
            // Clean up preview URL
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Clean up previous preview
        if (photoPreview) {
            URL.revokeObjectURL(photoPreview);
        }

        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        setErrorMsg(null);

        try {
            const token = localStorage.getItem("access_token");
            if (!token) throw new Error("No token found");

            const formData = new FormData();
            formData.append("comment", comment.trim());
            if (newLocation.trim()) formData.append("newLocation", newLocation.trim());
            if (photoFile) formData.append("photo", photoFile);

            const res = await fetch(`http://localhost:8080/api/complaints/${complaint.id}/updates`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Failed to submit update");
            }

            alert("Update submitted successfully!");
            onSuccess?.();
            onClose();
        } catch (err) {
            setErrorMsg(err.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
            onClick={handleBackdropClick}
            style={{ backdropFilter: 'blur(4px)' }}
        >
            {/*<div*/}
            {/*    className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100"*/}
            {/*    onClick={(e) => e.stopPropagation()}*/}
            {/*    style={{ maxHeight: '90vh' }}*/}
            {/*>*/}
            <div
                className="card"
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: '90vh' }}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-900 truncate pr-4">
                        Add Update – {complaint?.referenceNumber}
                    </h2>
                    {/*<button*/}
                    {/*    onClick={onClose}*/}
                    {/*    className="text-gray-500 hover:text-gray-800 text-3xl font-light leading-none focus:outline-none w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full flex-shrink-0"*/}
                    {/*>*/}
                    {/*    ×*/}
                    {/*</button>*/}
                </div>

                {/* Form - scrollable content */}
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 130px)' }}>
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Your comment / update *
                            </label>
                            <textarea
                                rows="4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Describe progress, new observations, or additional details..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-y min-h-[100px]"
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Updated location (optional)
                            </label>
                            <input
                                type="text"
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                                placeholder="e.g. Corner of Main Rd & Church St"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Additional photo (optional)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2.5 file:px-5
                                        file:rounded-lg file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-green-50 file:text-green-700
                                        hover:file:bg-green-100
                                        file:cursor-pointer cursor-pointer
                                        border border-gray-300 rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-green-500"
                                    disabled={submitting}
                                />
                            </div>
                            {photoPreview && (
                                <div className="mt-3 relative">
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="max-h-32 rounded-lg border border-gray-200 mx-auto object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPhotoFile(null);
                                            setPhotoPreview(null);
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>

                        {errorMsg && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                                {errorMsg}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 font-medium"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || !comment.trim()}
                                className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                {submitting ? "Submitting..." : "Submit Update"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddUpdateModal;