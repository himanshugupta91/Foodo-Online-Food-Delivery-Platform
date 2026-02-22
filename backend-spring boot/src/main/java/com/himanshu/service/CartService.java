package com.himanshu.service;

import com.himanshu.exception.CartException;
import com.himanshu.exception.CartItemException;
import com.himanshu.exception.FoodException;
import com.himanshu.exception.UserException;
import com.himanshu.model.entity.Cart;
import com.himanshu.model.entity.CartItem;
import com.himanshu.dto.request.AddCartItemRequest;

public interface CartService {

	public CartItem addItemToCart(AddCartItemRequest req, String jwt) throws UserException, FoodException, CartException, CartItemException;

	public CartItem updateCartItemQuantity(Long cartItemId,int quantity) throws CartItemException;

	public Cart removeItemFromCart(Long cartItemId, String jwt) throws UserException, CartException, CartItemException;

	public Long calculateCartTotals(Cart cart) throws UserException;
	
	public Cart findCartById(Long id) throws CartException;
	
	public Cart findCartByUserId(Long userId) throws CartException, UserException;
	
	public Cart clearCart(Long userId) throws CartException, UserException;
	

	

}
