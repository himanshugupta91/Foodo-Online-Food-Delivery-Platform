export function isValid(cartItems) {
  console.log("cartItems -------------- ", cartItems[0].food?.restaurantId)
  const restaurantId = cartItems[0]?.food?.restaurantId

  for (let item of cartItems) {
    console.log("item ---- ", item.restaurant?.id)
    if (item.food?.restaurantId !== restaurantId) {
      return false;
    }
  }
  return true
}