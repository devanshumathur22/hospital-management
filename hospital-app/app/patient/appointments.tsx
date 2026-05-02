import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { API } from "../../services/api";

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await API.get("/appointments");
      setAppointments(res.data || []);
    } catch {
      setAppointments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const cancelAppointment = async (id: string) => {
    await API.delete(`/appointments/${id}`);
    loadData();
  };

  const saveReschedule = async () => {
    if (!selected || !newDate || !newTime) return;

    await API.put(`/appointments/${selected.id}`, {
      date: newDate,
      time: newTime,
    });

    setSelected(null);
    loadData();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">

      <Text className="text-xl font-bold mb-4">Appointments</Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-4 rounded-xl mb-3">

            <Text className="font-bold">
              Dr. {item.doctor?.name}
            </Text>

            <Text>{new Date(item.date).toDateString()}</Text>
            <Text>{item.time}</Text>

            <Text
              className={`mt-1 ${
                item.status === "cancelled"
                  ? "text-red-500"
                  : item.status === "completed"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {item.status}
            </Text>

            {item.status === "pending" && (
              <View className="flex-row gap-2 mt-2">

                <TouchableOpacity
                  onPress={() => {
                    setSelected(item);
                    setNewDate(item.date);
                    setNewTime(item.time);
                  }}
                  className="flex-1 bg-blue-600 p-2 rounded"
                >
                  <Text className="text-white text-center">
                    Reschedule
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => cancelAppointment(item.id)}
                  className="flex-1 bg-red-500 p-2 rounded"
                >
                  <Text className="text-white text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>

              </View>
            )}

          </View>
        )}
      />

      {/* MODAL */}
      <Modal visible={!!selected} transparent animationType="slide">
        <View className="flex-1 justify-center bg-black/40 p-4">

          <View className="bg-white p-4 rounded-xl">

            <Text className="font-bold mb-3">Reschedule</Text>

            <TextInput
              placeholder="YYYY-MM-DD"
              value={newDate}
              onChangeText={setNewDate}
              className="border p-2 mb-2 rounded"
            />

            <TextInput
              placeholder="HH:mm"
              value={newTime}
              onChangeText={setNewTime}
              className="border p-2 mb-3 rounded"
            />

            <TouchableOpacity
              onPress={saveReschedule}
              className="bg-blue-600 p-2 rounded mb-2"
            >
              <Text className="text-white text-center">Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelected(null)}
              className="bg-gray-300 p-2 rounded"
            >
              <Text className="text-center">Close</Text>
            </TouchableOpacity>

          </View>

        </View>
      </Modal>

    </View>
  );
}