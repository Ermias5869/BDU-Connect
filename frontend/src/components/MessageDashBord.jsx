import { useEffect, useRef } from "react";
import { chatStore } from "../store/userChatStore";
import ChatHeader from "./ChatHeader";
import Messageinput from "./Messageinput";
import { AuthStore } from "../store/userAuthStore";
import MessageSkeleton from "./MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
export default function MessageDashBord() {
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
      getMessage(selectedUser?._id);
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    },
    [getMessage, selectedUser?._id]
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
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.photo || "/Avater.jpg"
                      : selectedUser.photo || "/Avater.jpg"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.photo && (
                <img
                  src={message.photo}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <Messageinput />
    </div>
  );
}
