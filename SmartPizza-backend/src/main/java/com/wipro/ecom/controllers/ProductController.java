package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.ProductDTO;
import com.wipro.ecom.services.ProductService;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;

    //ADD PRODUCT (ADMIN)
    @PostMapping
    public ProductDTO addProduct(@Valid @RequestBody ProductDTO dto) {
        log.info("Adding product: {}", dto.getName());
        return productService.addProduct(dto);
    }

    //GET ALL PRODUCTS
    @GetMapping
    public List<ProductDTO> getAllProducts() {
        log.info("Fetching all products");
        return productService.getAllProducts();
    }

    //GET PRODUCT BY ID
    @GetMapping("/{id}")
    public ProductDTO getById(@PathVariable Long id) {
        log.info("Fetching product by id: {}", id);
        return productService.getProductById(id);
    }

    //GET BY CATEGORY
    @GetMapping("/category/{category}")
    public List<ProductDTO> getByCategory(@PathVariable String category) {
        log.info("Fetching products by category: {}", category);
        return productService.getByCategory(category);
    }

    //GET BY PRICE LESS THAN
    @GetMapping("/price-less-than/{price}")
    public List<ProductDTO> getByPrice(@PathVariable double price) {
        log.info("Fetching products under price: {}", price);
        return productService.getByPriceLessThan(price);
    }

    //GET BY SIZE
    @GetMapping("/size/{size}")
    public List<ProductDTO> getBySize(@PathVariable String size) {
        log.info("Fetching products by size: {}", size);
        return productService.getBySize(size);
    }

    //SEARCH BY NAME
    @GetMapping("/search/{keyword}")
    public List<ProductDTO> search(@PathVariable String keyword) {
        log.info("Searching products by keyword: {}", keyword);
        return productService.searchByName(keyword);
    }

    //GET PRICE RANGE
    @GetMapping("/price-range")
    public List<ProductDTO> getPriceRange(@RequestParam double min,
                                          @RequestParam double max) {
        log.info("Fetching products in price range: {} - {}", min, max);
        return productService.getPriceRange(min, max);
    }

    //TOP EXPENSIVE
    @GetMapping("/top-expensive")
    public List<ProductDTO> getTopExpensive() {
        log.info("Fetching top expensive products");
        return productService.getTopExpensive();
    }

    //TOP CHEAP
    @GetMapping("/top-cheap")
    public List<ProductDTO> getTopCheap() {
        log.info("Fetching top cheap products");
        return productService.getTopCheap();
    }

    //AI RECOMMENDATIONS
    @GetMapping("/ai/{category}")
    public List<ProductDTO> getAIRecommendations(@PathVariable String category) {
        log.info("Fetching AI recommendations for category: {}", category);
        return productService.getAIRecommendations(category);
    }

    //RANDOM PRODUCTS
    @GetMapping("/random")
    public List<ProductDTO> getRandomProducts() {
        log.info("Fetching random products");
        return productService.getRandomProducts();
    }

    //UPDATE PRODUCT (ADMIN)
    @PutMapping("/{id}")
    public ProductDTO updateProduct(@PathVariable Long id,
                                    @Valid @RequestBody ProductDTO dto) {
        log.info("Updating product: {}", id);
        return productService.updateProduct(id, dto);
    }

    //DELETE PRODUCT (ADMIN)
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        log.info("Deleting product: {}", id);
        productService.deleteProduct(id);
        return "Product deleted successfully";
    }
}