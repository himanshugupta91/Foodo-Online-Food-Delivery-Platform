package com.himanshu.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.himanshu.dto.request.CreateCouponRequest;
import com.himanshu.dto.request.UpdateCouponRequest;
import com.himanshu.dto.response.CouponDto;
import com.himanshu.model.entity.Coupon;

@Mapper(componentModel = "spring")
public interface CouponMapper {

	CouponDto couponToCouponDto(Coupon coupon);

	List<CouponDto> couponsToCouponDtos(List<Coupon> coupons);

	@Mapping(target = "id", ignore = true)
	Coupon createCouponRequestToCoupon(CreateCouponRequest request);

	void updateCouponFromRequest(UpdateCouponRequest request, @MappingTarget Coupon coupon);
}
