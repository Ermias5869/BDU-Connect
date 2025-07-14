import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/user/follow/${userId}`,
          {
             credentials: "include", 
            method: "POST",
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      console.log(error);
      toast.error("follow user not complate");
    },
  });

  return { follow, isPending };
};

export default useFollow;
