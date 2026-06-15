package com.wipro.ecom.serviceimpl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.wipro.ecom.dtos.CouponResponseDTO;
import com.wipro.ecom.entities.Coupon;
import com.wipro.ecom.enumpackage.DiscountType;
import com.wipro.ecom.repository.CouponRepository;

@ExtendWith(MockitoExtension.class)
class CouponServiceImplTest {

    @Mock
    private CouponRepository couponRepo;

    @InjectMocks
    private CouponServiceImpl couponService;

    private Coupon flatCoupon;
    private Coupon percentCoupon;

    @BeforeEach
    void setUp() {
        flatCoupon = new Coupon();
        flatCoupon.setCode("FLAT50");
        flatCoupon.setDiscount(50);
        flatCoupon.setType(DiscountType.FLAT);
        flatCoupon.setMinOrderAmount(200);
        flatCoupon.setExpiryDate(LocalDateTime.now().plusDays(30));

        percentCoupon = new Coupon();
        percentCoupon.setCode("PCT10");
        percentCoupon.setDiscount(10);
        percentCoupon.setType(DiscountType.PERCENTAGE);
        percentCoupon.setMinOrderAmount(100);
        percentCoupon.setExpiryDate(LocalDateTime.now().plusDays(30));
    }

    @Test
    void testApplyCoupon_FLAT() {
        when(couponRepo.findByCode("FLAT50")).thenReturn(Optional.of(flatCoupon));

        CouponResponseDTO response = couponService.applyCoupon("FLAT50", 500);

        assertEquals(50, response.getDiscountAmount());
        assertEquals(450, response.getFinalAmount());
    }

    @Test
    void testApplyCoupon_PERCENTAGE() {
        when(couponRepo.findByCode("PCT10")).thenReturn(Optional.of(percentCoupon));

        CouponResponseDTO response = couponService.applyCoupon("PCT10", 500);

        assertEquals(50, response.getDiscountAmount());
        assertEquals(450, response.getFinalAmount());
    }

    @Test
    void testApplyCoupon_InvalidCode() {
        when(couponRepo.findByCode("INVALID")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> couponService.applyCoupon("INVALID", 100));
    }

    @Test
    void testApplyCoupon_Expired() {
        Coupon expired = new Coupon();
        expired.setCode("EXP");
        expired.setDiscount(20);
        expired.setType(DiscountType.FLAT);
        expired.setMinOrderAmount(0);
        expired.setExpiryDate(LocalDateTime.now().minusDays(1));

        when(couponRepo.findByCode("EXP")).thenReturn(Optional.of(expired));

        assertThrows(RuntimeException.class, () -> couponService.applyCoupon("EXP", 500));
    }

    @Test
    void testApplyCoupon_MinAmountNotMet() {
        when(couponRepo.findByCode("FLAT50")).thenReturn(Optional.of(flatCoupon));

        assertThrows(RuntimeException.class, () -> couponService.applyCoupon("FLAT50", 50));
    }
}
