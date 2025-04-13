import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Utils/supabaseClient";

const Details = () => {
  const [name, setName] = useState("");
  const [usn, setUsn] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        setError("No user found. Please log in.");
        return;
      }
      setUserId(user.id); // Set the logged-in user's ID
    };

    fetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!userId) {
      setError("No user found. Please log in.");
      return;
    }

    const { error } = await supabase
      .from("users") // Ensure the correct table name
      .update({ name, usn, role })
      .eq("user_id", userId);

    if (error) {
      setError(error.message);
    } else {
      navigate("/"); // Redirect to login
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          Additional Details
        </h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="w-full p-2 mb-4 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          {/* <option value="coordinator">Coordinator</option> */}
        </select>

        <input
          type="text"
          placeholder="USN"
          className="w-full p-2 mb-4 border rounded"
          value={usn}
          onChange={(e) => setUsn(e.target.value)}
          disabled={role === "coordinator"} // Disable if role is coordinator
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Details;
