import { X } from "lucide-react";
import { channalStore } from "../store/channalChatStore";

const ChannakMessageHeader = () => {
  const { selectedChannal, selectChannal } = channalStore();

  return (
    <div className="p-1  bg-blue-400 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {selectedChannal.photo === "bduLogo.jpg" ? (
                <img
                  src="/bduLogo.jpg"
                  alt="Channel Logo"
                  className="w-16 h-16 rounded-full border-2 border-blue-400"
                />
              ) : (
                <img
                  src={selectedChannal.photo}
                  alt="Channel Logo"
                  className="w-16 h-16 rounded-full border-2 border-blue-400"
                />
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg  text-white">{selectedChannal.name}</h2>
            <p className="text-sm text-white">
              {selectedChannal.members.length} subscribers
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => selectChannal(null)}>
          <X className="text-white" />
        </button>
      </div>
    </div>
  );
};
export default ChannakMessageHeader;
