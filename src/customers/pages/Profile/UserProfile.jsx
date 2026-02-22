import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../state/authentication/Action';

const UserProfile = () => {
  const { auth } = useSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-8 animate-fade-in">
      <div className="flex flex-col items-center text-center">
        {/* Profile Avatar */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-6 shadow-lg">
          <span className="text-white text-5xl font-bold">
            {auth.user?.fullName?.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* User Info */}
        <h2 className="font-display text-3xl font-bold text-neutral-800 mb-2">
          {auth.user?.fullName}
        </h2>
        <p className="text-neutral-600 mb-6">{auth.user?.email}</p>

        {/* Account Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mb-8">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-4">
            <p className="text-sm text-neutral-600 mb-1">Role</p>
            <p className="font-semibold text-neutral-800">
              {auth.user?.role === 'ROLE_CUSTOMER' ? 'Customer'
                : auth.user?.role === 'ROLE_RESTAURANT_OWNER' ? 'Restaurant Owner'
                  : auth.user?.role === 'ROLE_SUPER_ADMIN' ? 'Super Admin'
                    : auth.user?.role}
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-4">
            <p className="text-sm text-neutral-600 mb-1">Member Since</p>
            <p className="font-semibold text-neutral-800">
              {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={() => navigate('/my-profile/orders')}
            className="btn-secondary flex-1"
          >
            View Orders
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 px-6 py-3 rounded-full font-semibold shadow-md
                       bg-red-50 text-red-600 hover:bg-red-100 
                       transition-all duration-300 border border-red-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;