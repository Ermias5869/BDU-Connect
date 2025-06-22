import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AuthStore } from "../store/userAuthStore";
import LoadingSpinner from "../ui/LoadingSpinner";
import useFollow from "../hook/useFollow";
import { Link } from "react-router-dom";
import { GiVideoConference } from "react-icons/gi";
export default function SuggestionBox() {
  const { Logout } = AuthStore();
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        console.error("Error during logout:", error); // Log the error
        throw new Error(error.message || "Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user/suggestUsers");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { follow, isPending } = useFollow();
  const { name, studentId, photo } = authUser;
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="h-full p-4 bg-gray-100">
      <div className="w-80 h-screen p-4 bg-white text-black flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <Link
              to={`/profile/${authUser.studentId}`}
              className="flex items-center gap-3"
            >
              <img
                src={photo || "noprofile.jpg"}
                alt="Profile"
                className="rounded-full w-10 h-10"
              />
              <div>
                <p className="font-semibold">{name}</p>
                <p className="text-gray-400 text-sm">
                  {studentId.toUpperCase()}
                </p>
              </div>
            </Link>
            <Link to="/video-call">
              <GiVideoConference className="text-3xl text-green-500" />
            </Link>
            <button
              className="text-white text-sm bg-blue-400 p-1.5 rounded-full hover:bg-blue-500 transition duration-200"
              onClick={(e) => {
                e.preventDefault();
                logout();
                Logout();
              }}
            >
              Logout
            </button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400 font-semibold">Suggested for you</p>
          </div>

          <div className="flex flex-col gap-4">
            {suggestedUsers.map((user) => (
              <Link
                to={`/profile/${user.studentId}`}
                key={user._id}
                className="flex items-center justify-between"
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
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-gray-500 text-xs">
                      {`Student In Bahir Dar University`}
                    </p>
                  </div>
                </div>
                <button
                  className="text-blue-400 text-sm "
                  onClick={(e) => {
                    e.preventDefault();
                    follow(user._id);
                  }}
                >
                  {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
