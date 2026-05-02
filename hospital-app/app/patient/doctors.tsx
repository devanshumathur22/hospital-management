import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { API } from "../../services/api";

export default function Doctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [showPayment, setShowPayment] = useState(false);
  const [paymentMode, setPaymentMode] = useState("UPI");

  useEffect(() => {
    API.get("/doctors")
      .then((res) => setDoctors(res.data || []))
      .catch(() => setDoctors([]));
  }, []);

  const handleConfirm = () => {
    if (!time) {
      Alert.alert("Select time");
      return;
    }
    setShowPayment(true);
  };

  const finalBooking = async () => {
    try {
      const res = await API.post("/appointments", {
        doctorId: selectedDoctor.id,
        date,
        time,
        paymentMode,
        amount: 500,
      });

      Alert.alert("Success", "Appointment Booked ✅");

      setShowPayment(false);
      setSelectedDoctor(null);
    } catch {
      Alert.alert("Error", "Booking failed");
    }
  };

  return (
    <View className="flex-1 bg-white p-4">

      <Text className="text-xl font-bold mb-4">
        Find Doctors
      </Text>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <View className="bg-gray-100 p-4 rounded-xl mb-3">

            <Text className="font-bold">{item.name}</Text>
            <Text>{item.specialization}</Text>

            <TouchableOpacity
              onPress={() => setSelectedDoctor(item)}
              className="bg-blue-600 mt-2 p-2 rounded"
            >
              <Text className="text-white text-center">
                Book
              </Text>
            </TouchableOpacity>

          </View>

        )}
      />

      {/* BOOK MODAL */}
      <Modal visible={!!selectedDoctor} transparent animationType="slide">
        <View className="flex-1 justify-center bg-black/40 p-4">

          <View className="bg-white p-4 rounded-xl">

            <Text className="font-bold mb-3">
              Book Appointment
            </Text>

            <TextInput
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              className="border p-2 mb-2 rounded"
            />

            <TextInput
              placeholder="HH:mm"
              value={time}
              onChangeText={setTime}
              className="border p-2 mb-3 rounded"
            />

            <TouchableOpacity
              onPress={handleConfirm}
              className="bg-blue-600 p-2 rounded mb-2"
            >
              <Text className="text-white text-center">
                Confirm
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedDoctor(null)}
              className="bg-gray-300 p-2 rounded"
            >
              <Text className="text-center">Close</Text>
            </TouchableOpacity>

          </View>

        </View>
      </Modal>

      {/* PAYMENT MODAL */}
      <Modal visible={showPayment} transparent animationType="fade">
        <View className="flex-1 justify-center bg-black/40 p-4">

          <View className="bg-white p-4 rounded-xl">

            <Text className="font-bold mb-3">Payment</Text>

            <Text className="mb-2">Doctor Fee: ₹500</Text>

            <View className="flex-row gap-2 mb-3">

              <TouchableOpacity
                onPress={() => setPaymentMode("UPI")}
                className={`flex-1 p-2 rounded ${
                  paymentMode === "UPI"
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                <Text className="text-center text-white">
                  UPI
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPaymentMode("CASH")}
                className={`flex-1 p-2 rounded ${
                  paymentMode === "CASH"
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                <Text className="text-center text-white">
                  Cash
                </Text>
              </TouchableOpacity>

            </View>

            <TouchableOpacity
              onPress={finalBooking}
              className="bg-green-600 p-2 rounded mb-2"
            >
              <Text className="text-white text-center">
                Pay & Confirm
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowPayment(false)}
              className="bg-gray-300 p-2 rounded"
            >
              <Text className="text-center">Cancel</Text>
            </TouchableOpacity>

          </View>

        </View>
      </Modal>

    </View>
  );
}