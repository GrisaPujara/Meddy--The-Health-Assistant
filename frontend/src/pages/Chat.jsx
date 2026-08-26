import { useState } from "react";
import { Link } from "react-router-dom";

function formatPair(messages, index) {
  const msg = messages[index];
  if (msg.sender === "user") {
    const answer = messages[index + 1]?.sender === "bot" ? messages[index + 1].text : "";
    return answer
      ? `Question: ${msg.text}\n\nMeddy: ${answer}`
      : `Question: ${msg.text}`;
  }

  const question =
    messages[index - 1]?.sender === "user" ? messages[index - 1].text : "";
  return question
    ? `Question: ${question}\n\nMeddy: ${msg.text}`
    : `Meddy: ${msg.text}`;
}

function formatChat(messages) {
  return messages
    .map((msg) => (msg.sender === "user" ? `You: ${msg.text}` : `Meddy: ${msg.text}`))
    .join("\n\n");
}

async function shareText(text) {
  const payload = {
    title: "Meddy health query",
    text,
  };

  if (navigator.share) {
    await navigator.share(payload);
    return "shared";
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return "copied";
  }

  window.prompt("Copy this Meddy query:", text);
  return "copied";
}

function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const showNotice = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 2500);
  };

  const askMeddy = async () => {
    if (!question.trim() || loading) return;

    const currentQuestion = question.trim();

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: currentQuestion,
      },
    ]);
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

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.answer || "Sorry, Meddy could not generate an answer.",
        },
      ]);
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

  const handleShare = async (text) => {
    try {
      const result = await shareText(text);
      showNotice(
        result === "shared"
          ? "Opened share options."
          : "Copied. Paste it into WhatsApp, Gmail, or any app."
      );
    } catch (error) {
      if (error?.name !== "AbortError") {
        showNotice("Could not share this query.");
      }
    }
  };

  const clearChat = () => {
    if (!messages.length) return;
    if (!window.confirm("Clear this chat? This cannot be undone.")) return;
    setMessages([]);
    setQuestion("");
    showNotice("Chat cleared.");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto py-10 px-6">
        <div className="flex flex-wrap justify-between gap-4 items-center mb-6">
          <div>
            <Link to="/dashboard" className="text-indigo-600 font-semibold">
              ← Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-indigo-600 mt-3">
              🤖 Meddy AI Health Assistant
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={!messages.length}
              onClick={() => handleShare(formatChat(messages))}
              className="bg-white border px-4 py-2 rounded-xl font-semibold disabled:opacity-40"
            >
              Share chat
            </button>
            <button
              type="button"
              disabled={!messages.length}
              onClick={clearChat}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-semibold disabled:opacity-40"
            >
              Clear chat
            </button>
          </div>
        </div>

        {notice && (
          <p className="mb-4 bg-indigo-50 text-indigo-700 rounded-xl p-3">
            {notice}
          </p>
        )}

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
                msg.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block px-5 py-3 rounded-2xl max-w-xl ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <button
                  type="button"
                  onClick={() => handleShare(formatPair(messages, index))}
                  className={`mt-2 text-sm underline ${
                    msg.sender === "user" ? "text-indigo-100" : "text-indigo-600"
                  }`}
                >
                  {msg.sender === "user" ? "Share query" : "Share answer"}
                </button>
              </div>
            </div>
          ))}

          {loading && <div className="text-gray-500">Meddy is thinking...</div>}
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
            type="button"
            disabled={!question.trim() || loading}
            onClick={() => handleShare(`Meddy query: ${question.trim()}`)}
            className="bg-white border px-5 rounded-xl font-semibold disabled:opacity-40"
          >
            Share
          </button>

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
