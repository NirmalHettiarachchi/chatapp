package com.ns.chatapp.service;

import com.ns.chatapp.model.Message;
import com.ns.chatapp.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public Message save(Message message) {
        message.setTimestamp(System.currentTimeMillis());
        return messageRepository.save(message);
    }

    public List<Message> findMessagesByUserId(String userId) {
        return messageRepository.findBySenderIdOrReceiverId(userId, userId);
    }
}
