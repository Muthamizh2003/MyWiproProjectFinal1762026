package com.wipro.ecom.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import com.wipro.ecom.dtos.ProductDTO;
import com.wipro.ecom.services.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    //ADD PRODUCT (ADMIN)
    @PostMapping
    public ProductDTO addProduct(@Valid @RequestBody ProductDTO dto) {
        return productService.addProduct(dto);
    }

    //GET ALL PRODUCTS
    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    //GET PRODUCT BY ID
    @GetMapping("/{id}")
    public ProductDTO getById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    //GET BY CATEGORY
    @GetMapping("/category/{category}")
    public List<ProductDTO> getByCategory(@PathVariable String category) {
        return productService.getByCategory(category);
    }

    //GET BY PRICE LESS THAN
    @GetMapping("/price-less-than/{price}")
    public List<ProductDTO> getByPrice(@PathVariable double price) {
        return productService.getByPriceLessThan(price);
    }

    //GET BY SIZE
    @GetMapping("/size/{size}")
    public List<ProductDTO> getBySize(@PathVariable String size) {
        return productService.getBySize(size);
    }

    //SEARCH BY NAME
    @GetMapping("/search/{keyword}")
    public List<ProductDTO> search(@PathVariable String keyword) {
        return productService.searchByName(keyword);
    }

    //GET PRICE RANGE
    @GetMapping("/price-range")
    public List<ProductDTO> getPriceRange(@RequestParam double min,
                                          @RequestParam double max) {
        return productService.getPriceRange(min, max);
    }

    //TOP EXPENSIVE
    @GetMapping("/top-expensive")
    public List<ProductDTO> getTopExpensive() {
        return productService.getTopExpensive();
    }

    //TOP CHEAP
    @GetMapping("/top-cheap")
    public List<ProductDTO> getTopCheap() {
        return productService.getTopCheap();
    }

    //AI RECOMMENDATIONS
    @GetMapping("/ai/{category}")
    public List<ProductDTO> getAIRecommendations(@PathVariable String category) {
        return productService.getAIRecommendations(category);
    }

    //RANDOM PRODUCTS
    @GetMapping("/random")
    public List<ProductDTO> getRandomProducts() {
        return productService.getRandomProducts();
    }

    //UPDATE PRODUCT (ADMIN)
    @PutMapping("/{id}")
    public ProductDTO updateProduct(@PathVariable Long id,
                                    @Valid @RequestBody ProductDTO dto) {
        return productService.updateProduct(id, dto);
    }

    //DELETE PRODUCT (ADMIN)
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "Product deleted successfully";
    }
}