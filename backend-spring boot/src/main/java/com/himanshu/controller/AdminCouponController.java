package com.himanshu.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.himanshu.dto.ApiResponse;
import com.himanshu.dto.request.CreateCouponRequest;
import com.himanshu.dto.request.UpdateCouponRequest;
import com.himanshu.dto.response.CouponDto;
import com.himanshu.exception.CouponException;
import com.himanshu.service.CouponService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/admin/coupons")
@RequiredArgsConstructor
public class AdminCouponController {

    private final CouponService couponService;

    /**
     * Create a new coupon.
     *
     * @param couponDto The coupon details.
     * @return The created coupon.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CouponDto>> createCoupon(@Valid @RequestBody CreateCouponRequest request)
            throws CouponException {
        CouponDto createdCoupon = couponService.createCoupon(request);
        return ResponseEntity.ok(ApiResponse.success(createdCoupon, "Coupon created successfully"));
    }

    /**
     * Get all coupons.
     *
     * @return List of all coupons.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CouponDto>>> getAllCoupons() {
        List<CouponDto> couponDtos = couponService.getAllCoupons();
        return ResponseEntity.ok(ApiResponse.success(couponDtos, "Coupons retrieved successfully"));
    }

    /**
     * Delete a coupon by ID.
     *
     * @param id The coupon ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCoupon(@PathVariable Long id) throws CouponException {
        couponService.deleteCouponById(id);
        return ResponseEntity.ok(ApiResponse.success("Success", "Coupon deleted successfully"));
    }

    /**
     * Update a coupon by ID.
     *
     * @param id        The coupon ID.
     * @param couponDto The coupon details.
     * @return The updated coupon.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponDto>> updateCoupon(@PathVariable Long id,
            @Valid @RequestBody UpdateCouponRequest request) throws CouponException {
        CouponDto updatedCoupon = couponService.updateCoupon(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedCoupon, "Coupon updated successfully"));
    }
}
