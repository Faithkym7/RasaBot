import React, { useState } from 'react';
import './chat.css';
import Message from './Message';
import showdown from 'showdown';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userMessage = {
      text: userInput,
      sender: 'user',
    };

    setMessages([...messages, userMessage]);
    setUserInput('');
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/webhooks/rasa/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userMessage),
      });

      const data = await response.json();
      const botResponse = data?.intent?.name || 'Oops! Something went wrong. Please try again.';

      // Simulate a delay to show loading indicator (remove in production)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      displayBotResponse(botResponse);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError('Oops! Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const displayBotResponse = (response) => {
    const converter = new showdown.Converter();
    const botMessages = [];

    if (Array.isArray(response)) {
      // If the response is an array, it means it's a list of items
      response.forEach((item) => {
        let text = item;
        if (typeof item === 'object' && item.text) {
          // If the item is an object with a 'text' property, use that as the text
          text = item.text;
        }

        const html = converter.makeHtml(text);
        const botMessage = {
          text: html,
          sender: 'bot',
        };
        botMessages.push(botMessage);
      });
    } else {
      // If the response is not an array, treat it as a single message
      const html = converter.makeHtml(response);
      const botMessage = {
        text: html,
        sender: 'bot',
      };
      botMessages.push(botMessage);
    }

    setMessages([...messages, ...botMessages]);
  };

  return (
    <div className='chatbot'>
      <div>
        <Message />
      </div>
      <div className='msg'>
        {/* Render the chat history */}
        {messages.map((message, index) => (
          <div key={index} style={{ textAlign: message.sender === 'user' ? 'right' : 'left' }}>
            <div dangerouslySetInnerHTML={{ __html: message.text }}></div>
          </div>
        ))}
      </div>

      <form className="Form" onSubmit={handleSubmit}>
        <textarea
          className='Input'
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type here..."></textarea>

        <button className='button' type="submit">Send</button>
      </form>

      {/* Display loading indicator */}
      {loading && <div>Loading...</div>}

      {/* Display error message if there's an error */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Chatbot;
