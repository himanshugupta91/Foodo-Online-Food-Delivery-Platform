import React, { Fragment, useEffect, useState } from "react";
import AddressCard from "../../components/Address/AddressCard";
import CartItemCard from "../../components/CartItem/CartItemCard";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createOrder } from "../../../state/customers/Orders/Action";
import { findCart, getCartTotal } from "../../../state/customers/Cart/cart.action";
import { isValid } from "../../util/ValidToOrder";
import { cartTotal } from "./totalPay";

const initialValues = {
  streetAddress: "",
  state: "",
  pincode: "",
  city: "",
};

const validationSchema = Yup.object().shape({
  streetAddress: Yup.string().required("Street Address is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be 6 digits"),
  city: Yup.string().required("City is required"),
});

const Cart = () => {
  const [openSnackbar, setOpenSnakbar] = useState();
  const dispatch = useDispatch();
  const { cart, auth } = useSelector((store) => store);
  const jwt = auth.jwt || localStorage.getItem("jwt");
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const handleCloseAddressModal = () => {
    setOpenAddressModal(false);
  };

  const handleOpenAddressModal = () => setOpenAddressModal(true);

  useEffect(() => {
    if (jwt) {
      dispatch(findCart(jwt));
    }
  }, [dispatch, jwt]);

  // Fetch server-side cart total when cart is loaded
  useEffect(() => {
    if (cart.cart?.id && jwt) {
      dispatch(getCartTotal({ cartId: cart.cart.id, jwt }));
    }
  }, [cart.cart?.id, cart.cartItems, dispatch, jwt]);

  const handleSubmit = (values, { resetForm }) => {
    const data = {
      jwt,
      order: {
        restaurantId: cart.cartItems?.[0]?.food?.restaurant.id,
        deliveryAddress: {
          fullName: auth.user?.fullName,
          streetAddress: values.streetAddress,
          city: values.city,
          state: values.state,
          postalCode: values.pincode,
          country: "India",
        },
      },
    };
    if (isValid(cart.cartItems || [])) {
      dispatch(createOrder(data));
      resetForm();
      handleCloseAddressModal();
    } else setOpenSnakbar(true);
  };

  const createOrderUsingSelectedAddress = (deliveryAddress) => {
    const data = {
      jwt,
      order: {
        restaurantId: cart.cartItems?.[0]?.food.restaurant.id,
        deliveryAddress,
      },
    };
    if (isValid(cart.cartItems || [])) {
      dispatch(createOrder(data));
    } else setOpenSnakbar(true);
  };

  const handleCloseSankBar = () => setOpenSnakbar(false);

  const itemTotal = cart.cartTotal != null ? cart.cartTotal : cartTotal(cart.cartItems || []);
  const deliveryFee = Math.round(itemTotal * 0.05);
  const gst = Math.round(itemTotal * 0.18);
  const platformFee = 20;
  const totalPay = itemTotal + deliveryFee + gst + platformFee;

  return (
    <Fragment>
      {cart.cartItems?.length > 0 ? (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white py-8 animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Title */}
            <h1 className="font-display text-4xl font-bold text-neutral-800 mb-8">
              Your Cart
            </h1>

            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Cart Items & Bill Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cart.cartItems?.map((item, i) => (
                    <CartItemCard key={i} item={item} />
                  ))}
                </div>

                {/* Bill Details - Mobile */}
                <div className="lg:hidden bg-white rounded-2xl shadow-card p-6">
                  <h2 className="font-display text-xl font-bold text-neutral-800 mb-4">
                    Bill Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-neutral-600">
                      <p>Item Total</p>
                      <p>₹{itemTotal}</p>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <p>Delivery Fee</p>
                      <p>₹{deliveryFee}</p>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <p>Platform Fee</p>
                      <p>₹{platformFee}</p>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <p>GST and Restaurant Charges</p>
                      <p>₹{gst}</p>
                    </div>
                    <div className="border-t border-neutral-200 pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold text-neutral-800">
                        <p>Total Pay</p>
                        <p className="text-primary-600">₹{totalPay}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill Details - Desktop Sidebar */}
              <div className="hidden lg:block">
                <div className="sticky top-24 bg-white rounded-2xl shadow-card p-6">
                  <h2 className="font-display text-xl font-bold text-neutral-800 mb-6">
                    Bill Details
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-neutral-600">
                      <p>Item Total</p>
                      <p>₹{itemTotal}</p>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <p>Delivery Fee</p>
                      <p>₹{deliveryFee}</p>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <p>Platform Fee</p>
                      <p>₹{platformFee}</p>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <p>GST & Charges</p>
                      <p>₹{gst}</p>
                    </div>
                    <div className="border-t-2 border-neutral-200 pt-4 mt-4">
                      <div className="flex justify-between text-xl font-bold text-neutral-800">
                        <p>Total Pay</p>
                        <p className="text-primary-600">₹{totalPay}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address Section */}
            <div className="mt-12">
              <h2 className="font-display text-3xl font-bold text-neutral-800 mb-6 text-center">
                Choose Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {auth.user?.addresses.map((item, index) => (
                  <AddressCard
                    key={index}
                    handleSelectAddress={createOrderUsingSelectedAddress}
                    item={item}
                    showButton={true}
                  />
                ))}

                {/* Add New Address Card */}
                <button
                  onClick={handleOpenAddressModal}
                  className="bg-white rounded-2xl shadow-card hover:shadow-card-hover p-8 
                             flex flex-col items-center justify-center space-y-4 transition-all 
                             duration-300 hover:scale-105 border-2 border-dashed border-neutral-200 
                             hover:border-primary-300"
                >
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="font-semibold text-neutral-800">Add New Address</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex flex-col justify-center items-center px-4 animate-fade-in">
          <div className="text-center max-w-md">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg className="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63 -.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="font-display text-3xl font-bold text-neutral-800 mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-neutral-600 mb-8">
              Add some delicious items from our restaurants to get started!
            </p>
            <button
              onClick={() => window.location.href = "/"}
              className="btn-primary"
            >
              Browse Restaurants
            </button>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {openAddressModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-neutral-900 bg-opacity-75"
              onClick={handleCloseAddressModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <h3 className="font-display text-2xl font-bold text-neutral-800 mb-6">
                  Add New Address
                </h3>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  <Form className="space-y-4">
                    <div>
                      <Field
                        name="streetAddress"
                        type="text"
                        placeholder="Street Address"
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg outline-none 
                                   focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                      />
                      <ErrorMessage name="streetAddress">
                        {(msg) => <span className="text-red-600 text-sm mt-1 block">{msg}</span>}
                      </ErrorMessage>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Field
                          name="city"
                          type="text"
                          placeholder="City"
                          className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg outline-none 
                                     focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                        />
                        <ErrorMessage name="city">
                          {(msg) => <span className="text-red-600 text-sm mt-1 block">{msg}</span>}
                        </ErrorMessage>
                      </div>
                      <div>
                        <Field
                          name="state"
                          type="text"
                          placeholder="State"
                          className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg outline-none 
                                     focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                        />
                        <ErrorMessage name="state">
                          {(msg) => <span className="text-red-600 text-sm mt-1 block">{msg}</span>}
                        </ErrorMessage>
                      </div>
                    </div>
                    <div>
                      <Field
                        name="pincode"
                        type="text"
                        placeholder="Pincode (6 digits)"
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg outline-none 
                                   focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                      />
                      <ErrorMessage name="pincode">
                        {(msg) => <span className="text-red-600 text-sm mt-1 block">{msg}</span>}
                      </ErrorMessage>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleCloseAddressModal}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary flex-1">
                        Deliver Here
                      </button>
                    </div>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar for error */}
      {openSnackbar && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg animate-slide-up">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Please add items only from one restaurant at a time</p>
            <button onClick={handleCloseSankBar} className="ml-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Cart;
