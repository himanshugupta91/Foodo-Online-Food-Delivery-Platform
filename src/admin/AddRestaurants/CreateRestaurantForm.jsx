import React, { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { createRestaurant } from "../../state/customers/Restaurant/restaurant.action";
import { uploadToCloudinary } from "../utils/UploadToCloudnary";
import * as Yup from "yup";
import { ImagePlus, X } from "lucide-react";

const validationSchema = Yup.object({
  name: Yup.string().required("Restaurant Name is required"),
  description: Yup.string().required("Description is required"),
  cuisineType: Yup.string().required("Cuisine Type is required"),
  streetAddress: Yup.string().required("Street Address is required"),
  city: Yup.string().required("City is required"),
  stateProvince: Yup.string().required("State/Province is required"),
  postalCode: Yup.string().required("Postal Code is required"),
  country: Yup.string().required("Country is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  mobile: Yup.string().required("Mobile number is required"),
  openingHours: Yup.string().required("Opening Hours are required"),
  fullName: Yup.string().required("Owner Full Name is required"),
  images: Yup.array().min(1, "At least one image is required"),
});

const initialValues = {
  name: "",
  description: "",
  cuisineType: "",
  streetAddress: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  country: "",
  email: "",
  mobile: "",
  twitter: "",
  instagram: "",
  openingHours: "Mon-Sun: 9:00 AM - 9:00 PM",
  images: [],
  fullName: "",
};

const FormInput = ({ label, name, formik, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
    {props.multiline ? (
      <textarea
        name={name}
        rows={props.rows || 3}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-100 transition-all resize-none bg-neutral-50 ${formik.touched[name] && formik.errors[name] ? "border-red-400" : "border-neutral-200 focus:border-primary-500"
          }`}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-100 transition-all bg-neutral-50 ${formik.touched[name] && formik.errors[name] ? "border-red-400" : "border-neutral-200 focus:border-primary-500"
          }`}
      />
    )}
    {formik.touched[name] && formik.errors[name] && (
      <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
    )}
  </div>
);

const CreateRestaurantForm = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("jwt");
  const [uploadImage, setUploadingImage] = useState(false);

  const handleSubmit = (values, { setSubmitting }) => {
    const data = {
      name: values.name,
      description: values.description,
      cuisineType: values.cuisineType,
      address: {
        fullName: values.fullName,
        streetAddress: values.streetAddress,
        city: values.city,
        state: values.stateProvince,
        postalCode: values.postalCode,
        country: values.country,
      },
      contactInformation: {
        email: values.email,
        mobile: values.mobile,
        twitter: values.twitter,
        instagram: values.instagram,
      },
      openingHours: values.openingHours,
      images: values.images,
    };
    dispatch(createRestaurant({ data, token }));
    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadingImage(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  return (
    <div className="py-10 px-5 lg:flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 animate-fade-in">
      <div className="lg:max-w-4xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-neutral-100">

        {/* Header */}
        <div className="bg-primary-600 px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-10"></div>
          <h1 className="font-display text-4xl font-bold text-white relative z-10 mb-2">
            Add New Restaurant
          </h1>
          <p className="text-primary-100 relative z-10 max-w-lg mx-auto">
            Create a stunning profile for your restaurant and start receiving orders today.
          </p>
        </div>

        <div className="p-8 lg:p-12">
          <form onSubmit={formik.handleSubmit} className="space-y-8">

            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-neutral-800">Restaurant Images</label>
              <div className="flex flex-wrap gap-4">
                <input type="file" accept="image/*" id="fileInput" className="hidden" onChange={handleImageChange} />
                <label className="relative group cursor-pointer transition-all hover:scale-105" htmlFor="fileInput">
                  <div className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-primary-300 rounded-2xl bg-primary-50 hover:bg-primary-100 transition-colors">
                    {uploadImage ? (
                      <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ImagePlus className="w-8 h-8 text-primary-500 mb-2" />
                        <span className="text-xs text-primary-700 font-bold">Add Photo</span>
                      </>
                    )}
                  </div>
                </label>

                {formik.values.images.map((image, index) => (
                  <div key={index} className="relative w-32 h-32 group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                    <img className="w-full h-full object-cover" src={image} alt={`Restaurant ${index + 1}`} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => handleRemoveImage(index)} className="bg-white hover:bg-red-50 p-1.5 rounded-full text-red-600 shadow-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {formik.touched.images && formik.errors.images && (
                <p className="text-red-500 text-sm font-medium">{formik.errors.images}</p>
              )}
            </div>

            <div className="h-px bg-neutral-100 my-8"></div>

            {/* Basic Info Section */}
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">1</span>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><FormInput label="Restaurant Name" name="name" formik={formik} /></div>
                <div className="sm:col-span-2"><FormInput label="Owner Full Name" name="fullName" formik={formik} /></div>
                <div className="sm:col-span-2"><FormInput label="Description" name="description" formik={formik} multiline rows={3} /></div>
                <FormInput label="Cuisine Type" name="cuisineType" formik={formik} />
                <FormInput label="Opening Hours" name="openingHours" formik={formik} />
              </div>
            </div>

            <div className="h-px bg-neutral-100 my-8"></div>

            {/* Address Section */}
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">2</span>
                Address Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3"><FormInput label="Street Address" name="streetAddress" formik={formik} /></div>
                <FormInput label="City" name="city" formik={formik} />
                <FormInput label="State/Province" name="stateProvince" formik={formik} />
                <FormInput label="Postal Code" name="postalCode" formik={formik} />
                <div className="sm:col-span-3"><FormInput label="Country" name="country" formik={formik} /></div>
              </div>
            </div>

            <div className="h-px bg-neutral-100 my-8"></div>

            {/* Contact Section */}
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">3</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Email Address" name="email" formik={formik} type="email" />
                <FormInput label="Mobile Number" name="mobile" formik={formik} />
                <FormInput label="Twitter Handle (Optional)" name="twitter" formik={formik} />
                <FormInput label="Instagram Handle (Optional)" name="instagram" formik={formik} />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {formik.isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Create Restaurant"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRestaurantForm;
