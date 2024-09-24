import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Loader,
  Home,
  Building2,
  Trees,
  Sun,
  Moon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const KLPropBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChartVisible, setIsChartVisible] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleChart = () => {
    setIsChartVisible(!isChartVisible);
  };

  const renderChart = () => {
    const data = [
      { name: "2019", KLCC: 1200, Bangsar: 900, Ampang: 800 },
      { name: "2020", KLCC: 1250, Bangsar: 950, Ampang: 820 },
      { name: "2021", KLCC: 1300, Bangsar: 1000, Ampang: 850 },
      { name: "2022", KLCC: 1400, Bangsar: 1050, Ampang: 900 },
      { name: "2023", KLCC: 1500, Bangsar: 1100, Ampang: 950 },
    ];

    return (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="KLCC" stroke="#8884d8" />
          <Line type="monotone" dataKey="Bangsar" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Ampang" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <header
        className={`${
          isDarkMode ? "bg-blue-800" : "bg-blue-600"
        } p-4 text-white shadow-md`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.img
              src="/logo.svg"
              alt="KL PropBot Logo"
              className="w-10 h-10"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <h1 className="text-2xl font-bold tracking-tight">KL PropBot</h1>
          </div>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-1 ${
                isDarkMode
                  ? "bg-blue-700 hover:bg-blue-600"
                  : "bg-blue-500 hover:bg-blue-400"
              } px-3 py-1 rounded transition-colors duration-200`}
            >
              <Home size={18} />
              <span>Houses</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-1 ${
                isDarkMode
                  ? "bg-blue-700 hover:bg-blue-600"
                  : "bg-blue-500 hover:bg-blue-400"
              } px-3 py-1 rounded transition-colors duration-200`}
            >
              <Building2 size={18} />
              <span>Condos</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-1 ${
                isDarkMode
                  ? "bg-blue-700 hover:bg-blue-600"
                  : "bg-blue-500 hover:bg-blue-400"
              } px-3 py-1 rounded transition-colors duration-200`}
            >
              <Trees size={18} />
              <span>Land</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`flex items-center space-x-1 ${
                isDarkMode
                  ? "bg-blue-700 hover:bg-blue-600"
                  : "bg-blue-500 hover:bg-blue-400"
              } px-3 py-1 rounded transition-colors duration-200`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-lg shadow ${
                msg.role === "user"
                  ? (isDarkMode ? "bg-blue-700" : "bg-blue-500") + " text-white"
                  : isDarkMode
                  ? "bg-gray-800"
                  : "bg-white"
              }`}
            >
              {msg.role === "user" ? (
                <p>{msg.content}</p>
              ) : (
                <ReactMarkdown
                  children={msg.content}
                  components={{
                    img: ({ node, ...props }) => (
                      <img
                        {...props}
                        className="mt-2 rounded-md max-w-full h-auto"
                      />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n$/, "")}
                          style={isDarkMode ? dark : github}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                />
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"} border-t`}
      >
        <div className="flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about real estate in Kuala Lumpur..."
            className={`flex-1 p-3 rounded-l-lg border ${
              isDarkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
          />
          <motion.button
            type="submit"
            className={`${
              isDarkMode
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-blue-600 hover:bg-blue-500"
            } text-white p-3 rounded-r-lg transition-colors duration-200`}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? <Loader className="animate-spin" /> : <Send />}
          </motion.button>
        </div>
      </form>
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}>
        <button
          onClick={toggleChart}
          className={`w-full p-2 flex items-center justify-center ${
            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-300"
          } transition-colors duration-200`}
        >
          {isChartVisible ? (
            <>
              Hide Chart <ChevronUp className="ml-2" />
            </>
          ) : (
            <>
              Show Chart <ChevronDown className="ml-2" />
            </>
          )}
        </button>
        <AnimatePresence>
          {isChartVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  Property Price Trends
                </h2>
                {renderChart()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KLPropBot;