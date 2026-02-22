import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../../components/ui/Table';
import { Modal, Card } from '../../components/ui/Modal';
import CreateCategory from './CreateCategory';
import { deleteCategoryAction } from '../../state/customers/Restaurant/restaurant.action';

const Category = () => {
  const dispatch = useDispatch();
  const { restaurant, auth } = useSelector(store => store);
  const jwt = localStorage.getItem("jwt");
  const [openCreateCategory, setOpenCreateCategory] = React.useState(false);
  const handleOpenCreateCategory = () => setOpenCreateCategory(true);
  const handleCloseCreateCategory = () => setOpenCreateCategory(false);

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategoryAction({ categoryId, jwt: auth.jwt || jwt }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-neutral-900">Categories</h2>
            <p className="text-sm text-neutral-500 mt-1">Manage your food categories</p>
          </div>
          <button
            onClick={handleOpenCreateCategory}
            className="btn-primary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Category</span>
          </button>
        </div>

        {/* Table */}
        {restaurant.categories && restaurant.categories.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>ID</TableCell>
                <TableCell header>Name</TableCell>
                <TableCell header style={{ width: "100px", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurant.categories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <button
                      onClick={() => handleDeleteCategory(item.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete category"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">No categories yet</h3>
            <p className="text-neutral-600 mb-4">Create your first category to organize your menu</p>
            <button onClick={handleOpenCreateCategory} className="btn-primary">
              Add Your First Category
            </button>
          </div>
        )}
      </Card>

      {/* Create Category Modal */}
      <Modal
        open={openCreateCategory}
        onClose={handleCloseCreateCategory}
        title="Create Category"
        maxWidth="md"
      >
        <CreateCategory handleClose={handleCloseCreateCategory} />
      </Modal>
    </div>
  );
};

export default Category;