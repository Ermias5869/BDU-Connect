import React from "react";
import UpdateChannalPhoto from "./UpdateChannalPhoto";
import { IoIosArrowRoundBack } from "react-icons/io";
import UpdateChannalInfo from "./UpdateChannalInfo";

export default function ChannalSetting({ setIsSetting }) {
  return (
    <div className="bg-white">
      <button onClick={() => setIsSetting((pre) => !pre)}>
        <IoIosArrowRoundBack size={30} className="text-blue-400" />
      </button>
      <UpdateChannalPhoto />
      <UpdateChannalInfo />
    </div>
  );
}
