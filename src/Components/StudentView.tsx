import { useState, useEffect } from 'react';
import { supabase } from '../Utils/supabaseClient';
import ActivityList from './ActivityList';
import AddActivityPage from './AddActivityPage';

const StudentView = () => {
  const [userId, setUserId] = useState<string>('');
  const [userDetails, setUserDetails] = useState<any>(null); // Store user details (name, email, usn)
  const [error, setError] = useState<string>('');
  const [isAddingActivity, setIsAddingActivity] = useState<boolean>(false);

  // Fetch the logged-in student's details
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        setError('No user found. Please log in.');
        return;
      }

      setUserId(data.user.id); // Store the logged-in student's userId

      // Fetch user details (name, email, usn) from the 'users' table
      const { data: userDetails, error: userDetailsError } = await supabase
        .from('users')
        .select('name, email, usn')
        .eq('user_id', data.user.id);

      if (userDetailsError) {
        setError('Failed to fetch user details.');
        console.error('User details error:', userDetailsError);
        return;
      }

      setUserDetails(userDetails); // Store the fetched user details
      
    };

    fetchUser();
  }, []);

  const toggleView = () => {
    setIsAddingActivity((prevState) => !prevState);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Display student profile if userDetails are available */}
      {userDetails && (
        <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
          <h3 className="font-semibold text-lg">Profile</h3>
          <p><strong>Name:</strong> {userDetails[0].name}</p>
          <p><strong>Email:</strong> {userDetails[0].email}</p>
          <p><strong>USN:</strong> {userDetails[0].usn}</p>
        </div>
      )}

      {/* Button to toggle between views */}
      <button
        onClick={toggleView}
        className="p-2 bg-blue-500 text-white rounded-md mb-4"
      >
        {isAddingActivity ? 'Back to Activities' : 'Add New Activity'}
      </button>

      {/* Show activities or Add Activity page */}
      {isAddingActivity ? (
        <AddActivityPage userId={userId} />
      ) : (
        <ActivityList studentId={userId} canAssignMarks={false} />
      )}
    </div>
  );
};

export default StudentView;
