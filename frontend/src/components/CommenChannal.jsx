import React, { useState } from "react";
import ChannalMessage from "./ChannalMessage";
import { channalStore } from "../store/channalChatStore";
import NoChannalMessage from "./NoChannalMessage";
import ChannalDescription from "./ChannalDescription";
import CommenChannalBar from "./CommenChannalBar";
import ChannalSetting from "./ChannalSetting";

export default function CommenChannal() {
  const [isSetting, setIsSetting] = useState(false);
  const { selectedChannal } = channalStore();
  return (
    <div className="h-screen w-screen bg-base-200 ml-2">
      <div className="flex items-center justify-center h-full w-full">
        <div className="bg-base-100 rounded-none shadow-none w-full h-full mr-5">
          <div
            className={`grid gap-4 h-full overflow-hidden ${
              selectedChannal
                ? "md:grid-cols-[1.5fr_3.5fr_2fr] grid-cols-1"
                : "md:grid-cols-[1fr_3fr] grid-cols-1"
            }`}
          >
            {/* Show AllChannalBar only if no channel selected on mobile, always on desktop */}
            {(!selectedChannal || window.innerWidth >= 768) && (
              <div
                className={`${selectedChannal ? "hidden md:block" : "block"}`}
              >
                <CommenChannalBar />
              </div>
            )}

            {/* Show ChannalMessage if selected, else show NoChannalMessage on desktop */}
            {selectedChannal ? (
              <ChannalMessage />
            ) : (
              <div className="hidden md:block ">
                <NoChannalMessage />
              </div>
            )}

            {/* Channel settings/description only on desktop */}
            {selectedChannal && (
              <div className="hidden md:block">
                {isSetting ? (
                  <ChannalSetting setIsSetting={setIsSetting} />
                ) : (
                  <ChannalDescription setIsSetting={setIsSetting} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
