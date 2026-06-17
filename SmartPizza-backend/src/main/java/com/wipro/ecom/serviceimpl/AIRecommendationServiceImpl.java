package com.wipro.ecom.serviceimpl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wipro.ecom.dtos.AIRequestDTO;
import com.wipro.ecom.dtos.ProductDTO;
import com.wipro.ecom.dtos.RecommendationDTO;
import com.wipro.ecom.entities.Order;
import com.wipro.ecom.entities.Product;
import com.wipro.ecom.external.AzureAIService;
import com.wipro.ecom.repository.OrderRepository;
import com.wipro.ecom.repository.ProductRepository;
import com.wipro.ecom.services.AIRecommendationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class AIRecommendationServiceImpl implements AIRecommendationService {

    private static final Logger log = LoggerFactory.getLogger(AIRecommendationServiceImpl.class);

    @Autowired
    private AzureAIService azureService;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Override
    public List<RecommendationDTO> getRecommendations(AIRequestDTO request) {
        log.info("Fetching AI recommendations for userId: {}, prompt: {}", request.getUserId(), request.getPrompt());

        String prompt = request.getPrompt();

        if (prompt == null || prompt.isEmpty()) {
            prompt = "Suggest 3 pizza combos";
            log.debug("Using default prompt for recommendations");
        }

        // SEASON
        if (request.getSeason() != null) {
            prompt += " suitable for " + request.getSeason() + " season";
        }

        // CATEGORY
        if (request.getCategory() != null) {
            prompt += " with " + request.getCategory() +  " items and rich descriptions";
        }

        // PRICE
        if (request.getMaxPrice() != null) {
            prompt += " under " + request.getMaxPrice();
        }

        // PERSONALIZATION
        if (request.getUserId() != null) {
            List<Order> orders = orderRepo.findByUserId(request.getUserId());

            if (!orders.isEmpty()) {
                List<String> favItems = orders.stream()
                        .flatMap(o -> o.getItems().stream())
                        .map(i -> i.getProduct().getName())
                        .distinct()
                        .limit(3)
                        .toList();

                prompt += " based on user's preference for " + favItems;
            }
        }

        prompt += ". Suggest EXACTLY 3 pizza combos. " +
                  "Each combo should have 3 items. " +
                  "Strict format: ComboName: item1,item2,item3. " +
                  "Do not add extra text.";
        List<Product> allProducts = productRepo.findAll();

        String productNames = allProducts.stream()
                .map(Product::getName)
                .toList()
                .toString();

        prompt += " Use ONLY these products: " + productNames +
                ". STRICTLY use ONLY these names." +
                " Do NOT invent or modify names." +
                " If unsure, skip that item.";
        
        //AI CALL
        String aiResponse = azureService.getAIResponse(prompt);

        if (aiResponse == null || aiResponse.isBlank()) {
            log.warn("AI response was empty, using fallback recommendations");
            return getFallbackCombosWithFilters(request);
        }

        List<RecommendationDTO> recommendations = parseAIResponse(aiResponse, allProducts);

        if (recommendations.isEmpty()) {
            log.warn("Failed to parse AI response, using fallback recommendations");
            return getFallbackCombosWithFilters(request);
        }

        log.info("Returning {} AI recommendations", recommendations.size());
        return recommendations;
    }

    //FILTERED FALLBACK
    private List<RecommendationDTO> getFallbackCombosWithFilters(AIRequestDTO request) {

        List<Product> products = productRepo.findAll();

        // CATEGORY
        if (request.getCategory() != null) {
            products = products.stream()
                    .filter(p -> p.getCategory().getName()
                            .equalsIgnoreCase(request.getCategory()))
                    .toList();
        }

        // PRICE
        if (request.getMaxPrice() != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() <= request.getMaxPrice())
                    .toList();
        }

        // SEASON
        if (request.getSeason() != null) {
            String season = request.getSeason().toUpperCase();

            if (season.equals("SUMMER")) {
                products = products.stream()
                        .filter(p -> p.getName().toLowerCase().contains("cold")
                        		||(p.getDescription() != null && p.getDescription().toLowerCase().contains("cold"))
                                || p.getName().toLowerCase().contains("drink")
                                ||(p.getDescription() != null && p.getDescription().toLowerCase().contains("drink")))
                        .toList();
            } else if (season.equals("WINTER")) {
                products = products.stream()
                        .filter(p -> p.getName().toLowerCase().contains("cheese")||
                        		(p.getDescription() != null && p.getDescription().toLowerCase().contains("cheese"))
                        		)
                        .toList();
            } else if (season.equals("MONSOON")) {
                products = products.stream()
                        .filter(p->p.getName().toLowerCase().contains("spicy") ||
                        		(p.getDescription() != null && p.getDescription().toLowerCase().contains("spicy")) 
                        		)
                        .toList();
            }
        }

        List<RecommendationDTO> result = new ArrayList<>();

        if (!products.isEmpty()) {
            result.add(buildCombo(products.stream().limit(3).toList(), "Filtered Combo 🔥"));

            if (products.size() > 3) {
                result.add(buildCombo(products.stream().skip(3).limit(3).toList(), "Top Picks ⭐"));
            }
        }

        //CRITICAL FIX (NO RECURSION)
        return result.isEmpty() ? getDefaultFallbackCombos() : result;
    }

    //DEFAULT FALLBACK (SAFE)
    private List<RecommendationDTO> getDefaultFallbackCombos() {

        List<RecommendationDTO> fallback = new ArrayList<>();

        List<Product> premium = productRepo.findTop5ByOrderByPriceDesc()
                .stream().limit(3).toList();

        fallback.add(buildCombo(premium, "Premium Combo 🔥"));

        List<Product> budget = productRepo.findTop5ByOrderByPriceAsc()
                .stream().limit(3).toList();

        fallback.add(buildCombo(budget, "Budget Combo 💰"));

        List<Product> random = productRepo.getRandomProducts()
                .stream().limit(3).toList();

        fallback.add(buildCombo(random, "Surprise Combo 🎁"));

        return fallback;
    }

    // BUILD COMBO
    private RecommendationDTO buildCombo(List<Product> products, String name) {

        double total = products.stream()
                .mapToDouble(Product::getPrice)
                .sum();

        RecommendationDTO dto = new RecommendationDTO();
        dto.setTitle(name);
        dto.setProducts(products.stream().map(this::mapToDTO).toList());
        dto.setTotalPrice(total);
        dto.setAiText("Fallback recommendation");

        return dto;
    }

    // PARSE AI RESPONSE
    private List<RecommendationDTO> parseAIResponse(String aiResponse, List<Product> allProducts){
    	
        List<RecommendationDTO> result = new ArrayList<>();

        List<String> lines = Arrays.stream(aiResponse.split("\n"))
                .filter(line -> line.contains(":"))
                .toList();

        for (String line : lines) {

            String[] parts = line.split(":");
            if (parts.length < 2) continue;

            String title = parts[0].trim();
            String[] items = parts[1].split(",");

            List<Product> matchedProducts = new ArrayList<>();

            for (String item : items) {

                String keyword = item.trim().toLowerCase();

                List<Product> matched = allProducts.stream()
                        .filter(p ->
                            p.getName().toLowerCase().contains(keyword) ||
                            keyword.contains(p.getName().toLowerCase())
                        )
                        .limit(1)
                        .toList();

                matchedProducts.addAll(matched);
            }

            matchedProducts = matchedProducts.stream()
                    .distinct()
                    .limit(3)
                    .toList();

            if (matchedProducts.size() != 3) continue; 

            double totalPrice = matchedProducts.stream()
                    .mapToDouble(Product::getPrice)
                    .sum();

            RecommendationDTO dto = new RecommendationDTO();
            dto.setTitle(title);
            dto.setProducts(matchedProducts.stream().map(this::mapToDTO).toList());
            dto.setTotalPrice(totalPrice);
            dto.setAiText(line);
            
            result.add(dto);
            if (result.size() == 3) break;
        }

        return result;
    }


    //MAPPER
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