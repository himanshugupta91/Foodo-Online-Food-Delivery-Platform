import React, { useState } from "react";
import AddressCard from "../../components/Address/AddressCard";
import NewAddress from "../../components/Address/NewAddressModal";
import { useSelector } from "react-redux";

const UsersAddresses = () => {
  const [open, setOpen] = useState(false);
  const { auth } = useSelector(state => state)
  return (
    <div className="animate-fade-in">
      <div className="flex items-center flex-col lg:px-10">
        <h1 className="text-xl text-center py-7 font-semibold">Addresses</h1>
        <div className="flex justify-center flex-wrap gap-3">
          {auth.user?.addresses.map((item) => (
            <AddressCard item={item} />
          ))}
          <div className="flex gap-5 min-w-[350px] w-64 bg-gray-50 h-[10rem] hover:shadow-md cursor-pointer justify-center items-center shadow-sm rounded-md border text-gray-500"
            onClick={() => setOpen(true)}
          >
            <h1 className="text-lg font-semibold">+ Add New Address</h1>
          </div>
        </div>
      </div>
      <NewAddress open={open} handleClose={() => setOpen(false)} />
    </div>
  );
};

export default UsersAddresses;
