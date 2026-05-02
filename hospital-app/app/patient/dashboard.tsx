import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { API } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage"
export default function Dashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    prescriptions: 0,
  });

  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
  const load = async () => {
    try {
      const token = await AsyncStorage.getItem("token") // 🔥

      const res = await API.get("/patient/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setStats(res.data.stats || {})
      setActivity(res.data.activity || [])

    } catch (err) {
      console.log("DASHBOARD ERROR:", err)
    }
  }

  load()
}, [])
  const cards = [
    { title: "Book Appointment", link: "/patient/doctors" },
    { title: "My Appointments", link: "/patient/appointments" },
    { title: "Prescriptions", link: "/patient/prescriptions" },
    { title: "My Profile", link: "/patient/profile" },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">

      {/* Header */}
      <Text className="text-2xl font-bold mb-1">
        Patient Dashboard
      </Text>

      <Text className="text-gray-500 mb-4">
        Manage your appointments & health records
      </Text>

      {/* Stats */}
      <View className="flex-row justify-between mb-4">

        <View className="bg-white p-4 rounded-xl w-[32%]">
          <Text className="text-xs text-gray-500">Total</Text>
          <Text className="text-xl font-bold">{stats.total}</Text>
        </View>

        <View className="bg-white p-4 rounded-xl w-[32%]">
          <Text className="text-xs text-gray-500">Upcoming</Text>
          <Text className="text-xl font-bold">{stats.upcoming}</Text>
        </View>

        <View className="bg-white p-4 rounded-xl w-[32%]">
          <Text className="text-xs text-gray-500">Prescriptions</Text>
          <Text className="text-xl font-bold">{stats.prescriptions}</Text>
        </View>

      </View>

      {/* Quick Actions */}
      <View className="flex-row flex-wrap justify-between mb-4">

        {cards.map((card, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => router.push(card.link as any)}
            className="bg-white p-4 rounded-xl mb-3 w-[48%]"
          >
            <Text className="font-semibold">{card.title}</Text>
          </TouchableOpacity>
        ))}

      </View>

      {/* Activity */}
      <View className="bg-white p-4 rounded-xl mb-6">

        <Text className="font-semibold mb-3">
          Recent Activity
        </Text>

        {activity.length === 0 && (
          <Text className="text-gray-500">
            No recent activity
          </Text>
        )}

        {activity.map((a, i) => (
          <View
            key={i}
            className="flex-row justify-between border-b pb-2 mb-2"
          >
            <Text>
              {a.type === "appointment"
                ? `Appointment with Dr. ${a.doctor}`
                : "Prescription added"}
            </Text>

            <Text className="text-gray-400 text-xs">
              {new Date(a.date).toDateString()}
            </Text>
          </View>
        ))}

      </View>

      {/* Floating Button */}
      <TouchableOpacity
        onPress={() => router.push("/patient/doctors")}
        className="absolute bottom-6 right-6 bg-blue-600 px-4 py-2 rounded-full"
      >
        <Text className="text-white">Book</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}