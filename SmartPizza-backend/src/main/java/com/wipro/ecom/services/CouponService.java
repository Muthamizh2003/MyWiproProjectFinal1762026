package com.wipro.ecom.services;

import java.util.List;

import com.wipro.ecom.dtos.CouponDTO;
import com.wipro.ecom.dtos.CouponResponseDTO;

public interface CouponService {

    CouponResponseDTO applyCoupon(String code, double orderAmount);

    List<CouponDTO> getAllCoupons();

    CouponDTO getCouponById(Long id);

    CouponDTO createCoupon(CouponDTO dto);

    CouponDTO updateCoupon(Long id, CouponDTO dto);

    void deleteCoupon(Long id);
}