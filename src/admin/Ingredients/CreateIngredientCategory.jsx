import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createIngredientCategory } from '../../state/admin/Ingredients/Action';
import { Input, Button } from '../../components/ui/Form';

const CreateIngredientCategoryForm = ({ handleClose }) => {
  const dispatch = useDispatch();
  const { auth, restaurant } = useSelector(store => store);
  const jwt = localStorage.getItem("jwt");

  const [formData, setFormData] = useState({
    name: '',
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const data = { name: formData.name, restaurantId: restaurant.usersRestaurant?.id };
    dispatch(createIngredientCategory({ jwt: auth.jwt || jwt, data }));
    setFormData({
      name: '',
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
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="e.g., Vegetables, Dairy, Spices"
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

export default CreateIngredientCategoryForm;
