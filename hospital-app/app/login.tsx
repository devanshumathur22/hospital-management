// app/login.tsx

import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { loginUser } from "../services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"
export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async () => {
  try {
    const res = await loginUser({ email, password });

    console.log("LOGIN RES:", res.data);

    if (!res.data?.success) {
      Alert.alert("Error", "Invalid credentials");
      return;
    }

    const { token, role } = res.data;

    await AsyncStorage.setItem("token", token);

    console.log("TOKEN SAVED:", token);

    if (role === "patient") {
      router.replace("/patient/dashboard" as any);
      return; // 🔥 VERY IMPORTANT
    }

  } catch (err: any) {
    console.log("LOGIN ERROR:", err);
    Alert.alert("Error", "Login failed");
  }
};
  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6">Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border p-3 mb-4 rounded"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="border p-3 mb-6 rounded"
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-500 p-4 rounded"
      >
        <Text className="text-white text-center">Login</Text>
      </TouchableOpacity>
    </View>
  );
}