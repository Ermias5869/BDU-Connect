import { useEffect, useRef, useState } from "react";
import MessageSkeleton from "./MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { channalStore } from "../store/channalChatStore";
import ChannalMessageInput from "./ChannalMessageInput";
import ChannalMessageHeader from "./ChannalMessageHeader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { FaFile, FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { AuthStore } from "../store/userAuthStore";

export default function ChannalMessage() {
  const queryClient = useQueryClient();
  const { selectedChannal } = channalStore();
  const messageRef = useRef(null);
  const { authUser } = AuthStore();

  const [editMessageId, setEditMessageId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageIdToReact, setMessageIdToReact] = useState(null);

  const {
    data: channalMessages,
    isLoading: isMessageing,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["channnalMessage", selectedChannal?._id],
    enabled: !!selectedChannal?._id,
    queryFn: async () => {
      const res = await fetch(
        `/api/channelmessage/getmessage/${selectedChannal._id}`
      );
      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.error || "Failed to fetch messages");
      }
      return data;
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: async (updatedMessage) => {
      const res = await fetch(
        `/api/channelmessage/edit/${updatedMessage._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: updatedMessage.text }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to edit message");
      }
      return updatedMessage;
    },
    onSuccess: (updatedMessage) => {
      queryClient.setQueryData(
        ["channnalMessage", selectedChannal?._id],
        (oldData) =>
          oldData?.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          )
      );
      toast.success("Message edited successfully");
      setEditMessageId(null);
    },
    onError: (err) => toast.error(err.message || "Failed to edit message"),
  });

  const deleteChannnalMessageMutation = useMutation({
    mutationFn: async (messageId) => {
      const res = await fetch(`/api/channelmessage/delete/${messageId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete message");
      }
      return messageId;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(
        ["channnalMessage", selectedChannal?._id],
        (oldData) => oldData?.filter((msg) => msg._id !== deletedId)
      );
      toast.success("Message deleted");
    },
    onError: (err) => toast.error(err.message || "Failed to delete message"),
  });

  const addReactionMutation = useMutation({
    mutationFn: (emoji) =>
      axios.post(`/api/channelmessage/message/${messageIdToReact}/reaction`, {
        emoji,
      }),
    onSuccess: () => {
      setShowEmojiPicker(false);
      refetchMessages();
    },
    onError: () => toast.error("Failed to add reaction"),
  });
  const joinChannal = useMutation({
    mutationFn: async (channalId) => {
      const res = await fetch(`/api/channal/join/${channalId}`, {
        method: "PUT",
      });

      const data = await res.json();

      if (!res.ok || data?.error) {
        throw new Error(data?.error || "Failed to join channel");
      }

      return data; // Return the joined/updated channel object
    },
    onSuccess: (updatedChannal) => {
      // Optionally update store with new channel data
      channalStore.setState({ selectedChannal: updatedChannal });

      // Invalidate or refetch related queries if needed
      queryClient.invalidateQueries(["channal", updatedChannal._id]);

      toast.success("Joined the channel successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to join the channel");
    },
  });

  useEffect(() => {
    if (messageRef.current && channalMessages?.length) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [channalMessages]);

  const handleEditMessage = (messageId, currentText) => {
    setEditMessageId(messageId);
    setEditedText(currentText);
  };

  const handleSaveEdit = async () => {
    if (!editedText.trim()) return;
    editMessageMutation.mutate({ _id: editMessageId, text: editedText });
  };

  const handleReactionClick = (messageId) => {
    setMessageIdToReact(messageId);
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emoji) => {
    addReactionMutation.mutate(emoji.emoji);
  };

  const groupReactions = (reactions = []) => {
    const grouped = {};
    for (const r of reactions) {
      if (!grouped[r.emoji]) grouped[r.emoji] = [];
      grouped[r.emoji].push(r.userId);
    }
    return grouped;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-9/10 md:h-screen">
      <ChannalMessageHeader />
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
        {isMessageing ? (
          <MessageSkeleton />
        ) : (
          channalMessages?.map((message, idx) => {
            const isLast = idx === channalMessages.length - 1;
            // const grouped = groupReactions(message.reactions);
            return (
              <div
                key={message._id}
                className="flex justify-between"
                ref={isLast ? messageRef : null}
              >
                <div className="relative group bg-blue-300 text-black p-4 rounded-2xl shadow-md max-w-[75%] min-w-[75%] w-fit space-y-2">
                  {/* Media - Images */}
                  {message.photo?.length > 0 && (
                    <img
                      src={message.photo[0]}
                      alt="message"
                      className="rounded-lg max-h-[300px]  w-full object-cover border"
                    />
                  )}

                  {/* Media - Videos */}
                  {message.video?.map((videoUrl, i) => (
                    <video
                      key={i}
                      controls
                      className="rounded-lg max-h-[250px] w-full"
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ))}

                  {message.file?.map((fileUrl, i) => {
                    const fileName = fileUrl.split("/").pop();
                    return (
                      <div
                        key={i}
                        className="flex items-center bg-[#1e2b3c] text-white rounded-lg px-4 py-2 my-2 space-x-4 w-fit max-w-full"
                      >
                        {/* File Icon */}
                        <div className="w-10 h-10 bg-[#2c3e50] flex items-center justify-center rounded-full text-xl">
                          <FaFile />
                        </div>

                        {/* File Info */}
                        <div className="flex flex-col truncate">
                          <span className="font-medium truncate">
                            {fileName}
                          </span>
                          <span className="text-sm text-gray-300">
                            {/* Optional: You can show size if available */}
                          </span>
                        </div>

                        {/* Download Button */}
                        <a
                          href={fileUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-sm text-blue-400 hover:underline"
                        >
                          Download
                        </a>
                      </div>
                    );
                  })}

                  {/* Message Text OR Edit Box */}
                  {editMessageId === message._id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="flex-1 p-2 rounded-md text-black"
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-green-600 rounded-md text-white text-sm"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                  )}

                  {/* Timestamp & Action Buttons */}
                  <div className="flex justify-between items-center text-xs text-gray-200">
                    <span>{formatMessageTime(message.createdAt)}</span>
                    <div className="space-x-3 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() =>
                          handleEditMessage(message._id, message.text)
                        }
                        className="hover:underline"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() =>
                          deleteChannnalMessageMutation.mutate(message._id)
                        }
                        className="hover:underline text-red-500"
                      >
                        <FaTrashAlt />
                      </button>
                      <button
                        onClick={() => handleReactionClick(message._id)}
                        className="hover:scale-110 transition-transform text-white"
                      >
                        😍
                      </button>
                    </div>
                  </div>

                  {/* Reactions */}
                  <div className="flex gap-2 flex-wrap text-lg mt-2">
                    {Object.entries(groupReactions(message.reactions)).map(
                      ([emoji, users], index) => (
                        <div
                          key={index}
                          className="bg-white text-black px-2 py-1 rounded-full text-sm"
                          title={users.map((u) => u?.name || "User").join(", ")}
                        >
                          {emoji} {users.length}
                        </div>
                      )
                    )}
                  </div>

                  {/* Emoji Picker */}
                  {showEmojiPicker && messageIdToReact === message._id && (
                    <div className="absolute top-0 right-0 mt-[-110px] z-50">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {authUser._id.toString() === selectedChannal?.creator.toString() ? (
        <ChannalMessageInput refetchMessages={refetchMessages} />
      ) : selectedChannal.members.includes(authUser._id) ? (
        <button className="bg-blue-400 text-white p-2 " disabled={true}>
          Member
        </button>
      ) : (
        <button
          className="bg-blue-400 text-white p-2 hover:bg-blue-300"
          onClick={(e) => {
            e.preventDefault();
            joinChannal.mutate(selectedChannal._id);
          }}
        >
          {joinChannal.isLoading ? "loading..." : "Join"}
        </button>
      )}
    </div>
  );
}
