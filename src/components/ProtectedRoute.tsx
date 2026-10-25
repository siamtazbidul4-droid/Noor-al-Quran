import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole
}) => {
  const { user, isGuest, authLoading } = useAuth();

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F2] text-[#111C19] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="w-16 h-16 mx-auto bg-[#0B3D32] rounded-full opacity-50"></div>
          </div>
          <p className="text-gray-600 font-bengali">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // If no user and route requires auth, redirect to home
  if (isGuest) {
    return <Navigate to="/" replace />;
  }

  // If route requires admin role and user is not admin, deny access
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF8F2] text-[#111C19] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 font-bengali">প্রবেশ নিষিদ্ধ</h1>
          <p className="text-lg text-gray-600 mb-6 font-bengali">
            এই পৃষ্ঠা শুধুমাত্র প্রশাসকদের জন্য সংরক্ষিত।
          </p>
          <a
            href="/"
            className="px-6 py-2 bg-[#0B3D32] text-white rounded-lg hover:bg-[#115545] transition-colors inline-block font-bengali"
          >
            হোম পৃষ্ঠায় ফিরুন
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
