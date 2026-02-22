import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { uploadToCloudinary } from "../utils/UploadToCloudnary";
import { createMenuItem } from "../../state/customers/Menu/menu.action";
import { ArrowLeft, ImagePlus, X, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(0, "Price must be positive"),
  category: Yup.number().required("Category is required"),
  images: Yup.array().min(1, "At least one image is required"),
  vegetarian: Yup.boolean().required("Required"),
  seasonal: Yup.boolean().required("Required"),
});

const initialValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  images: [],
  restaurantId: "",
  vegetarian: true,
  seasonal: false,
  quantity: 0,
  ingredients: [],
};

const AddMenuForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurant, ingredients, auth, menu } = useSelector((store) => store);
  const [uploadImage, setUploadingImage] = useState(false);
  const jwt = localStorage.getItem("jwt");

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const data = {
        name: values.name,
        description: values.description,
        price: values.price,
        categoryId: values.category,
        images: values.images,
        restaurantId: restaurant.usersRestaurant.id,
        vegetarian: values.vegetarian,
        seasonal: values.seasonal,
        ingredientIds: values.ingredients,
      };
      dispatch(createMenuItem({ menu: data, jwt: auth.jwt || jwt }));
    },
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
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

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (menu.message) setToast({ type: "success", text: menu.message });
    else if (menu.error) setToast({ type: "error", text: menu.error });
  }, [menu.message, menu.error]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-transparent p-4 lg:p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-neutral-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add Menu Item</h1>
            <p className="text-gray-500 mt-1">Create a new dish for your restaurant menu</p>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Images</h2>
            <div className="flex flex-wrap gap-4">
              <input type="file" accept="image/*" id="fileInput" className="hidden" onChange={handleImageChange} />
              <label
                htmlFor="fileInput"
                className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all group"
              >
                {uploadImage ? (
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-primary-500 mb-2" />
                    <span className="text-xs font-medium text-gray-500 group-hover:text-primary-600">Add Photo</span>
                  </>
                )}
              </label>

              {formik.values.images.map((image, index) => (
                <div key={index} className="relative w-32 h-32 rounded-xl overflow-hidden group shadow-md">
                  <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => handleRemoveImage(index)} className="bg-white/90 hover:bg-white p-1.5 rounded-full text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {formik.touched.images && formik.errors.images && (
              <p className="text-red-500 text-sm mt-2">{formik.errors.images}</p>
            )}
          </div>

          {/* Details Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Details</h2>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Item Name</label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-100 transition-all ${formik.touched.name && formik.errors.name ? "border-red-400" : "border-neutral-200 focus:border-primary-500"
                  }`}
              />
              {formik.touched.name && formik.errors.name && <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
              <textarea
                name="description"
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-100 transition-all resize-none ${formik.touched.description && formik.errors.description ? "border-red-400" : "border-neutral-200 focus:border-primary-500"
                  }`}
              />
              {formik.touched.description && formik.errors.description && <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-100 transition-all ${formik.touched.price && formik.errors.price ? "border-red-400" : "border-neutral-200 focus:border-primary-500"
                  }`}
              />
              {formik.touched.price && formik.errors.price && <p className="text-red-500 text-xs mt-1">{formik.errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
              <select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-100 transition-all bg-white ${formik.touched.category && formik.errors.category ? "border-red-400" : "border-neutral-200 focus:border-primary-500"
                  }`}
              >
                <option value="">Select Category</option>
                {restaurant.categories?.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              {formik.touched.category && formik.errors.category && <p className="text-red-500 text-xs mt-1">{String(formik.errors.category)}</p>}
            </div>
          </div>

          {/* Configuration Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Ingredients</label>
              <select
                name="ingredients"
                multiple
                value={formik.values.ingredients}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                  formik.setFieldValue("ingredients", selected);
                }}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all bg-white min-h-[120px]"
              >
                {ingredients.ingredients?.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              {formik.values.ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formik.values.ingredients.map((id) => {
                    const name = ingredients.ingredients?.find((item) => item.id === id)?.name || id;
                    return (
                      <span key={id} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {name}
                        <button type="button" onClick={() => formik.setFieldValue("ingredients", formik.values.ingredients.filter(v => v !== id))}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Is Vegetarian</label>
              <select
                name="vegetarian"
                value={formik.values.vegetarian}
                onChange={(e) => formik.setFieldValue("vegetarian", e.target.value === "true")}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all bg-white"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Is Seasonal</label>
              <select
                name="seasonal"
                value={formik.values.seasonal}
                onChange={(e) => formik.setFieldValue("seasonal", e.target.value === "true")}
                className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all bg-white"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={menu.loading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {menu.loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Create Menu Item"
            )}
          </button>
        </form>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-slide-up ${toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}>
          {toast.type === "error" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          {toast.text || "Menu item created successfully!"}
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddMenuForm;
