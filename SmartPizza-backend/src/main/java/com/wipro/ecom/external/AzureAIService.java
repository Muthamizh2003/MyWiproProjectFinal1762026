package com.wipro.ecom.external;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AzureAIService {

    @Value("${azure.openai.api-key}")
    private String apiKey;

    @Value("${azure.openai.endpoint}")
    private String endpoint;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getAIResponse(String prompt) {

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            String body = """
            {
              "model": "gpt-4.1-mini",
              "input": "%s",
              "max_output_tokens": 200
            }
            """.formatted(prompt);

            HttpEntity<String> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    endpoint,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            String json = response.getBody();

            // ✅ SAFE JSON PARSING
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);

            JsonNode textNode = root
                    .path("output")
                    .path(0)
                    .path("content")
                    .path(0)
                    .path("text");

            if (textNode.isMissingNode()) {
                System.out.println("AI Response structure unexpected: " + json);
                return "";
            }

            return textNode.asText();

        } catch (Exception e) {
            e.printStackTrace();
            return ""; // fallback trigger
        }
    }

    public String generateComboSuggestion(String prompt) {
        return getAIResponse(prompt); // reuse same logic ✅
    }
}