import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCoupon, deleteCoupon, getAllCoupons, updateCoupon } from "../../state/admin/Coupon/Action";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { Trash2, Pencil, X, Plus } from "lucide-react";

const Coupons = () => {
    const [open, setOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    const handleOpen = (coupon = null) => {
        setEditingCoupon(coupon);
        setOpen(true);
    };

    const handleClose = () => {
        setEditingCoupon(null);
        setOpen(false);
        formik.resetForm();
    };
    const dispatch = useDispatch();
    const { coupon, auth } = useSelector((store) => store);
    const jwt = auth.jwt || localStorage.getItem("jwt");

    useEffect(() => {
        dispatch(getAllCoupons({ jwt }));
    }, [dispatch, jwt]);

    const formik = useFormik({
        initialValues: {
            code: editingCoupon?.code || "",
            discountAmount: editingCoupon?.discountAmount ?? "",
            discountPercentage: editingCoupon?.discountPercentage || 0,
            validityPeriod: editingCoupon?.validityPeriod ? dayjs(editingCoupon.validityPeriod).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
            termsAndConditions: editingCoupon?.termsAndConditions || "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            code: Yup.string().required("Coupon code is required"),
            discountPercentage: Yup.number()
                .required("Discount percentage is required")
                .min(1, "Must be at least 1%")
                .max(100, "Cannot exceed 100%"),
        }),
        onSubmit: (values) => {
            const data = {
                code: values.code,
                discountAmount: values.discountAmount === "" ? null : Number(values.discountAmount),
                discountPercentage: values.discountPercentage,
                validityPeriod: values.validityPeriod ? new Date(values.validityPeriod) : null,
                termsAndConditions: values.termsAndConditions,
            };

            if (editingCoupon) {
                dispatch(updateCoupon({ couponId: editingCoupon.id, data, jwt }));
            } else {
                dispatch(createCoupon({ data, jwt }));
            }
            handleClose();
        },
    });

    const handleDeleteCoupon = (couponId) => {
        dispatch(deleteCoupon({ couponId, jwt }));
    };

    return (
        <div className="p-5 animate-fade-in">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                    <h2 className="text-xl font-bold text-neutral-900">Coupons</h2>
                    <button
                        onClick={() => handleOpen()}
                        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all"
                    >
                        <Plus className="w-4 h-4" /> Create Coupon
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50 border-b border-neutral-100">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Code</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Discount Amount</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Discount %</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Validity</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {coupon.coupons?.map((item) => (
                                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono font-semibold text-neutral-800">{item.code}</td>
                                    <td className="px-6 py-4 text-sm text-neutral-600">{item.discountAmount ?? "—"}</td>
                                    <td className="px-6 py-4 text-sm text-neutral-600">{item.discountPercentage}%</td>
                                    <td className="px-6 py-4 text-sm text-neutral-600">
                                        {item.validityPeriod ? new Date(item.validityPeriod).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleOpen(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteCoupon(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!coupon.coupons || coupon.coupons.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 text-sm">No coupons created yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={handleClose}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-neutral-900">
                                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                            </h2>
                            <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
                                <X className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>
                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Coupon Code</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formik.values.code}
                                    onChange={formik.handleChange}
                                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-100 transition-all ${formik.touched.code && formik.errors.code ? "border-red-400 focus:border-red-500" : "border-neutral-200 focus:border-primary-500"
                                        }`}
                                />
                                {formik.touched.code && formik.errors.code && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.code}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Discount Amount</label>
                                <input
                                    type="number"
                                    name="discountAmount"
                                    value={formik.values.discountAmount}
                                    onChange={formik.handleChange}
                                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Discount Percentage</label>
                                <input
                                    type="number"
                                    name="discountPercentage"
                                    value={formik.values.discountPercentage}
                                    onChange={formik.handleChange}
                                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-100 transition-all ${formik.touched.discountPercentage && formik.errors.discountPercentage ? "border-red-400 focus:border-red-500" : "border-neutral-200 focus:border-primary-500"
                                        }`}
                                />
                                {formik.touched.discountPercentage && formik.errors.discountPercentage && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.discountPercentage}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Terms & Conditions</label>
                                <input
                                    type="text"
                                    name="termsAndConditions"
                                    value={formik.values.termsAndConditions}
                                    onChange={formik.handleChange}
                                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Validity Date</label>
                                <input
                                    type="date"
                                    name="validityPeriod"
                                    value={formik.values.validityPeriod}
                                    onChange={formik.handleChange}
                                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold text-sm shadow-md transition-all mt-2"
                            >
                                {editingCoupon ? "Update" : "Create"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
