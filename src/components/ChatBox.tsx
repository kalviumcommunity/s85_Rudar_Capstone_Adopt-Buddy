import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Send, Loader2 } from 'lucide-react';

interface Message {
  _id?: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface ChatBoxProps {
  chatId: string;
  otherUser: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

const ChatBox = ({ chatId, otherUser }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { socket, connected } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/chats/${chatId}`);
        setMessages(data.messages);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (socket && connected) {
      socket.emit('join_chat', chatId);

      const handleReceiveMessage = (data: { chatId: string; message: Message }) => {
        if (data.chatId === chatId) {
          setMessages((prev) => [...prev, data.message]);
        }
      };

      socket.on('receive_message', handleReceiveMessage);

      return () => {
        socket.off('receive_message', handleReceiveMessage);
      };
    }
  }, [socket, connected, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await api.post(`/chats/${chatId}`, { content: newMessage });
      setNewMessage('');
      // The message will be added to the state via the socket event
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
        <img
          src={otherUser.profileImage || 'https://picsum.photos/seed/user/200/200'}
          alt={`${otherUser.firstName} ${otherUser.lastName}`}
          className="h-10 w-10 rounded-full object-cover border border-gray-200"
          referrerPolicy="no-referrer"
        />
        <div>
          <h3 className="font-semibold text-gray-900">
            {otherUser.firstName} {otherUser.lastName}
          </h3>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender === user?._id;
            return (
              <div
                key={msg._id || index}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isMe
                      ? 'bg-orange-500 text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 text-right ${
                      isMe ? 'text-orange-100' : 'text-gray-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors"
          >
            <Send className="h-4 w-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

// Import missing icon
import { MessageSquare } from 'lucide-react';

export default ChatBox;
