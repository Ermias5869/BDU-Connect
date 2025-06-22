import NoChatSelected from "../components/NoChatSelected";
import { chatStore } from "../store/userChatStore";
import ChatContainer from "../components/ChatContainer";

import MessageNavBar from "../components/MessageNavBar";
export default function Message() {
  const { selectedUser } = chatStore();
  return (
    <div className="h-screen bg-base-200 ">
      <div className="flex items-center justify-center  ">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh)]">
          <div className="flex h-full rounded-lg  overflow-hidden">
            <MessageNavBar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}
