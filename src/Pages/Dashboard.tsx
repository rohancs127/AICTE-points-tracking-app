import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "../Services/authService"; // Import the signOut function
import CoordinatorView from "../Components/CoordinatorView";
import StudentView from "../Components/StudentView";
// import { deleteUser } from "../Services/deleteUser";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate(); // To handle navigation after logout
  const { role } = location.state; // Include userId from state

  const handleLogout = async () => {
    try {
      await signOut(); // Log out the user
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  // const handleDelete = async ()=>{
  //   try{
  //     await deleteUser(userId);
  //     navigate("/");
  //   } catch(error){
  //     console.error("Delete user error: ", error);
  //   }
  // }

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4 gap-3">
        <button
          onClick={handleLogout}
          className="p-1 px-3 bg-red-500 text-white rounded-md hover:bg-red-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Logout
        </button>
        {/* <button
          onClick={handleDelete}
          className="p-1 px-3 bg-red-500 text-white rounded-md hover:bg-red-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Delete user
        </button> */}
      </div>

      {role === "coordinator" ? <CoordinatorView /> : <StudentView />}
    </div>
  );
};

export default Dashboard;
