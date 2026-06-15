package com.wipro.ecom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wipro.ecom.dtos.ProductDTO;
import com.wipro.ecom.entities.Category;
import com.wipro.ecom.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
	
    List<Product> findByCategory_Name(String category);

    List<Product> findByPriceLessThan(double price);

    List<Product> findBySize(String size);
    
    List<Product> findTop5ByOrderByPriceDesc();
    
    List<Product> findTop5ByOrderByPriceAsc();
    
    List<Product> findByNameContainingIgnoreCase(String keyword);
    
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max")
    List<Product> findByPriceRange(@Param("min") double a, @Param("max") double b);
    
    List<Product> findByCategory_NameAndSize(String category, String size);
    
    @Query("SELECT p FROM Product p WHERE p.category.name = ?1 ORDER BY p.price DESC")
    List<Product> recommendByCategory(String category);
    
    @Query(value = "SELECT * FROM products ORDER BY RAND() LIMIT 5", nativeQuery = true)
    List<Product> getRandomProducts();

}
