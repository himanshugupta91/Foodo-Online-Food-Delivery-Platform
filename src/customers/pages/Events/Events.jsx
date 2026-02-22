import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '../../../state/customers/Restaurant/restaurant.action';
import EventCard from '../../../admin/Events/EventCard';

const Events = () => {
    const dispatch = useDispatch();
    const { restaurant, auth } = useSelector((store) => store);
    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
        dispatch(getAllEvents({ jwt: auth.jwt || jwt }));
    }, [auth.jwt, dispatch, jwt]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white py-8 px-4 sm:px-6 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-neutral-800 mb-4">
                        Upcoming Events
                    </h1>
                    <p className="text-neutral-600 max-w-2xl mx-auto">
                        Discover exciting events happening at your favorite restaurants.
                        From food festivals to live music, find memorable experiences near you.
                    </p>
                </div>

                {restaurant.events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {restaurant.events.map((item) => (
                            <div
                                key={item.id}
                                className="animate-slide-up hover:shadow-xl transition-shadow duration-300 rounded-xl"
                            >
                                <EventCard isCustomer={true} item={item} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 animate-fade-in">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                            <span className="text-4xl">📅</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold text-neutral-800 mb-2">
                            No Upcoming Events
                        </h3>
                        <p className="text-neutral-600">
                            Check back later for new events in your area!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
