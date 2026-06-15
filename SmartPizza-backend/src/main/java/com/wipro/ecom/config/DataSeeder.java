package com.wipro.ecom.config;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.wipro.ecom.entities.Coupon;
import com.wipro.ecom.entities.DeliveryAgent;
import com.wipro.ecom.entities.Role;
import com.wipro.ecom.entities.User;
import com.wipro.ecom.enumpackage.DiscountType;
import com.wipro.ecom.repository.CouponRepository;
import com.wipro.ecom.repository.DeliveryAgentRepository;
import com.wipro.ecom.repository.RoleRepository;
import com.wipro.ecom.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CouponRepository couponRepo;

    @Autowired
    private DeliveryAgentRepository agentRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed each role individually (idempotent)
        seedRoleIfMissing("USER");
        seedRoleIfMissing("ADMIN");
        Role deliveryRole = seedRoleIfMissing("DELIVERY");

        // Seed a default admin user if not exists
        if (userRepo.findByEmail("admin@smartpizza.com").isEmpty()) {
            Role adminRole = roleRepo.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));

            User admin = new User();
            admin.setName("Admin");
            admin.setUsername("admin@smartpizza.com");
            admin.setEmail("admin@smartpizza.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setMobile("9999999999");
            admin.setRoles(Set.of(adminRole));

            userRepo.save(admin);
            System.out.println("✅ Default admin user created (admin@smartpizza.com / admin123).");
        }

        // Seed delivery agent accounts if not yet created
        String[][] agentData = {
            {"Rajesh Kumar", "9876543210", "rajesh@smartpizza.com"},
            {"Suresh Patel", "9876543211", "suresh@smartpizza.com"},
            {"Amit Singh",   "9876543212", "amit@smartpizza.com"},
            {"Vijay Reddy",  "9876543213", "vijay@smartpizza.com"},
            {"Ravi Sharma",  "9876543214", "ravi@smartpizza.com"}
        };

        for (String[] data : agentData) {
            String email = data[2];
            if (userRepo.findByEmail(email).isEmpty()) {
                User agentUser = new User();
                agentUser.setName(data[0]);
                agentUser.setUsername(email);
                agentUser.setEmail(email);
                agentUser.setPassword(passwordEncoder.encode("delivery123"));
                agentUser.setMobile(data[1]);
                agentUser.setRoles(Set.of(deliveryRole));
                userRepo.save(agentUser);

                // Check if a DeliveryAgent record already exists for this name, update it
                DeliveryAgent agent = agentRepo.findByPhone(data[1])
                        .orElseGet(() -> {
                            DeliveryAgent a = new DeliveryAgent();
                            a.setName(data[0]);
                            a.setPhone(data[1]);
                            a.setAvailable(true);
                            return a;
                        });
                agent.setUser(agentUser);
                agentRepo.save(agent);
            }
        }
        System.out.println("✅ Delivery agent accounts ready (e.g. rajesh@smartpizza.com / delivery123).");

        // Seed coupons if they don't exist
        if (couponRepo.count() == 0) {
            List<Coupon> coupons = List.of(
                createCoupon("PIZZA10", 10, DiscountType.PERCENTAGE, 200, 30),
                createCoupon("FLAT50", 50, DiscountType.FLAT, 300, 15),
                createCoupon("WELCOME20", 20, DiscountType.PERCENTAGE, 0, 45),
                createCoupon("FREEDELIVERY", 60, DiscountType.FLAT, 250, 20),
                createCoupon("HALF100", 100, DiscountType.FLAT, 400, 10),
                createCoupon("VEG15", 15, DiscountType.PERCENTAGE, 150, 25),
                createCoupon("LARGEPIE", 75, DiscountType.FLAT, 500, 7),
                createCoupon("MONSOON30", 30, DiscountType.PERCENTAGE, 299, 14),
                createCoupon("STUDENT25", 25, DiscountType.PERCENTAGE, 100, 60),
                createCoupon("FAMILYMEAL", 120, DiscountType.FLAT, 600, 5)
            );
            couponRepo.saveAll(coupons);
            System.out.println("✅ 10 coupons seeded.");
        }
    }

    private Coupon createCoupon(String code, double discount, DiscountType type,
                                 double minOrderAmount, int validityDays) {
        Coupon c = new Coupon();
        c.setCode(code);
        c.setDiscount(discount);
        c.setType(type);
        c.setMinOrderAmount(minOrderAmount);
        c.setExpiryDate(LocalDateTime.now().plusDays(validityDays));
        return c;
    }

    private Role seedRoleIfMissing(String name) {
        return roleRepo.findByName(name).orElseGet(() -> {
            Role role = new Role(null, name);
            roleRepo.save(role);
            System.out.println("✅ Role '" + name + "' created.");
            return role;
        });
    }
}
