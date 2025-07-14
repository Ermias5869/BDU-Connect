import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SignUpPage from "./page/auth/SignUpPage";
import LoginPage from "./page/auth/LoginPage";
import HomePage from "./page/home/HomePage";
import SideBar from "./components/SideBar";
import SuggestionBox from "./components/SuggestionBox";
import { ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./ui/LoadingSpinner";

import Post from "./page/Post";
import MyPosts from "./components/MyPosts";
import FollowingPost from "./components/FollowingPost";
import Message from "./page/Message";
import NotFoundPage from "./components/NotFoundPage";
import NotificationPage from "./page/NotificationPage";
import { AuthStore } from "./store/userAuthStore";
import { useEffect } from "react";
import ProfilePage from "./page/ProfilePage";
import UserFollower from "./components/UserFollower";
import UserFollowings from "./components/UserFollowings";
import UserPost from "./components/UserPost";
import Setting from "./page/Setting";
import ShortVideo from "./page/ShortVideo";
import Video from "./page/Video";
import MyVideo from "./components/MyVideo";
import FollowingVideo from "./components/FollowingVideo";
import UserVideo from "./components/UserVideo";
import UserLikedVideo from "./components/UserLikedVideo";
import UserLikedPost from "./components/UserLikedPost";
import Channal from "./page/Channal";
import ChannalContiner from "./page/home/ChannalContiner";
import AllChannal from "./components/AllChannal";
import MyChannal from "./components/MyChnnal";
import CommenChannal from "./components/CommenChannal";
import CreateChannal from "./components/CreateChannal";
import GroupContiner from "./page/home/GroupContiner";
import Group from "./page/Group";
import MyGroup from "./components/MyGroup";
import AllGroup from "./components/AllGroup";
import CreateGroup from "./components/CreateGroup";
import Service from "./page/Service";
import ThomeFood from "./components/ThomeFood";
import GdiftFood from "./components/GdiftFood";
import FoodDetail from "./components/FoodDetail";
import MiniSideBar from "./components/MiniSideBar";
import VideoCall from "./page/VideoCall";

export default function App() {
  const { checkAuth } = AuthStore();
  useEffect(
    function () {
      checkAuth();
    },
    [checkAuth]
  );
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/getme`);
        const data = await res.json();
        if (!res.ok || data?.error) return null;

        if (!res.ok) {
          throw new Error("someting is wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
  const location = useLocation();
  const isMessageRoute = location.pathname.startsWith("/message");
  const isProfileRoute = location.pathname.startsWith("/profile");
  const isUpdatingSetting = location.pathname.startsWith("/setting");
  const ischannal = location.pathname.startsWith("/channal");
  const isgroup = location.pathname.startsWith("/group");
  const isservice = location.pathname.startsWith("/service");
  const iscall = location.pathname.startsWith("/video-call");

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (!authUser) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-full px-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    );
  }
  return (
    <div
      className={`grid h-screen ${
        ischannal || isgroup
          ? "grid-cols-1 " // full-page layout when in channel
          : isMessageRoute ||
            isProfileRoute ||
            isUpdatingSetting ||
            isservice ||
            iscall
          ? "grid-cols-1 md:grid-cols-[5fr_19fr]" // 2-column layout
          : "grid-cols-1 md:grid-cols-[5fr_15fr_7fr]" // 3-column layout
      }`}
    >
      {authUser && !ischannal && !isgroup && (
        <div className="hidden md:block h-dvh">
          <SideBar />
        </div>
      )}

      <div className="col-span-1 overflow-y-auto h-full px-4.5 bg-gray-200">
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white z-50 shadow-md border-t">
          <MiniSideBar />
        </div>
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/post"
            element={authUser ? <Post /> : <Navigate to="/" />}
          >
            <Route index element={<MyPosts />} />
            <Route path="my-posts" element={<MyPosts />} />
            <Route path="following-posts" element={<FollowingPost />} />
          </Route>
          <Route path="/message" element={<Message />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/profile/:studId" element={<ProfilePage />}>
            <Route index element={<UserPost />} />
            <Route path="follower" element={<UserFollower />} />
            <Route path="following" element={<UserFollowings />} />
            <Route path="post" element={<UserPost />} />
            <Route path="like-post" element={<UserLikedPost />} />
            <Route path="video" element={<UserVideo />} />
            <Route path="like-video" element={<UserLikedVideo />} />
          </Route>
          <Route path="/setting" element={<Setting />} />
          <Route path="/video" element={<ShortVideo />} />
          <Route path="/createShortVideo" element={<Video />}>
            <Route index element={<MyVideo />} />
            <Route path="my-videos" element={<MyVideo />} />
            <Route path="following-videos" element={<FollowingVideo />} />
          </Route>
          <Route path="/channal" element={<ChannalContiner />}>
            <Route index element={<Channal />} />
            <Route path="joined" element={<Channal />} />
            <Route path="my" element={<MyChannal />} />
            <Route path="all" element={<AllChannal />} />
            <Route path="unveristy" element={<CommenChannal />} />
            <Route path="create" element={<CreateChannal />} />
          </Route>
          <Route path="/group" element={<GroupContiner />}>
            <Route index element={<Group />} />
            <Route path="joined" element={<Group />} />
            <Route path="my" element={<MyGroup />} />
            <Route path="all" element={<AllGroup />} />

            <Route path="create" element={<CreateGroup />} />
          </Route>
          <Route path="service" element={<Service />}>
            <Route index element={<ThomeFood />} />
            <Route path="የጾም" element={<ThomeFood />} />
            <Route path="የፍስግ" element={<GdiftFood />} />
            <Route path="detail/:Id" element={<FoodDetail />} />
          </Route>
          <Route path="/video-call" element={<VideoCall />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* SuggestionBox - only show when NOT on /message */}
      {authUser &&
        !isMessageRoute &&
        !isProfileRoute &&
        !isUpdatingSetting &&
        !ischannal &&
        !isgroup &&
        !isservice &&
        !iscall && (
          <div className="hidden md:block">
            <SuggestionBox />
          </div>
        )}

      <ToastContainer position="top-center" />
    </div>
  );
}
