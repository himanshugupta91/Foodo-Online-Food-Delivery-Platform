package com.himanshu.service.impl;

import com.himanshu.service.*;

import com.himanshu.model.entity.Order;
import com.himanshu.dto.response.PaymentResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

	@Value("${stripe.success.url:http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}}")
	private String stripeSuccessUrl;

	@Value("${stripe.cancel.url:http://localhost:3000/cart}")
	private String stripeCancelUrl;

	@Override
	public PaymentResponse generatePaymentLink(Order order) throws StripeException {

		String restaurantName = order.getRestaurant() != null ? order.getRestaurant().getName() : "Foodo";
		String productName = restaurantName + " Order #" + order.getId();

		SessionCreateParams params = SessionCreateParams.builder()
				.addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
				.setMode(SessionCreateParams.Mode.PAYMENT)
				.setSuccessUrl(stripeSuccessUrl)
				.setCancelUrl(stripeCancelUrl)
				.putMetadata("order_id", String.valueOf(order.getId()))
				.addLineItem(SessionCreateParams.LineItem.builder()
						.setQuantity(1L)
						.setPriceData(SessionCreateParams.LineItem.PriceData.builder()
								.setCurrency("usd")
								.setUnitAmount((long) order.getTotalAmount() * 100)

								.setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
										.setName(productName)
										.build())
								.build())
						.build())
				.build();

		Session session = Session.create(params);

		PaymentResponse res = new PaymentResponse();
		res.setPayment_url(session.getUrl());

		return res;

	}

}
