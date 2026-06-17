package com.wipro.ecom.serviceimpl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wipro.ecom.dtos.ComboDTO;
import com.wipro.ecom.dtos.ComboRequestDTO;
import com.wipro.ecom.dtos.ProductDTO;
import com.wipro.ecom.entities.Product;
import com.wipro.ecom.external.AzureAIService;
import com.wipro.ecom.repository.ProductRepository;
import com.wipro.ecom.services.ComboService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class ComboServiceImpl implements ComboService {

	private static final Logger log = LoggerFactory.getLogger(ComboServiceImpl.class);

	@Autowired
    private ProductRepository productRepo;
	
	@Autowired
    private AzureAIService azureService;

    @Override
    public List<ComboDTO> getSmartCombos(ComboRequestDTO request) {
        log.info("Generating smart combos with prompt: {}", request.getPrompt());

        String prompt = request.getPrompt();

        if (prompt == null || prompt.isEmpty()) {
            prompt = "Suggest 3 pizza combos under 500";
            prompt += " using rich product descriptions";
            log.debug("Using default prompt for combo generation");
        }
        

		List<Product> allProducts = productRepo.findAll();
		
		String productNames = allProducts.stream()
		        .map(Product::getName)
		        .toList()
		        .toString();
		
		String finalPrompt = prompt +
		        ". Use ONLY these products: " + productNames +
		        ". Do NOT invent new items." +
		        ". Give EXACTLY 3 combos." +
		        " Format: ComboName: item1,item2,item3";


        String aiResponse = azureService.getAIResponse(finalPrompt);

        //Safety check
        if (aiResponse == null || aiResponse.isBlank()) {
            log.warn("AI response was empty, using fallback combos");
            return getFallbackCombos();
        }

        List<ComboDTO> combos = parseAIResponse(aiResponse, allProducts);

        //fallback if AI fails
        if (combos.isEmpty()) {
            log.warn("Failed to parse AI response, using fallback combos");
            return getFallbackCombos();
        }

        log.info("Generated {} smart combos", combos.size());
        return combos;
    }
    
    private List<ComboDTO> parseAIResponse(String aiResponse, List<Product> allProducts)
    {

        List<ComboDTO> combos = new ArrayList<>();

        List<String> lines = Arrays.stream(aiResponse.split("\n"))
                .filter(line -> line.contains(":"))
                .toList();

        
        for (String line : lines) {

            String[] parts = line.split(":");

            if (parts.length < 2) continue;

            String comboName = parts[0].trim();
            String[] items = parts[1].split(",");

            List<Product> matchedProducts = new ArrayList<>();

            for (String item : items) {

                String keyword = item.trim().toLowerCase();

                List<Product> matched = allProducts.stream()
                	    .filter(p ->
                	        p.getName().toLowerCase().contains(keyword) ||
                	        keyword.contains(p.getName().toLowerCase()) ||
                	        (p.getDescription() != null &&
                	         p.getDescription().toLowerCase().contains(keyword))
                	    )
                    .limit(1)
                    .toList();

                matchedProducts.addAll(matched);
            }

            //remove duplicates + limit
            matchedProducts = matchedProducts.stream()
                    .distinct()
                    .limit(3)
                    .toList();

            //skip empty combo
            if (matchedProducts.size() != 3) continue;

            //calculate price
            double total = matchedProducts.stream()
                    .mapToDouble(Product::getPrice)
                    .sum();

            //build DTO
            ComboDTO dto = new ComboDTO();
            dto.setComboName(comboName);
            dto.setProducts(matchedProducts.stream().map(this::mapToDTO).toList());
            dto.setTotalPrice(total);
            dto.setAiSuggestion(line);

            combos.add(dto);
            if (combos.size() == 3) break;
        }

        return combos;
    }
    
    private List<ComboDTO> getFallbackCombos() {

        List<ComboDTO> fallback = new ArrayList<>();

        //Premium combo
        List<Product> top = productRepo.findTop5ByOrderByPriceDesc()
                .stream().limit(3).toList();

        fallback.add(buildCombo(top, "Premium Combo 🔥"));

        //Budget combo
        List<Product> cheap = productRepo.findTop5ByOrderByPriceAsc()
                .stream().limit(3).toList();

        fallback.add(buildCombo(cheap, "Budget Combo 💰"));

        //Random combo
        List<Product> random = productRepo.getRandomProducts();

        fallback.add(buildCombo(random.stream().limit(3).toList(), "Surprise Combo 🎁"));

        return fallback;
    }
    
    
    private ComboDTO buildCombo(List<Product> products, String name) {

        double total = products.stream()
                .mapToDouble(Product::getPrice)
                .sum();

        ComboDTO dto = new ComboDTO();
        dto.setComboName(name);
        dto.setProducts(products.stream().map(this::mapToDTO).toList());
        dto.setTotalPrice(total);
        dto.setAiSuggestion("Fallback Combo");

        return dto;
    }
    
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
    


}