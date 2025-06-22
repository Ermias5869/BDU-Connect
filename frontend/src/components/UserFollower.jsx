import React from "react";
import { Link, useParams } from "react-router-dom";
import useUser from "../hook/useUser";
import useFollow from "../hook/useFollow";
import { useQuery } from "@tanstack/react-query";

export default function UserFollower() {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { studId } = useParams();
  const { user } = useUser(studId);
  const { follow, isPending } = useFollow();
  const checkUserFollwer = user.followers.map((user) => user._id);
  const isFollowing = checkUserFollwer.includes(authUser._id);

  return (
    <div className="bg-gray-100 min-h-screen text-black p-5 space-y-4 ">
      {user.followers.map((user) => (
        <Link
          to={`/profile/${user.studentId}`}
          key={user._id}
          className="flex items-center  justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            {user.photo === "noProfile.jpg" ? (
              <img
                src="/noProfile.jpg"
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <img
                src={user.photo}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
              />
            )}
            <div>
              <p className="text-sm ">{user.name}</p>
              <p className="font-semibold text-gray-400 leading-tight">
                {user.studentId}
              </p>
            </div>
          </div>

          {isFollowing ? (
            <div className=" text-blue-500 px-4 py-1  font-semibold ">
              following..
            </div>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm"
              onClick={(e) => {
                e.preventDefault();
                follow(user._id);
              }}
            >
              {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
            </button>
          )}
        </Link>
      ))}
    </div>
  );
}
