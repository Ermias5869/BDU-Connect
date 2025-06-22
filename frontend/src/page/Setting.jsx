import UpdateMe from "../components/UpdateMe";
import UpdatePassword from "../components/UpdatePassword";
import UpdateProfilePhoto from "../components/UpdateProfilePhoto";

export default function Setting() {
  return (
    <div className="flex items-center flex-col justify-center">
      <UpdateProfilePhoto />
      <div className="flex  gap-3.5 items-start justify-between">
        <UpdatePassword />

        <UpdateMe />
      </div>
    </div>
  );
}
