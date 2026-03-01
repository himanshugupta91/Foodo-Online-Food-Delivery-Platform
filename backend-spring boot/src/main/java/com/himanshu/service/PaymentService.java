package com.himanshu.service;

import com.stripe.exception.StripeException;
import com.himanshu.model.entity.Order;
import com.himanshu.dto.response.PaymentResponse;

public interface PaymentService {

	public PaymentResponse generatePaymentLink(Order order) throws StripeException;

}
