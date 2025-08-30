import React, { useEffect, useRef, useState } from "react";
import CustomButton from "./CustomButton";

const ChatPanel = ({ user, onClose, containerClass = "" }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "System", text: "Start chatting with your friends!" },
  ]);
  const [text, setText] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const nextMsg = {
      id: Date.now(),
      sender: "You",
      text: trimmed,
    };
    setMessages((prev) => [...prev, nextMsg].slice(-50));
    setText("");
  };

  return (
    <div className={`bg-primary shadow-xl rounded-lg px-5 py-4 w-[22rem] max-w-[90vw] ${containerClass}`}>
      <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645] pb-2">
        <span>Chat</span>
        <button onClick={onClose} className="text-ascent-2 hover:text-ascent-1 text-sm">Close</button>
      </div>

      <div ref={listRef} className="mt-4 h-64 overflow-y-auto flex flex-col gap-2 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
              m.sender === "You"
                ? "self-end bg-blue text-white"
                : "self-start bg-secondary text-ascent-1"
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{m.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-3 placeholder:text-[#666] w-full rounded-full"
        />
        <CustomButton
          type="submit"
          title="Send"
          containerStyles="bg-[#FFEA00] text-white px-4 py-2 rounded-full"
        />
      </form>
    </div>
  );
};

export default ChatPanel;
