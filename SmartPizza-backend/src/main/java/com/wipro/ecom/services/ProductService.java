package com.wipro.ecom.services;

import java.util.List;

import org.springframework.data.jpa.repository.Query;

import com.wipro.ecom.dtos.ProductDTO;

public interface ProductService {

    ProductDTO addProduct(ProductDTO dto);

    List<ProductDTO> getAllProducts();

    ProductDTO getProductById(Long id);

    List<ProductDTO> getByCategory(String category);

    List<ProductDTO> getByPriceLessThan(double price);

    List<ProductDTO> getBySize(String size);

    List<ProductDTO> searchByName(String keyword);

    List<ProductDTO> getPriceRange(double min, double max);

    List<ProductDTO> getTopExpensive();

    List<ProductDTO> getTopCheap();
    
    List<ProductDTO> getAIRecommendations(String category);

    List<ProductDTO> getRandomProducts();

	ProductDTO updateProduct(Long id, ProductDTO dto);

	void deleteProduct(Long id);
}
