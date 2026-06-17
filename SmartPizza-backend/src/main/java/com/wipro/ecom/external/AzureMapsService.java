package com.wipro.ecom.external;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AzureMapsService {

    private static final double FALLBACK_LAT = 13.0827;
    private static final double FALLBACK_LNG = 80.2707;

    @Value("${azure.maps.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // ✅ GET ROUTE
    public String getRoute(double startLat, double startLng,
                           double endLat, double endLng) {

        String url = "https://atlas.microsoft.com/route/directions/json" +
                "?api-version=1.0" +
                "&query=" + startLat + "," + startLng + ":" + endLat + "," + endLng +
                "&subscription-key=" + apiKey;

        try {
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            return null;
        }
    }

    // ✅ ETA FROM AZURE
    public double getETA(double startLat, double startLng,
                         double endLat, double endLng) {

        String response = getRoute(startLat, startLng, endLat, endLng);
        if (response == null) return 10.0;

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            double seconds = root
                    .path("routes")
                    .get(0)
                    .path("summary")
                    .path("travelTimeInSeconds")
                    .asDouble();

            return seconds / 60; // ✅ minutes
        } catch (Exception e) {
            return 10.0; // fallback
        }
    }
    public double[] getCoordinates(String address) {

        // Try Azure Maps first
        try {
            String url = "https://atlas.microsoft.com/search/address/json"
                    + "?api-version=1.0"
                    + "&subscription-key=" + apiKey
                    + "&query=" + address;

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            Map body = response.getBody();

            List results = (List) body.get("results");

            if (!results.isEmpty()) {
                Map position = (Map) ((Map) results.get(0)).get("position");
                double lat = (double) position.get("lat");
                double lon = (double) position.get("lon");
                return new double[]{lat, lon};
            }
        } catch (Exception e) {
            // Azure Maps failed, try fallback
        }

        // Fallback: try Nominatim (free, no key needed)
        try {
            String url = "https://nominatim.openstreetmap.org/search?format=json&q=" + address + "&limit=1";
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            List results = response.getBody();
            if (results != null && !results.isEmpty()) {
                Map first = (Map) results.get(0);
                double lat = Double.parseDouble((String) first.get("lat"));
                double lon = Double.parseDouble((String) first.get("lon"));
                return new double[]{lat, lon};
            }
        } catch (Exception e) {
            // Nominatim also failed
        }

        return new double[]{FALLBACK_LAT, FALLBACK_LNG};
    }

}
