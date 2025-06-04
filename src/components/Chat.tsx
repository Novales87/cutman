import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Bot, Send } from 'lucide-react'; // Importar ambos iconos
import UserInfoForm from './UserInfoForm';

interface UserInfo {
  name: string;
  lastName: string;
  contact: string;
}

interface Message {
  text: string;
  fromUser: boolean;
}



function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false); // Nuevo estado
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userInfo) {
      setSessionId(uuidv4());
    }
  }, [userInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowWelcomeDialog(prev => !prev); // Alternar el estado
    }, 3000); // Cada 3 segundos

    return () => clearInterval(interval); // Limpiar el intervalo
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [messages]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && userInfo) {
      setIsLoading(true);
      try {
        await sendMessage();
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendMessage = async () => {
    console.log('Sending message:', newMessage);
    const messageData = {
      sessionId: sessionId,
      action: "sendMessage",
      chatInput: newMessage,
      userName: userInfo?.name ?? ''
    };
    const webhookUrl = `${import.meta.env.VITE_WEBHOOK_URL}?sessionId=${sessionId}`;
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });
    console.log('Response received:', response);
    if (!response.ok) {
      console.error('Error sending message:', response.statusText);
    } else {
      console.log('Message sent successfully. Response:', response);
    }
    setMessages([...messages, { text: newMessage, fromUser: true }]);
    inputRef.current?.focus();
    setNewMessage('');
    await handleResponse(response);
  };

  const handleResponse = async (response: Response) => {
    try {
      const data = await response.json();
      if (data?.output) {
        const iaResponse = data.output;
        setMessages(prevMessages => [...prevMessages, { text: iaResponse, fromUser: false }]);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      const text = await response.text();
      console.log('Raw response text:', text);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartChat = (userInfo: UserInfo) => {
    setUserInfo(userInfo);
    setShowForm(false);
    setIsChatOpen(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isChatOpen && (
        <div className={`absolute bottom-20 right-4 bg-blue-600 text-white dark:bg-blue-800 dark:text-gray-200 p-3 rounded-lg shadow-lg max-w-xs text-sm transition-opacity duration-500 ${showWelcomeDialog ? 'opacity-100' : 'opacity-0'}`}>
          ¡Bienvenido! ¿Querés agendar un turno?
          <div className="absolute bottom-0 right-4 w-3 h-3 bg-blue-600 dark:bg-blue-800 transform rotate-45 translate-y-1/2"></div>
        </div>
      )}
      {!isChatOpen ? (
        <button
          onClick={() => setIsChatOpen(true)}
          className="chat-button bg-gray-800 text-white rounded-full p-4 shadow-lg hover:bg-gray-900 transition-colors z-50"
          aria-label="Abrir chat"
        >
          <Bot className="w-6 h-6" /> {/* Cambiado de Send a Bot */}
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-96 h-[550px] flex flex-col">
          <div className="bg-gray-800 text-white dark:bg-gray-700 dark:text-gray-100 p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chatea con nosotros</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:text-gray-200 dark:text-gray-100 dark:hover:text-gray-300"
              aria-label="Cerrar chat"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto" ref={messagesContainerRef}>
            {showForm && !userInfo ? (
              <UserInfoForm onStartChat={handleStartChat} />
            ) : (
              <>
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
                    ¡Hola! ¿En qué podemos ayudarte?
                  </div>
                )}
                {messages.map((msg) => (
                    <div
                    key={uuidv4()}
                    className={`mb-2 ${msg.fromUser ? 'text-right' : 'text-left'}`}
                    >
                    <span
                      className={`inline-block p-2 rounded-lg ${msg.fromUser ? 'bg-gray-800 text-white dark:bg-blue-700 dark:text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'} max-w-[80%] break-words`}
                    >
                      {msg.text}
                    </span>
                    </div>
                ))}
                {isLoading && (
                  <div className="text-left mb-2">
                    <span className="inline-block p-2 rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      Escribiendo...
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-4 border-t dark:border-gray-700">
            {!showForm && userInfo && (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  disabled={isLoading}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  aria-label="Mensaje"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !newMessage.trim()}
                  className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:bg-gray-600 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-5 h-5" /> {/* Cambiado de Bot a Send */}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
