import { View, Text, TextInput, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { API } from "../../services/api";

export default function AppointmentHistory() {

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    API.get("/appointments?type=history")
      .then(res => setAppointments(Array.isArray(res.data) ? res.data : []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = appointments.filter((a) => {
    const doctor = a.doctor?.name?.toLowerCase() || "";

    const searchMatch = doctor.includes(search.toLowerCase());

    const dateMatch = dateFilter
      ? new Date(a.date).toDateString() === new Date(dateFilter).toDateString()
      : true;

    return searchMatch && dateMatch;
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading history...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">

      {/* Title */}
      <Text className="text-xl font-bold mb-4">
        Appointment History
      </Text>

      {/* Search */}
      <TextInput
        placeholder="Search doctor..."
        value={search}
        onChangeText={setSearch}
        className="border p-3 rounded mb-3"
      />

      {/* Empty */}
      {filtered.length === 0 && (
        <Text className="text-gray-500">No appointment history</Text>
      )}

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <View className="bg-gray-100 p-4 rounded-lg mb-3">

            <Text className="font-bold">
              Dr. {item.doctor?.name || "Unknown"}
            </Text>

            <Text>Date: {new Date(item.date).toDateString()}</Text>

            <Text>Time: {item.time}</Text>

            <Text
              className={`mt-1 ${
                item.status === "completed"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {item.status}
            </Text>

          </View>

        )}
      />

    </View>
  );
}