import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCategoryAction } from '../../state/customers/Restaurant/restaurant.action';
import { Input, Button } from '../../components/ui/Form';

const CreateCategory = ({ handleClose }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const jwt = localStorage.getItem("jwt");

  const [formData, setFormData] = useState({
    categoryName: '',
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const data = {
      name: formData.categoryName,
      restaurantId: id,
    };
    dispatch(createCategoryAction({ reqData: data, jwt: auth.jwt || jwt }));
    setFormData({
      categoryName: '',
    });
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleFormSubmit}>
      <Input
        label="Category Name"
        name="categoryName"
        value={formData.categoryName}
        onChange={handleInputChange}
        placeholder="e.g., Appetizers, Main Course, Desserts"
        required
      />

      <div className="flex items-center space-x-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          Create Category
        </Button>
        <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreateCategory;
