package com.email.writer;


import com.email.writer.Model.EmailRequest;
import com.email.writer.Service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin("*")
public class EmailGeneratorController {

    private EmailService service;
    @PostMapping("/generate")
    public ResponseEntity<String> genEmail(@RequestBody EmailRequest emailRequest){
        String response = service.EmailReply(emailRequest);
        return ResponseEntity.ok(response);
    }
}
