package com.himanshu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.himanshu.model.entity.Coupon;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCode(String code);
}
