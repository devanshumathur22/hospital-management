import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { API } from "../../services/api";

export default function Bills() {
  const router = useRouter();

  const [bills, setBills] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/patient/bills")
      .then((res) => {
        setBills(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setBills([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bills.filter((b) => {
    const name = (b.title || "bill").toLowerCase();
    const matchSearch = name.includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || b.type === filter;
    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading bills...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">

      {/* Title */}
      <Text className="text-xl font-bold text-blue-600 mb-4">
        My Bills
      </Text>

      {/* Search */}
      <TextInput
        placeholder="Search bills..."
        value={search}
        onChangeText={setSearch}
        className="border p-3 rounded mb-3 bg-white"
      />

      {/* Filter Buttons */}
      <View className="flex-row flex-wrap gap-2 mb-4">
        {["ALL", "DOCTOR", "LAB", "PHARMACY", "ADMISSION"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`px-3 py-1 rounded-full ${
              filter === f ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-sm ${
                filter === f ? "text-white" : "text-black"
              }`}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Text className="text-gray-500 text-center mt-4">
            No bills found
          </Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(`/patient/invoice/${item.id}` as any)
            }
            className="bg-white p-4 rounded-xl mb-3 shadow"
          >

            {/* Left */}
            <Text className="font-semibold">
              {item.title || "Hospital Bill"}
            </Text>

            <Text className="text-gray-500 text-sm">
              {item.type} •{" "}
              {new Date(item.createdAt).toDateString()}
            </Text>

            {/* Right */}
            <View className="mt-2 flex-row justify-between items-center">

              <Text className="font-bold text-blue-600">
                ₹{item.totalAmount}
              </Text>

              <Text
                className={`text-xs px-2 py-1 rounded ${
                  item.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : item.status === "partial"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status}
              </Text>

            </View>

            {/* Pay Button */}
            {item.status === "pending" && (
              <TouchableOpacity
                onPress={() =>
                  router.push(`/patient/invoice/${item.id}` as any)
                }
                className="mt-2 bg-green-600 p-2 rounded"
              >
                <Text className="text-white text-center">
                  Pay Now
                </Text>
              </TouchableOpacity>
            )}

          </TouchableOpacity>
        )}
      />

    </View>
  );
}