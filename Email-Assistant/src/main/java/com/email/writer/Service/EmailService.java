package com.email.writer.Service;

import com.email.writer.Model.EmailRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

/**
 * Service class responsible for generating professional email replies
 * using Google's Gemini API (or similar LLM-based text generation APIs).
 */
@Service
public class EmailService {

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApikey;

    private final WebClient webClient;

    /**
     * Constructor-based dependency injection of WebClient.
     */
    public EmailService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    /**
     * Generates a professional email reply using the AI model.
     *
     * @param emailRequest The request object containing the original email content and optional tone.
     * @return A generated professional reply as a string.
     */
    public String EmailReply(EmailRequest emailRequest) {
        String prompt = buildPrompt(emailRequest);

        // Gemini API expects the input in a specific format
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        // Make the HTTP POST request
        String response = webClient.post()
                .uri(geminiApiUrl + geminiApikey)
                .header("content-type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return extractResponseContent(response);
    }

    /**
     * Extracts the actual generated text from the Gemini API response.
     *
     * @param response The raw JSON string returned from the API.
     * @return The generated reply text.
     */
    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootnode = mapper.readTree(response);
            return rootnode
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }

    /**
     * Builds a prompt string for the AI model based on the user's request.
     *
     * @param emailRequest The original email content and tone.
     * @return A full prompt string to send to the AI API.
     */
    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate me only one professional email reply best suited for the following email content, please don't include the subject line. ");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone. ");
        }
        prompt.append("\nOriginal Email:\n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
