import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Customer {
  id: string;
  full_name: string;
  phone: string;
}

interface CustomerListProps {
  customers: Customer[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCustomerPress: (customer: Customer) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  loading,
  searchQuery,
  onSearchChange,
  onCustomerPress,
}) => {
  return (
    <View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search customers..."
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={customers}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onCustomerPress(item)}>
              <View style={styles.item}>
                <Text style={styles.itemName}>{item.full_name}</Text>
                <Text style={styles.itemPhone}>{item.phone}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text>No customers found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  itemName: { fontSize: 18, fontWeight: "bold" },
  itemPhone: { fontSize: 14, color: "#666" },
});

export default CustomerList;
