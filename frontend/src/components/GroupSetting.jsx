import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import UpdateGroupPhoto from "./UpdateGroupPhoto";
import UpdateGroupInfo from "./UpdateGroupInfo";

export default function GroupSetting({ setIsSetting }) {
  return (
    <div className="bg-white">
      <button onClick={() => setIsSetting((pre) => !pre)}>
        <IoIosArrowRoundBack size={30} className="text-blue-400" />
      </button>
      <UpdateGroupPhoto />
      <UpdateGroupInfo />
    </div>
  );
}
