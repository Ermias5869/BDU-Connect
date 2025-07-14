import { Link } from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";
import { FcFilmReel } from "react-icons/fc";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import {
  HiChatBubbleLeftRight,
  HiChatBubbleOvalLeftEllipsis,
  HiMiniTrash,
} from "react-icons/hi2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/notification`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/notification`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Notifications deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/notification/${id}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Notification deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <div className="flex-[4_4_0]    mt-6 bg-white mx-16 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b-1 border-stone-500">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="ml-20">
              <IoSettingsOutline className="w-3" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2  bg-blue-500 shadow text-white rounded-box w-52"
            >
              <li>
                <a onClick={deleteNotifications}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => (
          <div className="border-b-1  border-stone-500" key={notification._id}>
            <div className="flex gap-3 p-2  items-center  w-full">
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-blue-500" />
              )}
              {notification.type === "unfollow" && (
                <FaUser className="w-7 h-7 text-blue-500" />
              )}
              {notification.type === "like" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}
              {notification.type === "unlike" && (
                <FaHeart className="w-7 h-7 text-black" />
              )}
              {notification.type === "comment" && (
                <HiChatBubbleOvalLeftEllipsis className="w-7 h-7 text-blue-500" />
              )}
              {notification.type === "message" && (
                <HiChatBubbleLeftRight className="w-7 h-7 text-blue-500" />
              )}
              {notification.type === "likeReel" && (
                <FaHeart className="w-7 h-7 text-yellow-400" />
              )}
              {notification.type === "unlikeReel" && (
                <FaHeart className="w-7 h-7 text-black" />
              )}
              <Link
                to={`/profile/${notification.from.studentId}`}
                className="flex items-center justify-between w-fill gap-2 "
              >
                <div className="avatar ">
                  <div className="w-8 rounded-full">
                    <img src={notification.from.photo || "/notProfile.jpg"} />
                  </div>
                </div>
                <div className="flex  flex-col">
                  <div>
                    <span className="font-bold text-blue-500">
                      {notification.from.name}
                    </span>{" "}
                  </div>
                  {notification.type === "follow" && "followed you  "}
                  {notification.type === "like" && "liked your post"}
                  {notification.type === "unfollow" && "unfollowed you "}
                  {notification.type === "unlike" && "unliked your post"}
                  {notification.type === "comment" && "comment your post"}
                  {notification.type === "message" && "send message "}
                  {notification.type === "unlikeReel" && "unliked your video"}
                  {notification.type === "likeReel" && "liked your video"}
                </div>
              </Link>
              <HiMiniTrash
                className="text-red-500 "
                onClick={() => deleteNotification(notification._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default NotificationPage;
