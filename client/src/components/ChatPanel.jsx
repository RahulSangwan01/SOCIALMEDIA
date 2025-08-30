import React, { useEffect, useMemo, useRef, useState } from "react";
import CustomButton from "./CustomButton";
import { NoProfile } from "../assets";

const getKey = (me, friendId) => `chat_${me || "me"}_${friendId || "none"}`;

const ChatPanel = ({ user, friends = [], onClose, containerClass = "" }) => {
  const [selected, setSelected] = useState(() => friends?.[0]?._id || null);
  const [text, setText] = useState("");
  const listRef = useRef(null);

  const messages = useMemo(() => {
    if (!selected) return [{ id: 0, sender: "System", text: "Select a friend to start chatting." }];
    try {
      const raw = localStorage.getItem(getKey(user?._id, selected));
      const parsed = raw ? JSON.parse(raw) : [{ id: 1, sender: "System", text: "Say hi 👋" }];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [selected, user?._id]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, selected]);

  const persist = (next) => {
    if (!selected) return;
    localStorage.setItem(getKey(user?._id, selected), JSON.stringify(next.slice(-200)));
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !selected) return;

    const nextMsg = { id: Date.now(), sender: "You", text: trimmed };
    const next = [...messages, nextMsg];
    persist(next);
    setText("");
    // force scroll via ref effect
    setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, 0);
  };

  const currentFriend = friends.find((f) => f._id === selected) || null;

  return (
    <div className={`bg-primary shadow-xl rounded-lg px-4 py-4 w-[22rem] max-w-[90vw] ${containerClass}`}>
      <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645] pb-2">
        <span>{currentFriend ? `Chat • ${currentFriend.firstName}` : "Chat"}</span>
        <button onClick={onClose} className="text-ascent-2 hover:text-ascent-1 text-sm">Close</button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="col-span-1 h-64 overflow-y-auto pr-1 flex flex-col gap-2">
          {friends?.length ? (
            friends.map((f) => (
              <button
                key={f._id}
                onClick={() => setSelected(f._id)}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left hover:bg-secondary ${selected === f._id ? "bg-secondary" : ""}`}
              >
                <img
                  src={f?.profileUrl || NoProfile}
                  alt={f?.firstName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-sm text-ascent-1 truncate">{f?.firstName} {f?.lastName}</span>
              </button>
            ))
          ) : (
            <p className="text-xs text-ascent-2">No friends yet.</p>
          )}
        </div>

        <div className="col-span-2 flex flex-col">
          <div ref={listRef} className="h-48 overflow-y-auto flex flex-col gap-2 pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                  m.sender === "You" ? "self-end bg-blue text-white" : "self-start bg-secondary text-ascent-1"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={currentFriend ? `Message ${currentFriend.firstName}...` : "Select a friend..."}
              disabled={!currentFriend}
              className="bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-3 placeholder:text-[#666] w-full rounded-full disabled:opacity-50"
            />
            <CustomButton
              type="submit"
              title="Send"
              containerStyles="bg-[#FFEA00] text-white px-4 py-2 rounded-full"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
