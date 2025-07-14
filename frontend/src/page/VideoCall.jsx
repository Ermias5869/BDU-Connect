import React, { useState } from "react";
import {
  Mic,
  Video,
  Smile,
  PhoneOff,
  Users,
  MessageSquare,
  LayoutGrid,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function VideoCall() {
  const { data: participants = [] } = useQuery({
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/get`);
      const data = await res.json();
      if (!res.ok || data?.error) throw new Error("Something went wrong");
      return data;
    },
  });

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleMic = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOn(!isVideoOn);
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const Guast = participants.slice(0, 5);
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Video Section */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center h-96">
          <div className="rounded-full w-32 h-32 bg-gray-200 mb-4 flex items-center justify-center overflow-hidden">
            {isVideoOn ? (
              <div className="w-full h-full bg-black text-white flex items-center justify-center rounded-full text-sm">
                Video On
              </div>
            ) : (
              <div className="w-full h-full bg-gray-400 flex items-center justify-center rounded-full text-sm text-white">
                No Video
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 italic">
            {`${participants[4]?.name} ከስብሰባው ወጥታል`}
          </p>
        </div>

        {/* Participant List */}
        <div className="bg-white rounded-2xl shadow-xl p-4 grid grid-cols-2 gap-3">
          {Guast.map((user, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-3 bg-blue-50 rounded-xl"
            >
              <img
                src={user.photo || "https://via.placeholder.com/80"}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover mb-2"
              />
              <p className="text-blue-700 font-medium text-sm truncate">
                {user.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-14 flex justify-center items-center flex-wrap gap-4">
        <button
          onClick={toggleMic}
          className={`p-3 rounded-xl border ${
            isMuted
              ? "bg-red-100 text-red-600"
              : "border-blue-400 text-blue-600"
          } hover:bg-blue-100 transition`}
        >
          <Mic size={20} />
        </button>
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-xl border ${
            !isVideoOn
              ? "bg-red-100 text-red-600"
              : "border-blue-400 text-blue-600"
          } hover:bg-blue-100 transition`}
        >
          <Video size={20} />
        </button>
        <button
          onClick={toggleChat}
          className="p-3 rounded-xl border border-blue-400 text-blue-600 hover:bg-blue-100 transition"
        >
          <Smile size={20} />
        </button>
        <button className="p-3 rounded-xl border border-blue-400 text-blue-600 hover:bg-blue-100 transition">
          <Users size={20} />
        </button>
        <button className="p-3 rounded-xl border border-blue-400 text-blue-600 hover:bg-blue-100 transition">
          <MessageSquare size={20} />
        </button>
        <button className="p-3 rounded-xl border border-blue-400 text-blue-600 hover:bg-blue-100 transition">
          <LayoutGrid size={20} />
        </button>
        <button className="p-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition">
          <PhoneOff size={20} />
        </button>
      </div>

      {/* Meeting Info */}
      <div className="mt-4 text-center text-sm text-gray-500">
        8:06 PM | Meeting ID:{" "}
        <span className="font-semibold">start metting</span>
      </div>

      {/* Chat Box */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-72 h-64 bg-white shadow-2xl rounded-xl p-4 flex flex-col">
          <h4 className="text-blue-700 font-semibold mb-2">Chat</h4>
          <div className="flex-1 overflow-y-auto space-y-2 text-sm text-gray-700">
            <div>
              <strong>{participants[2].name}:</strong> Hello, how is everyone?
            </div>
            <div>
              <strong>{participants[4].name}:</strong> All good here!
            </div>
          </div>
          <input
            type="text"
            className="mt-3 p-2 border rounded-md text-sm"
            placeholder="Type a message..."
          />
        </div>
      )}
    </div>
  );
}
