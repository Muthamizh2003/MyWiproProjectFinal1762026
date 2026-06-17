package com.wipro.ecom.services;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class RazorpayService {

    private static final Logger log = LoggerFactory.getLogger(RazorpayService.class);

    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret}")
    private String secret;

    public Order createOrder(double amount) throws Exception {
        log.info("Creating Razorpay order for amount: {}", amount);

        RazorpayClient client = new RazorpayClient(key, secret);

        JSONObject options = new JSONObject();

        options.put("amount", (int)(amount * 100)); // paise
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = client.orders.create(options);
        log.info("Razorpay order created: {}", String.valueOf(order.get("id")));
        return order;
    }
}