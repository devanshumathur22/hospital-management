import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { API } from "../../services/api";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/prescriptions")
      .then((res) => {
        setPrescriptions(res.data || []);
        setFiltered(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();

    const f = prescriptions.filter((p: any) => {
      const doctor = p.doctor?.name?.toLowerCase() || "";
      const patient = p.patient?.name?.toLowerCase() || "";

      return doctor.includes(s) || patient.includes(s);
    });

    setFiltered(f);
  }, [search, prescriptions]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">

      <Text className="text-xl font-bold mb-4">
        My Prescriptions
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
        <Text className="text-gray-500">
          No prescriptions found
        </Text>
      )}

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <View className="bg-gray-100 p-4 rounded-xl mb-3">

            <Text className="font-bold">
              Dr. {item.doctor?.name}
            </Text>

            <Text className="text-gray-500 text-sm">
              {new Date(item.createdAt).toDateString()}
            </Text>

            {/* Medicines preview */}
            {item.medicine?.slice(0, 2).map((m: any, i: number) => (
              <Text key={i}>
                {m.name} - {m.dosage}
              </Text>
            ))}

            {/* View Button */}
            <TouchableOpacity
              onPress={() => setSelected(item)}
              className="bg-blue-600 p-2 rounded mt-2"
            >
              <Text className="text-white text-center">
                View
              </Text>
            </TouchableOpacity>

          </View>

        )}
      />

      {/* MODAL */}
      <Modal visible={!!selected} transparent animationType="slide">
        <View className="flex-1 justify-center bg-black/40 p-4">

          <View className="bg-white p-4 rounded-xl max-h-[80%]">

            <ScrollView>

              <Text className="text-lg font-bold mb-2">
                Prescription
              </Text>

              <Text>
                Patient: {selected?.patient?.name}
              </Text>

              <Text>
                Doctor: Dr. {selected?.doctor?.name}
              </Text>

              <Text className="mb-3">
                Date:{" "}
                {selected?.createdAt
                  ? new Date(selected.createdAt).toDateString()
                  : ""}
              </Text>

              {/* Medicines */}
              {selected?.medicine?.map((m: any, i: number) => (
                <View key={i} className="mb-2">

                  <Text className="font-semibold">
                    {i + 1}. {m.name}
                  </Text>

                  <Text>Dosage: {m.dosage}</Text>
                  <Text>Days: {m.days || "-"}</Text>
                  <Text>Note: {m.note || "-"}</Text>

                </View>
              ))}

              {/* Close */}
              <TouchableOpacity
                onPress={() => setSelected(null)}
                className="bg-gray-600 p-2 rounded mt-4"
              >
                <Text className="text-white text-center">
                  Close
                </Text>
              </TouchableOpacity>

            </ScrollView>

          </View>

        </View>
      </Modal>

    </View>
  );
}