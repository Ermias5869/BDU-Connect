import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function ThomeFood() {
  const {
    data: order = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/order/order1`);
      const data = await res.json();
      if (!res.ok || !Array.isArray(data))
        throw new Error("Failed to fetch items");
      return data;
    },
  });

  if (isLoading)
    return <div className="text-center text-lg mt-8">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500 mt-8">Something went wrong.</div>
    );

  return (
    <main className="p-6 md:p-10">
      {order.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {order.map((item) => (
            <Link
              to={`/service/detail/${item._id}`}
              key={item._id}
              className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 border ${
                !item.isAvailable ? "opacity-60 grayscale" : ""
              }`}
            >
              <img
                src={`/${item.image}`}
                alt={item.name}
                className="w-full h-52 object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600">ዋጋ፡ {item.price} ብር</p>
                <p className="text-sm text-gray-500">አይነት፡ {item.type}</p>
                {!item.isAvailable && (
                  <span className="text-red-600 font-medium mt-2">አልቋል</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          ምናልባት ዛሬ ምንም አይነት ምግብ አልተዘጋጀም። እባክዎ በኋላ ይመለሱ።
        </p>
      )}
    </main>
  );
}
