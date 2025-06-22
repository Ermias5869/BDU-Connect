import { Camera } from "lucide-react";
import { AuthStore } from "../store/userAuthStore";

export default function UpdateProfilePhoto() {
  const { authUser, uploadPhoto, isUpdateingProfile } = AuthStore();
  const handleProfile = (e) => {
    const file = e.target.files[0];

    uploadPhoto(file);
  };
  return (
    <div className="flex  justify-center m-4">
      <div className="bg-white p-4 rounded-xl flex flex-col items-center font-medium text-stone-400">
        <h1 className="text-center text-blue-500 mb-1.5">Profile</h1>
        <p className="text-gray-600">Your Profile Information</p>
        <div className="relative mt-5 ">
          <label htmlFor="fileInput" className="cursor-pointer ">
            <img
              src={authUser.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-3 border-blue-500"
            />
            <div className="absolute bottom-1 right-1 bg-gray-800 p-1 rounded-full">
              <Camera className="w-5 h-5 text-gray-300" />
            </div>
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfile}
            disabled={isUpdateingProfile}
          />
        </div>
        <p className="font-light text-gray-600">
          click the camera button and upload profile
        </p>
      </div>
    </div>
  );
}
