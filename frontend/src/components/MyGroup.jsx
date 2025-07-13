import React, { useState } from "react";
import NoChannalMessage from "../components/NoChannalMessage";
import { groupStore } from "../store/groupChatStore";
import GroupMessage from "../components/GroupMessage";
import GroupSetting from "../components/GroupSetting";
import GroupDescription from "../components/GroupDescription";
import MyGroupBar from "./MyGroupBar";

export default function MyGroup() {
  const [isSetting, setIsSetting] = useState(false);
  const { selectedGroup } = groupStore();

  return (
    <div className="h-screen w-screen bg-base-200 ml-2">
      <div className="flex items-center justify-center h-full w-full">
        <div className="bg-base-100 rounded-none shadow-none w-full h-full mr-5">
          <div
            className={`grid gap-4 h-full overflow-hidden ${
              selectedGroup
                ? "md:grid-cols-[1.5fr_3.5fr_2fr] grid-cols-1"
                : "md:grid-cols-[1fr_3fr] grid-cols-1"
            }`}
          >
            {/* Show AllChannalBar only if no channel selected on mobile, always on desktop */}
            {(!selectedGroup || window.innerWidth >= 768) && (
              <div className={`${selectedGroup ? "hidden md:block" : "block"}`}>
                <MyGroupBar />
              </div>
            )}

            {/* Show ChannalMessage if selected, else show NoChannalMessage on desktop */}
            {selectedGroup ? (
              <GroupMessage />
            ) : (
              <div className="hidden md:block ">
                <NoChannalMessage />
              </div>
            )}

            {/* Channel settings/description only on desktop */}
            {selectedGroup && (
              <div className="hidden md:block">
                {isSetting ? (
                  <GroupSetting setIsSetting={setIsSetting} />
                ) : (
                  <GroupDescription setIsSetting={setIsSetting} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
