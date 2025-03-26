import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";

interface BusinessDaysPickerProps {
  selectedDays: string[];
  onDayToggle: (day: string) => void;
  error?: string;
  showShortNames?: boolean; // Optional prop to show 3-letter abbreviations
}

const BusinessDaysPicker: React.FC<BusinessDaysPickerProps> = ({
  selectedDays,
  onDayToggle,
  error,
  showShortNames = true,
}) => {
  // Static days definition within the component
  const daysOptions = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
  ];

  return (
    <View style={tw`p-4`}>
      <Text style={tw`text-lg text-gray-900 mb-2`}>Business Days Open *</Text>
      <View style={tw`flex-row flex-wrap justify-between mb-4`}>
        {daysOptions.map((day) => (
          <TouchableOpacity
            key={day.value}
            style={tw`p-3 border border-gray-300 rounded-full mb-2 ${
              selectedDays.includes(day.value)
                ? "bg-blue-500 border-blue-500"
                : ""
            }`}
            onPress={() => onDayToggle(day.value)}>
            <Text
              style={tw`text-gray-900 ${
                selectedDays.includes(day.value) ? "text-white" : ""
              }`}>
              {showShortNames ? day.label.substring(0, 3) : day.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={tw`text-red-500 text-sm mb-2`}>{error}</Text>}
    </View>
  );
};

export default BusinessDaysPicker;
