package com.himanshu.service;

import java.util.List;

import com.himanshu.dto.request.CreateCouponRequest;
import com.himanshu.dto.request.UpdateCouponRequest;
import com.himanshu.dto.response.CouponDto;
import com.himanshu.exception.CouponException;

public interface CouponService {

	CouponDto createCoupon(CreateCouponRequest request) throws CouponException;

	List<CouponDto> getAllCoupons();

	void deleteCouponById(Long id) throws CouponException;

	CouponDto updateCoupon(Long id, UpdateCouponRequest request) throws CouponException;
}
