package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.CouponDTO;
import com.wipro.ecom.dtos.CouponResponseDTO;
import com.wipro.ecom.services.CouponService;

@RestController
@RequestMapping("/coupon")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @PostMapping("/apply")
    public CouponResponseDTO applyCoupon(@RequestParam String code,
                                          @RequestParam double orderAmount) {
        return couponService.applyCoupon(code, orderAmount);
    }

    @GetMapping("/all")
    public List<CouponDTO> getAllCoupons() {
        return couponService.getAllCoupons();
    }

    @GetMapping("/{id}")
    public CouponDTO getCoupon(@PathVariable Long id) {
        return couponService.getCouponById(id);
    }

    @PostMapping
    public CouponDTO createCoupon(@Valid @RequestBody CouponDTO dto) {
        return couponService.createCoupon(dto);
    }

    @PutMapping("/{id}")
    public CouponDTO updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponDTO dto) {
        return couponService.updateCoupon(id, dto);
    }

    @DeleteMapping("/{id}")
    public String deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return "Coupon deleted";
    }
}