package com.ns.chatapp.repository;

import com.ns.chatapp.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderIdOrReceiverId(String senderId, String receiverId);
}
