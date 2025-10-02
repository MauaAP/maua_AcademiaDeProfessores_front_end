import React from 'react';

export default function Loading({ message = "Carregando...", size = "md" }) {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-8 h-8", 
        lg: "w-12 h-12",
        xl: "w-16 h-16"
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className={`${sizeClasses[size]} relative`}>
                {/* Spinner principal */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-maua-blue border-t-transparent animate-spin"></div>
            </div>
            {message && (
                <p className="mt-4 text-gray-600 font-medium animate-pulse">{message}</p>
            )}
        </div>
    );
}

export function LoadingCard() {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-48"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-200 rounded-lg p-3 h-16"></div>
                    <div className="bg-gray-200 rounded-lg p-3 h-16"></div>
                </div>
                <div className="flex gap-3">
                    <div className="h-10 bg-gray-300 rounded-xl flex-1"></div>
                    <div className="h-10 bg-gray-300 rounded-xl w-24"></div>
                </div>
            </div>
        </div>
    );
}

export function LoadingSkeleton({ lines = 3 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: lines }).map((_, index) => (
                <div key={index} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    {index < lines - 1 && <div className="h-3 bg-gray-100 rounded w-3/4 mt-2"></div>}
                </div>
            ))}
        </div>
    );
}
