import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import { userAtom } from "../store";
import { logout } from "../api/authApi";
import { useQueryClient } from "@tanstack/react-query";

const Profile = () => {
  const [currentUser] = useAtom(userAtom);
  const queryClient = useQueryClient();

  const onLogOut = async () => {
    await logout();
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <>
      <span>{currentUser && currentUser.username}</span>
      {currentUser ? (
        <span onClick={onLogOut}>Logout</span>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </>
  );
};

export default Profile;
