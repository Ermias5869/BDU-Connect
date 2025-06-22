import { MessageSquare } from "lucide-react";

const NoChannalMessage = () => {
  return (
    <div className="w-full flex h-screen flex-1 flex-col items-center bg-white justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 text-blue-500 flex items-center
             justify-center animate-bounce"
            >
              <img src="/bduLogo.jpg" className="w-200 h-20 text-primary " />
            </div>
          </div>
        </div>

        <h1
          className="text-5xl text-blue-500 text-center mt-2"
          style={{ fontFamily: "Lobster, cursive" }}
        >
          click start Message
        </h1>
      </div>
    </div>
  );
};

export default NoChannalMessage;
