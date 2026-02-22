package com.himanshu.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CouponDto {
    private Long id;
    private String code;
    private Long discountAmount;
    @Builder.Default
    private int discountPercentage = 0;
    private Date validityPeriod;
    private String termsAndConditions;
}
