import { useState } from "react";

function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askMeddy = async () => {
    if (!question.trim() || loading) return;

    const currentQuestion = question.trim();

    const userMessage = {
      sender: "user",
      text: currentQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        sender: "bot",
        text: data.answer || "Sorry, Meddy could not generate an answer.",
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Meddy backend error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Unable to connect to Meddy backend. Please make sure the backend server is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto py-10 px-6">

        <h1 className="text-4xl font-bold text-indigo-600 mb-8">
          🤖 Meddy AI Health Assistant
        </h1>

        <div className="bg-white rounded-2xl shadow-lg h-[500px] overflow-y-auto p-6">

          {messages.length === 0 && (
            <div className="text-gray-500 text-center mt-24">
              Ask Meddy anything about diseases, symptoms,
              medicines, nutrition or healthcare.
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-5 ${
                msg.sender === "user"
                  ? "text-right"
                  : "text-left"
              }`}
            >
              <div
                className={`inline-block px-5 py-3 rounded-2xl max-w-xl ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-500">
              Meddy is thinking...
            </div>
          )}

        </div>

        <div className="flex gap-4 mt-6">

          <input
            type="text"
            className="flex-1 border rounded-xl p-4"
            placeholder="Ask Meddy a health question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askMeddy();
              }
            }}
            disabled={loading}
          />

          <button
            onClick={askMeddy}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 rounded-xl"
          >
            {loading ? "Thinking..." : "Send"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Chat;