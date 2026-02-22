import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../state/authentication/Action";
import PasswordStrength from "../../../components/ui/PasswordStrength";

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  role: "ROLE_CUSTOMER",
};

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  role: Yup.string().required("Type is required"),
});

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    console.log("Form values:", values);
    await dispatch(registerUser({ userData: values, navigate }));
    setIsSubmitting(false);
  };

  return (
    <div>
      <h2 className="font-display text-3xl font-bold text-neutral-800 mb-2 text-center">
        Create Account
      </h2>
      <p className="text-neutral-600 text-center mb-8">
        Join Foodo and start ordering delicious food
      </p>

      {auth.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
          <span className="block sm:inline">{auth.error}</span>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form className="space-y-5">
            <div>
              <Field
                name="fullName"
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg outline-none 
                         focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all
                         placeholder-neutral-400"
              />
              <ErrorMessage name="fullName">
                {(msg) => <span className="text-red-600 text-sm mt-1 block">{msg}</span>}
              </ErrorMessage>
            </div>

            <div>
              <Field
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg outline-none 
                         focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all
                         placeholder-neutral-400"
              />
              <ErrorMessage name="email">
                {(msg) => <span className="text-red-600 text-sm mt-1 block">{msg}</span>}
              </ErrorMessage>
            </div>

            <div>
              <div className="relative">
                <Field
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-12 border-2 border-neutral-200 rounded-lg outline-none 
                           focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all
                           placeholder-neutral-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <ErrorMessage name="password">
                {(msg) => <span className="text-red-600 text-sm mt-1 block">{msg}</span>}
              </ErrorMessage>

              {/* Password Strength Indicator */}
              {values.password && (
                <div className="mt-3">
                  <PasswordStrength password={values.password} />
                </div>
              )}
            </div>

            <div>
              <Field
                as="select"
                name="role"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg outline-none 
                         focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all
                         text-neutral-700"
              >
                <option value="ROLE_CUSTOMER">Customer</option>
                <option value="ROLE_RESTAURANT_OWNER">Restaurant Owner</option>
                <option value="ROLE_SUPER_ADMIN">Super Admin</option>
              </Field>
              <ErrorMessage name="role">
                {(msg) => <span className="text-red-600 text-sm mt-1 block">{msg}</span>}
              </ErrorMessage>
            </div>

            <button
              type="submit"
              className="btn-primary w-full relative"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Register'
              )}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-6 text-center">
        <p className="text-neutral-600 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/account/login")}
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
