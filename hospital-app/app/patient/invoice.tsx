import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { API } from "../../services/api";

export default function Invoice() {
  const { id } = useLocalSearchParams();

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payAmount, setPayAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");

  useEffect(() => {
    if (!id) return;

    API.get(`/bills/${id}`)
      .then((res) => {
        setInvoice(res.data);

        const remaining =
          Number(res.data.totalAmount || 0) -
          Number(res.data.paidAmount || 0);

        setPayAmount(String(remaining));
      })
      .catch(() => setInvoice(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePayment = async () => {
    try {
      const res = await API.post("/bills/pay", {
        billId: id,
        amount: Number(payAmount),
        paymentMode,
      });

      setInvoice(res.data.bill);

      Alert.alert("Success", "Payment Successful ✅");
    } catch (err: any) {
      Alert.alert("Error", "Payment failed");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!invoice) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Invoice not found</Text>
      </View>
    );
  }

  const total = Number(invoice.totalAmount || 0);
  const paid = Number(invoice.paidAmount || 0);
  const remaining = total - paid;

  return (
    <ScrollView className="flex-1 bg-white p-4">

      <Text className="text-xl font-bold mb-4">
        Medicare Hospital
      </Text>

      <Text className="mb-2">Invoice ID: {invoice.id}</Text>

      {/* Patient */}
      <View className="bg-gray-100 p-3 rounded mb-3">
        <Text className="font-bold">Patient</Text>
        <Text>{invoice.patient?.name}</Text>
        <Text>{invoice.patient?.phone}</Text>
      </View>

      {/* Doctor */}
      <View className="bg-gray-100 p-3 rounded mb-3">
        <Text className="font-bold">Doctor</Text>
        <Text>{invoice.doctor?.name}</Text>
      </View>

      {/* Bill */}
      <View className="bg-gray-100 p-3 rounded mb-3">
        <Text>{invoice.title}</Text>
        <Text>Total: ₹{total}</Text>
      </View>

      {/* Status */}
      <Text>Paid: ₹{paid}</Text>
      <Text>Remaining: ₹{remaining}</Text>
      <Text>Status: {invoice.status}</Text>

      {/* Payment */}
      {invoice.status !== "paid" && (
        <View className="mt-4">

          {/* Mode */}
          <View className="flex-row gap-2 mb-3">

            {["UPI", "CASH", "CARD"].map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setPaymentMode(mode)}
                className={`flex-1 p-2 rounded ${
                  paymentMode === mode
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                <Text className="text-center text-white">
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}

          </View>

          {/* Amount */}
          <TextInput
            value={payAmount}
            onChangeText={setPayAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
            className="border p-2 rounded mb-3"
          />

          {/* Pay */}
          <TouchableOpacity
            onPress={handlePayment}
            className="bg-green-600 p-3 rounded"
          >
            <Text className="text-white text-center">
              Pay Now
            </Text>
          </TouchableOpacity>

        </View>
      )}

    </ScrollView>
  );
}