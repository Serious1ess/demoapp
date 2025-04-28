import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import tw from "../utils/tw";
interface PickerOption {
  label: string;
  value: string;
}

interface CustomPickerProps {
  value: string;
  options: PickerOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  onCustomInputChange?: (text: string) => void; // New prop for custom input
  customInputValue?: string; // New prop for custom input value
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  error,
  onCustomInputChange,
  customInputValue = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <View style={tw`mb-4`}>
      {/* Picker Trigger */}
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={[
          tw`border border-gray-300 rounded-lg p-4`,
          error ? tw`border-red-500` : null,
        ]}>
        <Text style={tw`text-gray-900 ${!value ? "text-gray-400" : ""}`}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      {/* Additional Input for "Other" option */}
      {value === "other" && (
        <View style={tw`mt-2`}>
          <TextInput
            style={tw`w-full p-4 border border-gray-300 rounded-lg`}
            placeholder="Please specify"
            value={customInputValue}
            onChangeText={onCustomInputChange}
          />
        </View>
      )}

      {/* Picker Modal */}
      <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        style={tw`m-0 justify-end`}>
        <View style={tw`bg-white rounded-t-lg `}>
          <View style={tw`p-4 border-b border-gray-200`}>
            <Text style={tw`text-lg font-semibold`}>Select an option</Text>
          </View>
          <ScrollView>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={tw`p-4 border-b border-gray-100 flex-row justify-between items-center`}
                onPress={() => {
                  onChange(option.value);
                  setIsVisible(false);
                }}>
                <Text style={tw`text-gray-900`}>{option.label}</Text>
                {value === option.value && (
                  <Text style={tw`text-blue-500 font-bold`}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {error && <Text style={tw`text-red-500 text-sm mt-1`}>{error}</Text>}
    </View>
  );
};

export default CustomPicker;
