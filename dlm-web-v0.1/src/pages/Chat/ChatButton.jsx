import React, { useState } from 'react';
import Chat from './Chat';
import { db } from '../../firebase'; 
import { collection, addDoc } from "firebase/firestore";

const ChatButton = ({ user1Id, user2Id }) => {
  const [chatId, setChatId] = useState(null);

  const handleClick = async () => {
    const chatRef = await addDoc(collection(db, "chats"), {
      participants: [user1Id, user2Id],
      createdAt: new Date()
    });
    setChatId(chatRef.id);
  };

  return (
    <div>
      <button onClick={handleClick}>Open Chat</button>
      {chatId && <Chat chatId={chatId} />}
    </div>
  );
};

export default ChatButton;
