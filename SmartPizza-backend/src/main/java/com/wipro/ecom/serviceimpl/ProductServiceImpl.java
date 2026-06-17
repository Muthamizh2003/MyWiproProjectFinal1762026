package com.wipro.ecom.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wipro.ecom.dtos.ProductDTO;
import com.wipro.ecom.entities.Category;
import com.wipro.ecom.entities.Product;
import com.wipro.ecom.repository.CategoryRepository;
import com.wipro.ecom.repository.ProductRepository;
import com.wipro.ecom.services.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ProductServiceImpl implements ProductService {

	private static final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

	@Autowired
    private ProductRepository productRepo;
	
	@Autowired
    private CategoryRepository categoryRepo;

    //ADD PRODUCT(ADMIN)
    @Override
    public ProductDTO addProduct(ProductDTO dto) {
        log.info("Adding product: {}", dto.getName());

        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setSize(dto.getSize());
        product.setDescription(dto.getDescription());
        Category category = categoryRepo.findByName(dto.getCategoryName())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);
        Product saved = productRepo.save(product);
        log.info("Product added: {} with id: {}", saved.getName(), saved.getId());
        return mapToDTO(saved);
    }

    //GET ALL PRODUCTS
    @Override
    public List<ProductDTO> getAllProducts() {
        log.info("Fetching all products");
        return productRepo.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    //GET PRODUCT BY ID
    @Override
    public ProductDTO getProductById(Long id) {
        log.info("Fetching product by id: {}", id);
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return mapToDTO(product);
    }

    //GET BY CATEGORY
    @Override
    public List<ProductDTO> getByCategory(String categoryName) {
        log.info("Fetching products by category: {}", categoryName);
        return productRepo.findByCategory_Name(categoryName)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    //UPDATE PRODUCT
    @Override
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        log.info("Updating product: {}", id);

        Product product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setSize(dto.getSize());
        product.setDescription(dto.getDescription());
        if (dto.getCategoryName() != null) {
            Category category = categoryRepo.findByName(dto.getCategoryName())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        return mapToDTO(productRepo.save(product));
    }

    //DELETE PRODUCT
    @Override
    public void deleteProduct(Long id) {
        log.info("Deleting product: {}", id);

        if (!productRepo.existsById(id)) {
            throw new RuntimeException("Product not found");
        }

        productRepo.deleteById(id);
        log.info("Product deleted: {}", id);
    }

    //MAPPER METHOD
    private ProductDTO mapToDTO(Product p) {

        ProductDTO dto = new ProductDTO();

        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setPrice(p.getPrice());
        dto.setSize(p.getSize());
        dto.setDescription(p.getDescription());
        if (p.getCategory() != null) {
            dto.setCategoryName(p.getCategory().getName());
        }

        return dto;
    }

	@Override
	public List<ProductDTO> getByPriceLessThan(double price) {
		// TODO Auto-generated method stub
		return productRepo.findByPriceLessThan(price)
				.stream()
				.map(this::mapToDTO)
				.toList();
	}

	@Override
	public List<ProductDTO> getBySize(String size) {
		// TODO Auto-generated method stub
		return productRepo.findBySize(size)
            .stream()
            .map(this::mapToDTO)
            .toList();

	}

	@Override
	public List<ProductDTO> searchByName(String keyword) {
		// TODO Auto-generated method 
		return productRepo.findByNameContainingIgnoreCase(keyword)
	            .stream()
	            .map(this::mapToDTO)
	            .toList();
	}

	@Override
	public List<ProductDTO> getPriceRange(double min, double max) {
		// TODO Auto-generated method stub
		return productRepo.findByPriceRange(min, max)
            .stream()
            .map(this::mapToDTO)
            .toList();

	}

	@Override
	public List<ProductDTO> getTopExpensive() {
		// TODO Auto-generated method stub

		return productRepo.findTop5ByOrderByPriceDesc()
            .stream()
            .map(this::mapToDTO)
            .toList();

	}

	@Override
	public List<ProductDTO> getTopCheap() {
		// TODO Auto-generated method stub

		return productRepo.findTop5ByOrderByPriceAsc()
            .stream()
            .map(this::mapToDTO)
            .toList();

	}

	@Override
	public List<ProductDTO> getAIRecommendations(String category) {
		// TODO Auto-generated method stub
		return productRepo.recommendByCategory(category)
            .stream()
            .map(this::mapToDTO)
            .toList();

	}

	@Override
	public List<ProductDTO> getRandomProducts() {
		// TODO Auto-generated method stub

		return productRepo.getRandomProducts()
            .stream()
            .map(this::mapToDTO)
            .toList();

	}
}