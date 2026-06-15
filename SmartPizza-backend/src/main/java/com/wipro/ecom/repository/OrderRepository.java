package com.wipro.ecom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wipro.ecom.entities.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);
    
    @Query(name="Order.findByStatus")
    List<Order> getOrdersByStatus(@Param ("status") String status);
    
    //hql
    @Query("SELECT o FROM Order o WHERE o.totalAmount > :amount")
    List<Order> findHighValueOrders(@Param("amount") double amount);
    
    //native query
    @Query(value = "SELECT * FROM orders ORDER BY total_amount DESC LIMIT 5", nativeQuery = true)
    List<Order> getTopOrders();

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'PAID'")
    Double getTotalRevenue();

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> getOrderStatusCount();

    @Query("SELECT o.user.id, COUNT(o) FROM Order o GROUP BY o.user.id ORDER BY COUNT(o) DESC")
    List<Object[]> getTopCustomers();
    
    @Query("""
    		SELECT a.city, COUNT(o)
    		FROM Order o
    		JOIN o.deliveryAddress a
    		GROUP BY a.city
    		""")
    		List<Object[]> getOrdersByCity();
    		
    @Query("""
    		SELECT DATE(o.createdAt), COUNT(DISTINCT o.user.id)
    		FROM Order o
    		GROUP BY DATE(o.createdAt)
    		""")
    		List<Object[]> getActiveUsersByDate();

    @Query("""
            SELECT DATE(o.createdAt), COUNT(o)
            FROM Order o
            GROUP BY DATE(o.createdAt)
            ORDER BY DATE(o.createdAt)
            """)
            List<Object[]> getDailyOrderCounts();
}