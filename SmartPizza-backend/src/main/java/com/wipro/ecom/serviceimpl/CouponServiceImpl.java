package com.wipro.ecom.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wipro.ecom.dtos.CouponDTO;
import com.wipro.ecom.dtos.CouponResponseDTO;
import com.wipro.ecom.entities.Coupon;
import com.wipro.ecom.enumpackage.DiscountType;
import com.wipro.ecom.repository.CouponRepository;
import com.wipro.ecom.services.CouponService;


@Service
public class CouponServiceImpl implements CouponService {

    @Autowired
    private CouponRepository couponRepo;

    @Override
    public CouponResponseDTO applyCoupon(String code, double orderAmount) {

        Coupon coupon = couponRepo.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid Coupon"));

        if (coupon.getExpiryDate() != null &&
                coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Coupon expired");
        }

        if (orderAmount < coupon.getMinOrderAmount()) {
            throw new RuntimeException(
                "Minimum order amount should be " + coupon.getMinOrderAmount()
            );
        }

        double discountAmount;

        if (coupon.getType() == DiscountType.FLAT) {
            discountAmount = coupon.getDiscount();
        } else {
            discountAmount = (orderAmount * coupon.getDiscount()) / 100;
        }

        discountAmount = Math.min(discountAmount, orderAmount);

        double finalAmount = orderAmount - discountAmount;

        CouponResponseDTO response = new CouponResponseDTO();
        response.setCode(coupon.getCode());
        response.setDiscountAmount(discountAmount);
        response.setFinalAmount(finalAmount);
        response.setMessage("Coupon applied successfully");

        return response;
    }

    @Override
    public List<CouponDTO> getAllCoupons() {
        return couponRepo.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    public CouponDTO getCouponById(Long id) {
        Coupon coupon = couponRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        return toDTO(coupon);
    }

    @Override
    public CouponDTO createCoupon(CouponDTO dto) {
        if (couponRepo.findByCode(dto.getCode()).isPresent()) {
            throw new RuntimeException("Coupon code already exists");
        }
        Coupon coupon = toEntity(dto);
        coupon = couponRepo.save(coupon);
        return toDTO(coupon);
    }

    @Override
    public CouponDTO updateCoupon(Long id, CouponDTO dto) {
        Coupon coupon = couponRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
        coupon.setCode(dto.getCode());
        coupon.setDiscount(dto.getDiscount());
        coupon.setType(DiscountType.valueOf(dto.getType()));
        coupon.setMinOrderAmount(dto.getMinOrderAmount());
        coupon.setExpiryDate(dto.getExpiryDate());
        coupon = couponRepo.save(coupon);
        return toDTO(coupon);
    }

    @Override
    public void deleteCoupon(Long id) {
        if (!couponRepo.existsById(id)) {
            throw new RuntimeException("Coupon not found");
        }
        couponRepo.deleteById(id);
    }

    private CouponDTO toDTO(Coupon c) {
        CouponDTO dto = new CouponDTO();
        dto.setId(c.getId());
        dto.setCode(c.getCode());
        dto.setDiscount(c.getDiscount());
        dto.setType(c.getType().name());
        dto.setMinOrderAmount(c.getMinOrderAmount());
        dto.setExpiryDate(c.getExpiryDate());
        return dto;
    }

    private Coupon toEntity(CouponDTO dto) {
        Coupon c = new Coupon();
        c.setCode(dto.getCode());
        c.setDiscount(dto.getDiscount());
        c.setType(DiscountType.valueOf(dto.getType()));
        c.setMinOrderAmount(dto.getMinOrderAmount());
        c.setExpiryDate(dto.getExpiryDate() != null ? dto.getExpiryDate() : LocalDateTime.now().plusDays(30));
        return c;
    }
}