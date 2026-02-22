package com.himanshu.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.himanshu.dto.request.CreateCouponRequest;
import com.himanshu.dto.request.UpdateCouponRequest;
import com.himanshu.dto.response.CouponDto;
import com.himanshu.exception.CouponException;
import com.himanshu.mapper.CouponMapper;
import com.himanshu.model.entity.Coupon;
import com.himanshu.repository.CouponRepository;
import com.himanshu.service.CouponService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CouponServiceImpl implements CouponService {

	private final CouponRepository couponRepository;
	private final CouponMapper couponMapper;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public CouponDto createCoupon(CreateCouponRequest request) throws CouponException {
		if (request == null) {
			throw new CouponException("Coupon payload is required.");
		}
		validateCouponPayload(request.getCode(), request.getDiscountAmount(), request.getDiscountPercentage());

		if (couponRepository.findByCode(request.getCode()).isPresent()) {
			throw new CouponException("Coupon with code '" + request.getCode() + "' already exists.");
		}

		Coupon coupon = couponMapper.createCouponRequestToCoupon(request);
		Coupon savedCoupon = couponRepository.save(coupon);
		return couponMapper.couponToCouponDto(savedCoupon);
	}

	@Override
	public List<CouponDto> getAllCoupons() {
		return couponMapper.couponsToCouponDtos(couponRepository.findAll());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteCouponById(Long id) throws CouponException {
		Coupon coupon = findCouponById(id);
		couponRepository.delete(coupon);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public CouponDto updateCoupon(Long id, UpdateCouponRequest request) throws CouponException {
		if (request == null) {
			throw new CouponException("Coupon payload is required.");
		}
		validateCouponPayload(request.getCode(), request.getDiscountAmount(), request.getDiscountPercentage());

		Coupon existingCoupon = findCouponById(id);
		Coupon duplicateCoupon = couponRepository.findByCode(request.getCode()).orElse(null);
		if (duplicateCoupon != null && !duplicateCoupon.getId().equals(id)) {
			throw new CouponException("Coupon with code '" + request.getCode() + "' already exists.");
		}

		couponMapper.updateCouponFromRequest(request, existingCoupon);
		Coupon savedCoupon = couponRepository.save(existingCoupon);
		return couponMapper.couponToCouponDto(savedCoupon);
	}

	private Coupon findCouponById(Long id) throws CouponException {
		return couponRepository.findById(id)
				.orElseThrow(() -> new CouponException("Coupon not found with id " + id));
	}

	private void validateCouponPayload(String code, Long discountAmount, int discountPercentage) throws CouponException {
		if (!StringUtils.hasText(code)) {
			throw new CouponException("Coupon code is required.");
		}
		if (discountAmount == null && discountPercentage <= 0) {
			throw new CouponException("Provide either discount amount or discount percentage.");
		}
	}
}
