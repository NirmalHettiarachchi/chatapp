package com.ns.chatapp.controller;

import com.ns.chatapp.model.Message;
import com.ns.chatapp.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message, Principal principal) {
        message.setSenderId(principal.getName());
        Message savedMessage = messageService.save(message);
        return ResponseEntity.ok(savedMessage);
    }

    @GetMapping
    public ResponseEntity<List<Message>> getMessages(Principal principal) {
        List<Message> messages = messageService.findMessagesByUserId(principal.getName());
        return ResponseEntity.ok(messages);
    }
}
