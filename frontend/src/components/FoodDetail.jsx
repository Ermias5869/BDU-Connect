import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function FoodDetail() {
  const { Id } = useParams();

  const {
    data: food,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", Id],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/order/getorder/${Id}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok || typeof data !== "object") {
        throw new Error("Failed to fetch item");
      }
      return data;
    },
  });

  const handleOrder = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/booking/checkout/${Id}`,
        {
          credentials: "include",
          method: "POST",
        }
      );
      const data = await res.json();

      if (data.status === "success" && data.session?.url) {
        window.location.href = data.session.url; // redirect to Stripe checkout
      } else {
        alert("Checkout session failed. Please try again.");
      }
    } catch (error) {
      console.error("Order failed:", error);
      alert("Something went wrong. Try again.");
    }
  };

  if (isLoading)
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (isError || !food)
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load food details
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-6 p-2 bg-white shadow-md rounded-xl">
      <img
        src={`/${food.image}`}
        alt={food.name}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <h2 className="text-3xl font-bold mb-2">{food.name}</h2>
      <p className="text-gray-700 text-lg mb-1">ዋጋ፡ {food.price} ብር</p>
      <p className="text-gray-600 mb-2">አይነት፡ {food.type}</p>
      {!food.isAvailable && <p className="text-red-500 mb-4">ይህ ምግብ አልቋል።</p>}

      <button
        onClick={handleOrder}
        disabled={!food.isAvailable}
        className={`w-full py-2 rounded-md text-white font-semibold transition ${
          food.isAvailable
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        አሁን እዘዝ
      </button>
    </div>
  );
}
