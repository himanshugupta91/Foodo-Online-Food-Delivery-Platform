package com.himanshu.service.impl;

import com.himanshu.service.*;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.exception.CartException;
import com.himanshu.exception.CartItemException;
import com.himanshu.exception.FoodException;
import com.himanshu.exception.UserException;
import com.himanshu.model.entity.Cart;
import com.himanshu.model.entity.CartItem;
import com.himanshu.model.entity.Food;
import com.himanshu.model.entity.User;
import com.himanshu.repository.CartItemRepository;
import com.himanshu.repository.CartRepository;
import com.himanshu.repository.foodRepository;
import com.himanshu.dto.request.AddCartItemRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartServiceImpl implements CartService {
	private final CartRepository cartRepository;
	private final UserService userService;
	private final CartItemRepository cartItemRepository;
	private final foodRepository menuItemRepository;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public CartItem addItemToCart(AddCartItemRequest req, String jwt)
			throws UserException, FoodException, CartException, CartItemException {

		User user = userService.findUserProfileByJwt(jwt);

		Optional<Food> menuItem = menuItemRepository.findById(req.getMenuItemId());
		if (menuItem.isEmpty()) {
			throw new FoodException("Menu Item not exist with id " + req.getMenuItemId());
		}

		if (!menuItem.get().isAvailable()) {
			throw new FoodException("This item is currently unavailable or out of stock.");
		}

		Cart cart = findCartByUserId(user.getId());

		if (!cart.getItems().isEmpty()) {
			Long existingRestaurantId = cart.getItems().get(0).getFood().getRestaurant().getId();
			Long newRestaurantId = menuItem.get().getRestaurant().getId();

			if (!existingRestaurantId.equals(newRestaurantId)) {
				throw new CartException(
						"Cannot add items from different restaurants to the same cart. Please clear your cart first.");
			}
		}

		for (CartItem cartItem : cart.getItems()) {
			if (cartItem.getFood().equals(menuItem.get())) {

				int newQuantity = cartItem.getQuantity() + req.getQuantity();
				return updateCartItemQuantity(cartItem.getId(), newQuantity);
			}
		}

		CartItem newCartItem = new CartItem();
		newCartItem.setFood(menuItem.get());
		newCartItem.setQuantity(req.getQuantity());
		newCartItem.setCart(cart);
		newCartItem.setIngredients(req.getIngredients());
		newCartItem.setTotalPrice(req.getQuantity() * menuItem.get().getPrice());

		CartItem savedItem = cartItemRepository.save(newCartItem);
		cart.getItems().add(savedItem);

		cart.setTotal(calculateCartTotals(cart));
		cartRepository.save(cart);

		return savedItem;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public CartItem updateCartItemQuantity(Long cartItemId, int quantity) throws CartItemException {
		Optional<CartItem> cartItem = cartItemRepository.findById(cartItemId);
		if (cartItem.isEmpty()) {
			throw new CartItemException("cart item not exist with id " + cartItemId);
		}
		cartItem.get().setQuantity(quantity);
		cartItem.get().setTotalPrice((cartItem.get().getFood().getPrice() * quantity));
		CartItem savedItem = cartItemRepository.save(cartItem.get());

		Cart cart = cartItem.get().getCart();
		try {
			cart.setTotal(calculateCartTotals(cart));
			cartRepository.save(cart);
		} catch (UserException e) {

			throw new RuntimeException(e);
		}

		return savedItem;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Cart removeItemFromCart(Long cartItemId, String jwt) throws UserException,
			CartException, CartItemException {

		User user = userService.findUserProfileByJwt(jwt);

		Cart cart = findCartByUserId(user.getId());

		Optional<CartItem> cartItem = cartItemRepository.findById(cartItemId);

		if (cartItem.isEmpty()) {
			throw new CartItemException("cart item not exist with id " + cartItemId);
		}

		cart.getItems().remove(cartItem.get());

		cart.setTotal(calculateCartTotals(cart));

		return cartRepository.save(cart);
	}

	@Override
	public Long calculateCartTotals(Cart cart) throws UserException {

		Long total = 0L;
		for (CartItem cartItem : cart.getItems()) {
			total += cartItem.getFood().getPrice() * cartItem.getQuantity();
		}
		return total;
	}

	@Override
	public Cart findCartById(Long id) throws CartException {
		Optional<Cart> cart = cartRepository.findById(id);
		if (cart.isPresent()) {
			return cart.get();
		}
		throw new CartException("Cart not found with the id " + id);
	}

	@Override
	public Cart findCartByUserId(Long userId) throws CartException, UserException {

		Optional<Cart> opt = cartRepository.findByCustomer_Id(userId);

		if (opt.isPresent()) {
			return opt.get();
		}
		throw new CartException("cart not found");

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public Cart clearCart(Long userId) throws CartException, UserException {
		Cart cart = findCartByUserId(userId);

		cart.getItems().clear();
		cart.setTotal(0L);
		return cartRepository.save(cart);
	}

}
