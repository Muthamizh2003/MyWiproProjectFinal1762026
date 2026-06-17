package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.CouponDTO;
import com.wipro.ecom.dtos.CouponResponseDTO;
import com.wipro.ecom.services.CouponService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/coupon")
public class CouponController {

    private static final Logger log = LoggerFactory.getLogger(CouponController.class);

    @Autowired
    private CouponService couponService;

    @PostMapping("/apply")
    public CouponResponseDTO applyCoupon(@RequestParam String code,
                                          @RequestParam double orderAmount) {
        log.info("Applying coupon: {} on amount: {}", code, orderAmount);
        return couponService.applyCoupon(code, orderAmount);
    }

    @GetMapping("/all")
    public List<CouponDTO> getAllCoupons() {
        log.info("Fetching all coupons");
        return couponService.getAllCoupons();
    }

    @GetMapping("/{id}")
    public CouponDTO getCoupon(@PathVariable Long id) {
        log.info("Fetching coupon by id: {}", id);
        return couponService.getCouponById(id);
    }

    @PostMapping
    public CouponDTO createCoupon(@Valid @RequestBody CouponDTO dto) {
        log.info("Creating coupon: {}", dto.getCode());
        return couponService.createCoupon(dto);
    }

    @PutMapping("/{id}")
    public CouponDTO updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponDTO dto) {
        log.info("Updating coupon: {}", id);
        return couponService.updateCoupon(id, dto);
    }

    @DeleteMapping("/{id}")
    public String deleteCoupon(@PathVariable Long id) {
        log.info("Deleting coupon: {}", id);
        couponService.deleteCoupon(id);
        return "Coupon deleted";
    }
}