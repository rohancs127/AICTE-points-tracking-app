import { useState, useEffect } from "react";
import { supabase } from "../Utils/supabaseClient";

interface ActivityListProps {
  studentId: string; // The student ID to fetch activities
  canAssignMarks: boolean; // Flag to check if marks can be assigned by coordinator
}

const ActivityList = ({ studentId, canAssignMarks }: ActivityListProps) => {
  const [activities, setActivities] = useState<any[]>([]); // Store activities
  const [totalMarks, setTotalMarks] = useState<number>(0); // Store total marks
  const [error, setError] = useState<string>(""); // Store error message
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null
  ); // Track which activity is being edited
  const [tempMarks, setTempMarks] = useState<number | null>(null); // Temporary marks for editing

  // Fetch activities and total marks for the student
  useEffect(() => {
    if (!studentId || studentId === "") {
    //   setError("Invalid student ID.");
    //   console.error("Invalid student ID:", studentId);
      return;
    }
  
    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from("activities")
          .select(
            "activity_id, title, description, start_date, end_date, no_of_hours, marks"
          )
          .eq("student_id", studentId);
  
        if (error) {
          console.error("Activities fetch error:", error);
          setError("Failed to fetch activities.");
          return;
        }
  
        setActivities(data || []);
        setTotalMarks(data?.reduce((sum, activity) => sum + (activity.marks || 0), 0) || 0);
        setError("");
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred while fetching activities.");
      }
    };
  
    fetchActivities();
  }, [studentId]);
  
  const handleMarksUpdate = async (activityId: string) => {
    if (tempMarks === null) return;

    const { error } = await supabase
      .from("activities")
      .update({ marks: tempMarks })
      .eq("activity_id", activityId);

    if (error) {
      setError("Failed to update marks.");
      console.error(error);
    } else {
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.activity_id === activityId
            ? { ...activity, marks: tempMarks }
            : activity
        )
      );
      setTotalMarks((prevTotal) => prevTotal - activities.find(a => a.activity_id === activityId)?.marks + tempMarks);
      setEditingActivityId(null);
      setTempMarks(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div className="font-bold">Total Marks: {totalMarks}</div>

      {activities.length > 0 ? (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li
              key={activity.activity_id}
              className="p-4 border rounded-md shadow-md"
            >
              <div className="font-semibold">{activity.title}</div>
              <p>{activity.description}</p>
              <div className="text-sm text-gray-600">
                <span>Start Date: {activity.start_date}</span> |{" "}
                <span>End Date: {activity.end_date}</span>
              </div>
              <div className="mt-2">
                <strong>No. of Hours:</strong> {activity.no_of_hours}
              </div>
              {canAssignMarks ? (
                <div className="mt-2">
                  <strong>Marks: </strong>
                  {editingActivityId === activity.activity_id ? (
                    <>
                      <input
                        type="number"
                        min="0"
                        value={tempMarks ?? activity.marks}
                        className="ml-2 border p-2 rounded-md"
                        onChange={(e) =>
                          setTempMarks(Number(e.target.value))
                        }
                      />
                      <button
                        onClick={() => handleMarksUpdate(activity.activity_id)}
                        className="ml-2 px-4 py-1 bg-green-500 text-white rounded-md"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          setEditingActivityId(null);
                          setTempMarks(null);
                        }}
                        className="ml-2 px-4 py-1 bg-gray-500 text-white rounded-md"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {activity.marks}
                      <button
                        onClick={() => {
                          setEditingActivityId(activity.activity_id);
                          setTempMarks(activity.marks);
                        }}
                        className="ml-2 px-4 py-1 bg-blue-500 text-white rounded-md"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <strong>Marks:</strong> {activity.marks}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities found.</p>
      )}
    </div>
  );
};

export default ActivityList;
