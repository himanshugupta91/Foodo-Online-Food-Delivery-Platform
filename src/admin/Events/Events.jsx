import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createEventAction,
  getRestaurnatsEvents,
} from "../../state/customers/Restaurant/restaurant.action";
import dayjs from "dayjs";
import { Calendar, MapPin, ImagePlus, X } from "lucide-react";
import EventCard from "./EventCard";
import { uploadToCloudinary } from "../utils/UploadToCloudnary";

const initialValues = {
  image: "",
  location: "",
  name: "",
  startedAt: "",
  endsAt: "",
};

const Events = () => {
  const dispatch = useDispatch();
  const { restaurant, auth } = useSelector((store) => store);
  const [openModal, setOpenModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => setOpenModal(false);
  const handleOpenModal = () => setOpenModal(true);
  const jwt = localStorage.getItem("jwt");

  const [formValues, setFormValues] = useState(initialValues);

  const handleFormChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    setFormValues({ ...formValues, image: image });
    setUploadingImage(false);
  };

  const handleRemoveImage = () => {
    setFormValues({ ...formValues, image: "" });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const data = {
      ...formValues,
      startedAt: formValues.startedAt ? dayjs(formValues.startedAt).format() : null,
      endsAt: formValues.endsAt ? dayjs(formValues.endsAt).format() : null,
    };

    dispatch(
      createEventAction({
        data,
        restaurantId: restaurant.usersRestaurant?.id,
        jwt,
      })
    ).then(() => {
      setLoading(false);
      setFormValues(initialValues);
      handleCloseModal();
    });
  };

  useEffect(() => {
    if (restaurant.usersRestaurant) {
      dispatch(
        getRestaurnatsEvents({
          restaurantId: restaurant.usersRestaurant?.id,
          jwt: auth.jwt || jwt,
        })
      );
    }
  }, [restaurant.usersRestaurant, dispatch, auth.jwt, jwt]);

  return (
    <div className="space-y-8 animate-fade-in p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Events</h2>
          <p className="text-gray-500 mt-1">
            Create and manage special events for your restaurant
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          <Calendar className="w-4 h-4" />
          Create New Event
        </button>
      </div>

      {/* Events Grid */}
      {restaurant.restaurantsEvents && restaurant.restaurantsEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurant.restaurantsEvents.map((item) => (
            <EventCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events scheduled</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Host special events to attract more customers and boost your restaurant's visibility.
          </p>
          <button onClick={handleOpenModal} className="border border-neutral-300 text-neutral-700 hover:bg-neutral-50 px-6 py-2 rounded-xl font-medium text-sm transition-colors">
            Schedule Your First Event
          </button>
        </div>
      )}

      {/* Create Event Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Create New Event</h2>
              <button onClick={handleCloseModal} className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Event Banner</label>
                <input
                  type="file"
                  accept="image/*"
                  id="event-image-upload"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="event-image-upload"
                  className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all relative overflow-hidden group"
                >
                  {uploadingImage ? (
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : formValues.image ? (
                    <>
                      <img src={formValues.image} alt="Event" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-8 h-8 text-neutral-400 mb-2" />
                      <span className="text-sm text-neutral-500">Click to upload banner</span>
                    </>
                  )}
                </label>
                {formValues.image && (
                  <button type="button" onClick={handleRemoveImage} className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium">
                    Remove Image
                  </button>
                )}
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Enter event name"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    name="location"
                    value={formValues.location}
                    onChange={handleFormChange}
                    required
                    placeholder="Event location"
                    className="w-full border border-neutral-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>
              </div>

              {/* Date/Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Starts At</label>
                  <input
                    type="datetime-local"
                    name="startedAt"
                    value={formValues.startedAt}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Ends At</label>
                  <input
                    type="datetime-local"
                    name="endsAt"
                    value={formValues.endsAt}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Create Event"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
