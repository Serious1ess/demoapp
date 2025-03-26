import React, { useEffect, useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "./css/timepicker.css";

interface TimePickerProps {
  value: string; // Expects format "HH:mm:ss"
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

const CustomTimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  disabled = false,
}) => {
  // Convert "HH:mm:ss" to 12-hour format for the picker
  // In CustomTimePicker.tsx
  const formatTimeForPicker = (timeString: string) => {
    if (!timeString) return "12:00 AM";

    const [hours, minutes] = timeString.split(":");
    const hourInt = parseInt(hours, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const twelveHour = hourInt % 12 || 12;

    return `${twelveHour}:${minutes} ${ampm}`;
  };

  const formatTimeForStorage = (timeString: string) => {
    if (!timeString) return "12:00:00";

    const [timePart, ampm] = timeString.split(" ");
    const [hours, minutes] = timePart.split(":");

    let hourInt = parseInt(hours, 10);
    if (ampm === "PM" && hourInt < 12) hourInt += 12;
    if (ampm === "AM" && hourInt === 12) hourInt = 0;

    return `${hourInt.toString().padStart(2, "0")}:${minutes}:00`;
  };

  const [displayTime, setDisplayTime] = useState(formatTimeForPicker(value));

  useEffect(() => {
    setDisplayTime(formatTimeForPicker(value));
  }, [value]);

  const handleChange = (newDisplayTime: string) => {
    setDisplayTime(newDisplayTime);
    onChange(formatTimeForStorage(newDisplayTime));
  };

  return (
    <div className="time-picker-container">
      <TimePicker
        value={displayTime}
        onChange={handleChange}
        disableClock={true}
        clearIcon={null}
        disabled={disabled}
        className="custom-time-picker"
        format="h:mm a" // This enables 12-hour format
      />
    </div>
  );
};

export default CustomTimePicker;
