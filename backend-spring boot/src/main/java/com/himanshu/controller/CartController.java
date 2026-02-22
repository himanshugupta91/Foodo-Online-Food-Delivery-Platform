package com.himanshu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.response.CartDto;
import com.himanshu.dto.response.CartItemDto;
import com.himanshu.mapper.CartMapper;
import com.himanshu.exception.CartException;
import com.himanshu.exception.CartItemException;
import com.himanshu.exception.FoodException;
import com.himanshu.exception.UserException;
import com.himanshu.model.entity.Cart;
import com.himanshu.model.entity.CartItem;
import com.himanshu.model.entity.User;
import com.himanshu.dto.request.AddCartItemRequest;
import com.himanshu.dto.request.UpdateCartItemRequest;
import com.himanshu.service.CartService;
import com.himanshu.service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class CartController {

	private final CartService cartService;
	private final UserService userService;
	private final CartMapper cartMapper;



	/**
	 * Add an item to the user's cart.
	 *
	 * @param req The add item request.
	 * @param jwt The JWT token of the user.
	 * @return The updated cart item.
	 * @throws UserException     If user not found.
	 * @throws FoodException     If food not found.
	 * @throws CartException     If cart not found.
	 * @throws CartItemException If cart item error.
	 */
	@PutMapping("/cart/add")
	public ResponseEntity<ApiResponse<CartItemDto>> addItemToCart(@Valid @RequestBody AddCartItemRequest req,
			@RequestHeader("Authorization") String jwt)
			throws UserException, FoodException, CartException, CartItemException {
		CartItem cartItem = cartService.addItemToCart(req, jwt);
		CartItemDto cartItemDto = cartMapper.cartItemToCartItemDto(cartItem);
		return ResponseEntity.ok(ApiResponse.success(cartItemDto, "Item added to cart"));

	}

	/**
	 * Update the quantity of a cart item.
	 *
	 * @param req The update request.
	 * @param jwt The JWT token of the user.
	 * @return The updated cart item.
	 * @throws CartItemException If cart item not found.
	 */
	@PutMapping("/cart-item/update")
	public ResponseEntity<ApiResponse<CartItemDto>> updateCartItemQuantity(
			@Valid @RequestBody UpdateCartItemRequest req,
			@RequestHeader("Authorization") String jwt) throws CartItemException {
		CartItem cartItem = cartService.updateCartItemQuantity(req.getCartItemId(), req.getQuantity());
		CartItemDto cartItemDto = cartMapper.cartItemToCartItemDto(cartItem);
		return ResponseEntity.ok(ApiResponse.success(cartItemDto, "Cart item updated"));
	}

	/**
	 * Remove an item from the cart.
	 *
	 * @param id  The cart item ID.
	 * @param jwt The JWT token of the user.
	 * @return The updated cart.
	 * @throws UserException     If user not found.
	 * @throws CartException     If cart not found.
	 * @throws CartItemException If cart item not found.
	 */
	@DeleteMapping("/cart-item/{id}/remove")
	public ResponseEntity<ApiResponse<CartDto>> removeItemFromCart(@PathVariable Long id,
			@RequestHeader("Authorization") String jwt) throws UserException, CartException, CartItemException {

		Cart cart = cartService.removeItemFromCart(id, jwt);
		CartDto cartDto = cartMapper.cartToCartDto(cart);
		return ResponseEntity.ok(ApiResponse.success(cartDto, "Item removed from cart"));

	}

	/**
	 * Calculate cart totals.
	 *
	 * @param cartId The cart ID.
	 * @param jwt    The JWT token of the user.
	 * @return The total price.
	 * @throws UserException If user not found.
	 * @throws CartException If cart not found.
	 */
	@GetMapping("/cart/total")
	public ResponseEntity<ApiResponse<Double>> calculateCartTotals(@RequestParam Long cartId,
			@RequestHeader("Authorization") String jwt) throws UserException, CartException {

		User user = userService.findUserProfileByJwt(jwt);

		Cart cart = cartService.findCartByUserId(user.getId());
		double total = cartService.calculateCartTotals(cart);
		return ResponseEntity.ok(ApiResponse.success(total, "Cart total"));
	}

	/**
	 * Find the user's cart.
	 *
	 * @param jwt The JWT token of the user.
	 * @return The user's cart.
	 * @throws UserException If user not found.
	 * @throws CartException If cart not found.
	 */
	@GetMapping("/cart/")
	public ResponseEntity<ApiResponse<CartDto>> getUserCart(
			@RequestHeader("Authorization") String jwt) throws UserException, CartException {
		User user = userService.findUserProfileByJwt(jwt);
		Cart cart = cartService.findCartByUserId(user.getId());
		CartDto cartDto = cartMapper.cartToCartDto(cart);
		return ResponseEntity.ok(ApiResponse.success(cartDto, "User cart"));
	}

	/**
	 * Clear the user's cart.
	 *
	 * @param jwt The JWT token of the user.
	 * @return The cleared cart.
	 * @throws UserException If user not found.
	 * @throws CartException If cart not found.
	 */
	@PutMapping("/cart/clear")
	public ResponseEntity<ApiResponse<CartDto>> clearCart(
			@RequestHeader("Authorization") String jwt) throws UserException, CartException {
		User user = userService.findUserProfileByJwt(jwt);
		Cart cart = cartService.clearCart(user.getId());
		CartDto cartDto = cartMapper.cartToCartDto(cart);
		return ResponseEntity.ok(ApiResponse.success(cartDto, "Cart cleared"));
	}

	/**
	 * Get all items in a cart.
	 *
	 * @param cartId The cart ID.
	 * @param jwt    The JWT token of the user.
	 * @return List of cart items.
	 * @throws UserException If user not found.
	 * @throws CartException If cart not found.
	 */
	@GetMapping("/carts/{cartId}/items")
	public ResponseEntity<ApiResponse<List<CartItemDto>>> getCartItems(
			@PathVariable Long cartId,
			@RequestHeader("Authorization") String jwt) throws UserException, CartException {
		userService.findUserProfileByJwt(jwt);
		Cart cart = cartService.findCartById(cartId);
		List<CartItemDto> cartItemDtos = cart.getItems().stream()
				.map(cartMapper::cartItemToCartItemDto)
				.collect(java.util.stream.Collectors.toList());
		return ResponseEntity.ok(ApiResponse.success(cartItemDtos, "Cart items"));
	}

}
