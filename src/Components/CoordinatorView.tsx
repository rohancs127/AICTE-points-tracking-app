import { useState, useEffect } from "react";
import { supabase } from "../Utils/supabaseClient";
import ActivityList from "./ActivityList";

const CoordinatorView = () => {
  const [students, setStudents] = useState<any[]>([]); // Store the list of students
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null); // Track the selected student for activities
  const [userDetails, setUserDetails] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("user_id, name, usn") // Fetch user_id and name of all students
        .eq("role", "student"); // Filter by role: student

      if (error) {
        setError("Failed to fetch students.");
        console.error(error);
        return;
      }

      setStudents(data); // Store the list of students
    };

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        setError("No user found. Please log in.");
        return;
      }

      // Fetch user details (name, email, usn) from the 'users' table
      const { data: userDetails, error: userDetailsError } = await supabase
        .from("users")
        .select("name, email")
        .eq("user_id", data.user.id);

      if (userDetailsError) {
        setError("Failed to fetch user details.");
        console.error("User details error:", userDetailsError);
        return;
      }

      setUserDetails(userDetails); // Store the fetched user details
      console.log(userDetails);
      
    };

    fetchStudents();
    fetchUser();
  }, []);

  // Handler to select a student and show their activities
  const handleStudentClick = (studentId: string) => {
    setSelectedStudent(studentId);
  };

  // Handler to go back to the student list
  const handleBackToList = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Display student profile if userDetails are available */}
      {userDetails && (
        <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
          <h3 className="font-semibold text-lg">Profile</h3>
          <p>
            <strong>Name:</strong> {userDetails[0].name}
          </p>
          <p>
            <strong>Email:</strong> {userDetails[0].email}
          </p>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Coordinator View</h2>

      {error && <p className="text-red-500">{error}</p>}

      {selectedStudent ? (
        <div className="space-y-4">
          <button
            onClick={handleBackToList}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Back to Student List
          </button>

          <ActivityList studentId={selectedStudent} canAssignMarks={true} />
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold">Student List</h3>
          <ul className="space-y-3">
            {students.map((student) => (
              <li
                key={student.user_id}
                className="cursor-pointer p-4 border rounded-md shadow-md transition-all duration-200 hover:bg-gray-200"
                onClick={() => handleStudentClick(student.user_id)}
              >
                <div>{student.name}</div>
                <div>{student.usn}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CoordinatorView;
