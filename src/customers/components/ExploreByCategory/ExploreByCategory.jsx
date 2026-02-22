import React from "react";
import MultipleItemsCarousel from "../MultiItemCarousel/MultiItemCarousel";

const ExploreByCategory = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-50" />
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container-custom relative z-10 px-4">

                <div className="relative">
                    <MultipleItemsCarousel />
                </div>
            </div>
        </section>
    );
};

export default ExploreByCategory;
