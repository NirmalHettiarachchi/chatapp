import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Chat = ({ token }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiver, setReceiver] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get("http://localhost:8080/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data.data);
    };
    fetchMessages();

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      client.subscribe("/topic/messages", (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:8080/api/messages",
      { content: newMessage, receiverId: receiver },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessages([...messages, response.data.data]);
    setNewMessage("");
    setReceiver("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Chat</h2>
        <div className="mb-6">
          <div className="bg-gray-200 p-4 rounded-lg h-64 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="mb-2">
                <strong>
                  {msg.senderId} to {msg.receiverId}:{" "}
                </strong>
                {msg.content}
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Receiver's username"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Type a message"
            />
          </div>
          <button
            type="submit"
            className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
