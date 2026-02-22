import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyPaymentAction } from "../../../state/customers/Orders/Action";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const jwt = localStorage.getItem("jwt");

  const { order } = useSelector((store) => store);

  useEffect(() => {
    if (sessionId) {
      dispatch(verifyPaymentAction(sessionId, jwt));
    } else {
      navigate("/");
    }
  }, [dispatch, sessionId, jwt, navigate]);

  if (order.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex flex-col justify-center items-center px-4 py-12 animate-fade-in">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-neutral-600 font-semibold text-lg">Verifying your payment...</p>
      </div>
    );
  }

  if (order.error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex flex-col justify-center items-center px-4 py-12 animate-fade-in">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-card-hover p-8 text-center border-t-4 border-red-500">
          <svg className="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">Verification Failed</h1>
          <p className="text-neutral-600 mb-8">There was an issue verifying your payment. Please try again or contact support.</p>
          <button onClick={() => navigate("/cart")} className="btn-primary w-full max-w-xs mx-auto">Return to Cart</button>
        </div>
      </div>
    );
  }

  const verifiedOrder = order.verifiedOrder;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white flex flex-col justify-center items-center px-4 py-12 animate-fade-in">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-card-hover p-8 lg:p-12 text-center animate-scale-in">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-success-200 animate-ping"></div>
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-glow">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="font-display text-4xl lg:text-5xl font-bold text-neutral-800 mb-4">
          Order Successful!
        </h1>
        <p className="text-lg text-neutral-600 mb-2">Thank you for choosing Foodo!</p>
        <p className="text-neutral-500 mb-8">
          Your order has been placed successfully. We'll send you a confirmation email shortly.
        </p>

        {verifiedOrder && (
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 mb-8 text-left">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 border-dashed">
              <span className="text-sm font-semibold text-neutral-600">Order ID</span>
              <span className="font-mono font-bold text-primary-600">#{verifiedOrder.id}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-neutral-600">Items Total</span>
              <span className="font-mono font-semibold text-neutral-800">{verifiedOrder.items.length} items</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Amount Paid</span>
              <span className="font-mono font-semibold text-neutral-800 text-lg text-success-600">₹{verifiedOrder.totalAmount}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => navigate("/my-profile/orders")} className="btn-primary flex-1 shadow-lg">
            View Orders
          </button>
          <button onClick={() => navigate("/")} className="btn-secondary flex-1 shadow font-medium">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
