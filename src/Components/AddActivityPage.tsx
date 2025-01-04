import { useState, useEffect } from "react";
import { supabase } from "../Utils/supabaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { fetchThemes, Theme } from "../Services/themeService";

interface AddActivityPageProps {
  userId: string; // Accept userId as prop
}

const AddActivityPage: React.FC<AddActivityPageProps> = ({ userId }) => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [themeId, setThemeId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hours, setHours] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    const loadThemes = async () => {
      const { data, error } = await fetchThemes();
      if (error) {
        setError(error);
      } else {
        setThemes(data || []);
      }
    };

    loadThemes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");

    const { error } = await supabase.from("activities").insert([
      {
        student_id: userId, // Use userId here
        theme_id: themeId,
        title,
        description,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        no_of_hours: hours,
      },
    ]);

    if (error) {
      setError("Failed to add activity. Please try again.");
    } else {
      setSuccess("Activity added successfully!");
      setError("");
      setTitle("");
      setDescription("");
      setStartDate(null);
      setEndDate(null);
      setHours(0);
      setThemeId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Add New Activity</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="theme" className="block font-medium mb-1">
            Theme
          </label>
          <select
            id="theme"
            value={themeId || ""}
            onChange={(e) => setThemeId(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select a theme</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="startDate" className="block font-medium mb-1">
            Start Date
          </label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded-md"
            placeholderText="Select start date"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="endDate" className="block font-medium mb-1">
            End Date
          </label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded-md"
            placeholderText="Select end date"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="hours" className="block font-medium mb-1">
            Number of Hours
          </label>
          <input
            id="hours"
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddActivityPage;
