import React from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import useUser from "../hook/useUser";
import { formatMemberSinceDate } from "../utility/index";
import useFollow from "../hook/useFollow";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";

export default function UserProfile() {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { studId } = useParams();
  const { user, isLoading } = useUser(studId);
  const { follow, isPending } = useFollow();

  if (isLoading) return <div>Loading...</div>;

  const checkUserFollower = user.followers.map((u) => u._id);
  const isFollowing = checkUserFollower.includes(authUser._id);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="h-20 bg-blue-400"></div>

      <div className="relative p-4">
        <div className="absolute -top-16 left-4">
          <img
            src={user.photo === "noProfile.jpg" ? "/noProfile.jpg" : user.photo}
            alt={user.name}
            className="w-28 h-28 rounded-full bg-gray-600 border-4 border-white"
          />
        </div>

        {!(user._id === authUser._id) && (
          <div className="flex justify-end">
            <button
              className={`${
                isFollowing
                  ? "bg-red-500 hover:bg-red-300"
                  : "bg-blue-500 hover:bg-blue-300"
              } text-white px-4 py-1 rounded-full font-semibold transition`}
              onClick={(e) => {
                e.preventDefault();
                follow(user._id);
              }}
            >
              {isPending ? (
                <LoadingSpinner size="sm" />
              ) : isFollowing ? (
                "Unfollow"
              ) : (
                "Follow"
              )}
            </button>
          </div>
        )}

        <div className="mt-5 pl-4">
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-gray-400">{user.studentId.toUpperCase()}</p>
          {user.bio && (
            <p className="text-gray-600 pb-1 mb-0.5">{`${user.name} says: ${user.bio}`}</p>
          )}
          {user.link && (
            <a
              href={user.link}
              className="underline text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.link}
            </a>
          )}
          <p className="text-gray-500 mt-4">
            {formatMemberSinceDate(user.createdAt)}
          </p>
          <p className="text-gray-500 mt-2">
            {`${user.following.length} Following`}
            <span className="ml-2">{`${user.followers.length} Followers`}</span>
          </p>
        </div>
      </div>

      <div className="flex border-b border-gray-300 mt-4 px-4 py-2 justify-between font-semibold text-blue-500">
        {[
          { to: "post", label: "Post" },
          { to: "Following", label: "Following" },
          { to: "follower", label: "Follower" },
          { to: "video", label: "Video" },
          { to: "like-post", label: "Liked Post" },
          { to: "like-video", label: "Liked Video" },
        ].map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            className={({ isActive }) =>
              `px-2 py-1 transition-all ${
                isActive
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "hover:text-blue-600"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}
