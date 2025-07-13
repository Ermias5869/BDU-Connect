import { useEffect, useRef } from "react";
import { chatStore } from "../store/userChatStore";
import ChatHeader from "./ChatHeader";
import Messageinput from "./Messageinput";
import { AuthStore } from "../store/userAuthStore";
import MessageSkeleton from "./MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
export default function ChatContainer() {
  const messageRef = useRef(null);
  const {
    getMessage,
    messages,
    isMessageing,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = chatStore();
  const { authUser } = AuthStore();
  useEffect(
    function () {
      if (!selectedUser?._id || !AuthStore.getState().socket) return;
      getMessage(selectedUser._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    },
    [selectedUser, getMessage]
  );
  useEffect(
    function () {
      if (messageRef.current && messages)
        messageRef.current.scrollIntoView({ behavior: "smooth" });
    },
    [messages]
  );

  if (isMessageing)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <Messageinput />
      </div>
    );
  return (
    <div className="flex-1 h-9/10 md:h-full flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 bg-stone-200 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageRef}
          >
            {/* Profile Image */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.photo || "/noProfile.jpg"
                      : selectedUser.photo || "/noProfile.jpg"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            {/* Time */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* Only show photo outside of bubble */}
            {message.photo && (
              <img
                src={message.photo}
                alt="Attachment"
                className="sm:max-w-[300px] rounded-md mb-2"
              />
            )}

            {/* Text inside colored bubble */}
            {message.text && (
              <div
                className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                  message.senderId === authUser._id
                    ? "bg-blue-400 text-white"
                    : "bg-white text-black"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        ))}
      </div>

      <Messageinput />
    </div>
  );
}
