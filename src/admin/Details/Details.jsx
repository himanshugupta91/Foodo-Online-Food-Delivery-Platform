import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateRestaurantStatus,
  addAdminToRestaurant,
  deleteRestaurant,
} from "../../state/customers/Restaurant/restaurant.action";
import { Card } from "../../components/ui/Modal";
import UpdateRestaurantForm from "./UpdateRestaurantForm";

const Details = () => {
  const dispatch = useDispatch();
  const { auth, restaurant } = useSelector((store) => store);

  const jwt = localStorage.getItem("jwt");
  const [adminEmail, setAdminEmail] = useState("");
  const [openUpdateForm, setOpenUpdateForm] = useState(false);

  const handleAddAdmin = () => {
    if (!adminEmail) return;
    dispatch(addAdminToRestaurant({
      restaurantId: restaurant.usersRestaurant?.id,
      email: adminEmail,
      jwt: auth.jwt || jwt
    }));
    setAdminEmail("");
  };

  const handleRestaurantStatus = () => {
    dispatch(
      updateRestaurantStatus({
        restaurantId: restaurant.usersRestaurant.id,
        jwt: auth.jwt || jwt,
      })
    );
  };

  const handleDeleteRestaurant = () => {
    if (window.confirm("Are you sure you want to delete this restaurant? This action cannot be undone.")) {
      dispatch(deleteRestaurant({ restaurantId: restaurant.usersRestaurant.id, jwt: auth.jwt || jwt }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-6 py-8">
        <h1 className="font-display text-4xl lg:text-6xl font-bold text-center text-neutral-900">
          {restaurant.usersRestaurant?.name}
        </h1>
        <button
          onClick={handleRestaurantStatus}
          className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${restaurant.usersRestaurant?.open
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
        >
          {restaurant.usersRestaurant?.open ? "Close Restaurant" : "Open Restaurant"}
        </button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Restaurant Info */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-neutral-900">
              Restaurant Information
            </h2>
            <div className="flex gap-3">
              <button onClick={() => setOpenUpdateForm(true)} className="border border-primary-300 text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                Edit Details
              </button>
              <button onClick={handleDeleteRestaurant} className="border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                Delete Restaurant
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <DetailRow label="Owner" value={restaurant.usersRestaurant?.owner?.fullName} />
            <DetailRow label="Restaurant Name" value={restaurant.usersRestaurant?.name} />
            <DetailRow label="Cuisine Type" value={restaurant.usersRestaurant?.cuisineType} />
            <DetailRow label="Opening Hours" value={restaurant.usersRestaurant?.openingHours} />
            <div className="flex items-start">
              <p className="w-48 font-medium text-neutral-700">Status</p>
              <div className="flex items-center space-x-3">
                <span className="text-neutral-600">-</span>
                {restaurant.usersRestaurant?.open ? (
                  <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm">Open</span>
                ) : (
                  <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-medium text-sm">Closed</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Address & Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Address */}
          <Card>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-6">Address</h2>
            <div className="space-y-4">
              <DetailRow label="Country" value={restaurant.usersRestaurant?.address?.country} />
              <DetailRow label="City" value={restaurant.usersRestaurant?.address?.city} />
              <DetailRow label="Postal Code" value={restaurant.usersRestaurant?.address?.postalCode} />
              <DetailRow label="Street Address" value={restaurant.usersRestaurant?.address?.streetAddress} />
            </div>
          </Card>

          {/* Contact */}
          <Card>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-6">Contact Information</h2>
            <div className="space-y-4">
              <DetailRow label="Email" value={restaurant.usersRestaurant?.contactInformation?.email} />
              <DetailRow
                label="Mobile"
                value={restaurant.usersRestaurant?.contactInformation?.mobile ? `+91 ${restaurant.usersRestaurant.contactInformation.mobile}` : ""}
              />
              <div className="flex items-start">
                <p className="w-48 font-medium text-neutral-700">Social Media</p>
                <div className="flex items-center space-x-3">
                  <span className="text-neutral-600">-</span>
                  <div className="flex items-center space-x-3">
                    <a href={restaurant.usersRestaurant?.contactInformation?.instagram} target="_blank" rel="noreferrer" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                      <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    </a>
                    <a href={restaurant.usersRestaurant?.contactInformation?.twitter} target="_blank" rel="noreferrer" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                      <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                    </a>
                    <a href={restaurant.usersRestaurant?.contactInformation?.linkedin} target="_blank" rel="noreferrer" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    </a>
                    <a href={restaurant.usersRestaurant?.contactInformation?.facebook} target="_blank" rel="noreferrer" className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Managers Card */}
          <Card>
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-6">Details & Managers</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <DetailRow label="Restaurant ID" value={restaurant.usersRestaurant?.id} />
                <DetailRow label="Total Managers" value={restaurant.usersRestaurant?.administrators?.length || 0} />
              </div>

              <div className="pt-6 border-t border-neutral-200">
                <h3 className="font-medium text-neutral-900 mb-4">Add Manager</h3>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Manager Email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="flex-1 border border-neutral-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                  <button
                    onClick={handleAddAdmin}
                    disabled={!adminEmail}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                {restaurant.usersRestaurant?.administrators?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-neutral-500 mb-2">Current Managers:</p>
                    <ul className="list-disc list-inside text-neutral-600 text-sm">
                      {restaurant.usersRestaurant?.administrators.map((admin) => (
                        <li key={admin.id}>{admin.fullName} ({admin.email})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Update Modal */}
      {openUpdateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setOpenUpdateForm(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <UpdateRestaurantForm handleClose={() => setOpenUpdateForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component
const DetailRow = ({ label, value }) => (
  <div className="flex items-start">
    <p className="w-48 font-medium text-neutral-700">{label}</p>
    <p className="flex-1 text-neutral-600">
      <span className="mr-3">-</span>
      {value}
    </p>
  </div>
);

export default Details;
