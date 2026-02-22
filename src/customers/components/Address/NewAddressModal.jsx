import React from "react";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Dialog } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { addUserAddress } from "../../../state/authentication/Action";

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

const NewAddress = ({ open, handleClose }) => {
  const dispatch = useDispatch();

  const handleSubmit = (values, { resetForm }) => {
    const data = {
      jwt: localStorage.getItem("jwt"),
      address: {
        ...values,
        fullName: "User", // Ideally fetch from auth.user.fullName
        country: "India"
      }
    };
    dispatch(addUserAddress(data));
    resetForm();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="font-display text-2xl font-bold text-neutral-900">
              Add Delivery Address
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                {/* Street Address */}
                <div>
                  <label htmlFor="streetAddress" className="block text-sm font-medium text-neutral-700 mb-1">
                    Street Address
                  </label>
                  <Field
                    id="streetAddress"
                    name="streetAddress"
                    type="text"
                    className={`input ${errors.streetAddress && touched.streetAddress ? 'border-red-500' : ''}`}
                    placeholder="Enter street address"
                  />
                  <ErrorMessage name="streetAddress">
                    {(msg) => <span className="text-red-600 text-sm mt-1 block">{msg}</span>}
                  </ErrorMessage>
                </div>

                {/* State and Pincode */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                      State
                    </label>
                    <Field
                      id="state"
                      name="state"
                      type="text"
                      className={`input ${errors.state && touched.state ? 'border-red-500' : ''}`}
                      placeholder="State"
                    />
                    <ErrorMessage name="state">
                      {(msg) => <span className="text-red-600 text-sm mt-1 block">{msg}</span>}
                    </ErrorMessage>
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-neutral-700 mb-1">
                      Pincode
                    </label>
                    <Field
                      id="pincode"
                      name="pincode"
                      type="text"
                      className={`input ${errors.pincode && touched.pincode ? 'border-red-500' : ''}`}
                      placeholder="000000"
                    />
                    <ErrorMessage name="pincode">
                      {(msg) => <span className="text-red-600 text-sm mt-1 block">{msg}</span>}
                    </ErrorMessage>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                    City
                  </label>
                  <Field
                    id="city"
                    name="city"
                    type="text"
                    className={`input ${errors.city && touched.city ? 'border-red-500' : ''}`}
                    placeholder="Enter city"
                  />
                  <ErrorMessage name="city">
                    {(msg) => <span className="text-red-600 text-sm mt-1 block">{msg}</span>}
                  </ErrorMessage>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-primary w-full mt-6"
                >
                  Deliver Here
                </button>
              </Form>
            )}
          </Formik>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default NewAddress;
