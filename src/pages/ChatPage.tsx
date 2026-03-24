import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ChatBox from '../components/ChatBox';
import { useAuth } from '../context/AuthContext';
import { Loader2, MessageSquare } from 'lucide-react';

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await api.get('/chats');
        setChats(data);
        if (data.length > 0) {
          setActiveChat(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch chats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex h-full">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No conversations yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {chats.map((chat: any) => {
                  const otherUser = chat.participants.find((p: any) => p._id !== user?._id);
                  const isActive = activeChat?._id === chat._id;
                  
                  return (
                    <li
                      key={chat._id}
                      onClick={() => setActiveChat(chat)}
                      className={`p-4 cursor-pointer hover:bg-orange-50 transition-colors ${
                        isActive ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={otherUser?.profileImage || 'https://picsum.photos/seed/user/200/200'}
                          alt=""
                          className="h-12 w-12 rounded-full object-cover border border-gray-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {otherUser?.firstName} {otherUser?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {chat.messages.length > 0
                              ? chat.messages[chat.messages.length - 1].content
                              : 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 bg-white flex flex-col">
          {activeChat ? (
            <ChatBox
              chatId={activeChat._id}
              otherUser={activeChat.participants.find((p: any) => p._id !== user?._id)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50/50">
              <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">Your Messages</p>
              <p className="text-sm">Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
