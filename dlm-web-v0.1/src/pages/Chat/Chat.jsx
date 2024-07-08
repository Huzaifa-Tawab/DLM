import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";

const Chat = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    
  },[])
  useEffect(() => {
    if (chatId) {
      const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
          messages.push(doc.data());
        });
        setMessages(messages);
      });
      return () => unsubscribe();
    }
  }, [chatId]);

  const handleSend = async () => {
    if (newMessage.trim() !== "") {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        // id:
        text: newMessage,
        timestamp: new Date()
      });
      setNewMessage("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;
