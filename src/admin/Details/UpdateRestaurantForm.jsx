import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateRestaurant } from "../../state/customers/Restaurant/restaurant.action";
import { X } from "lucide-react";

const FormInput = ({ label, name, formik, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
    {props.multiline ? (
      <textarea
        name={name}
        rows={props.rows || 3}
        value={formik.values[name]}
        onChange={formik.handleChange}
        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-100 transition-all resize-none ${formik.touched[name] && formik.errors[name] ? "border-red-400" : "border-neutral-200 focus:border-primary-500"
          }`}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-100 transition-all ${formik.touched[name] && formik.errors[name] ? "border-red-400" : "border-neutral-200 focus:border-primary-500"
          }`}
      />
    )}
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
    )}
  </div>
);

const UpdateRestaurantForm = ({ handleClose }) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { restaurant } = useSelector((store) => store);
  const currentRestaurant = restaurant.usersRestaurant;

  const initialValues = {
    name: currentRestaurant?.name || "",
    description: currentRestaurant?.description || "",
    cuisineType: currentRestaurant?.cuisineType || "",
    openingHours: currentRestaurant?.openingHours || "",
    streetAddress: currentRestaurant?.address?.streetAddress || "",
    city: currentRestaurant?.address?.city || "",
    stateProvince: currentRestaurant?.address?.stateProvince || "",
    postalCode: currentRestaurant?.address?.postalCode || "",
    country: currentRestaurant?.address?.country || "",
    email: currentRestaurant?.contactInformation?.email || "",
    mobile: currentRestaurant?.contactInformation?.mobile || "",
    twitter: currentRestaurant?.contactInformation?.twitter || "",
    instagram: currentRestaurant?.contactInformation?.instagram || "",
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      cuisineType: Yup.string().required("Cuisine type is required"),
      streetAddress: Yup.string().required("Street address is required"),
      city: Yup.string().required("City is required"),
      stateProvince: Yup.string().required("State/Province is required"),
      postalCode: Yup.string().required("Postal code is required"),
      country: Yup.string().required("Country is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      mobile: Yup.string().required("Mobile number is required"),
    }),
    onSubmit: (values) => {
      const data = {
        name: values.name,
        description: values.description,
        cuisineType: values.cuisineType,
        openingHours: values.openingHours,
        address: {
          streetAddress: values.streetAddress,
          city: values.city,
          stateProvince: values.stateProvince,
          postalCode: values.postalCode,
          country: values.country,
        },
        contactInformation: {
          email: values.email,
          mobile: values.mobile,
          twitter: values.twitter,
          instagram: values.instagram,
        },
      };

      dispatch(
        updateRestaurant({
          restaurantId: currentRestaurant.id,
          restaurantData: data,
          jwt,
        })
      );
      handleClose();
    },
  });

  return (
    <div className="p-6 relative">
      <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
        <X className="w-5 h-5 text-neutral-500" />
      </button>
      <h2 className="text-xl font-bold text-neutral-900 text-center mb-6">Update Restaurant Details</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <FormInput label="Restaurant Name" name="name" formik={formik} />
        <FormInput label="Description" name="description" formik={formik} multiline rows={3} />

        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Cuisine Type" name="cuisineType" formik={formik} />
          <FormInput label="Opening Hours" name="openingHours" formik={formik} />
        </div>

        <h3 className="text-lg font-semibold text-neutral-800 pt-2">Address</h3>
        <FormInput label="Street Address" name="streetAddress" formik={formik} />
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="City" name="city" formik={formik} />
          <FormInput label="State/Province" name="stateProvince" formik={formik} />
          <FormInput label="Postal Code" name="postalCode" formik={formik} />
          <FormInput label="Country" name="country" formik={formik} />
        </div>

        <h3 className="text-lg font-semibold text-neutral-800 pt-2">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Email" name="email" formik={formik} type="email" />
          <FormInput label="Mobile Number" name="mobile" formik={formik} />
          <FormInput label="Twitter URL" name="twitter" formik={formik} />
          <FormInput label="Instagram URL" name="instagram" formik={formik} />
        </div>

        <button
          type="submit"
          className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold text-sm shadow-md transition-all mt-4"
        >
          Update Restaurant
        </button>
      </form>
    </div>
  );
};

export default UpdateRestaurantForm;
