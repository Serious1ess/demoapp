import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const DatePicker = ({ onConfirm }) => {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  const handleChange = (event, date) => {
    if (date) {
      setSelectedDateTime(date);
      onConfirm(date); // Pass the selected date/time to the parent component
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Date & Time:</Text>
      <DateTimePicker
        value={selectedDateTime}
        mode="datetime"
        display="default"
        onChange={handleChange}
        style={styles.picker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  picker: {
    width: "100%",
  },
});

export default DatePicker;
