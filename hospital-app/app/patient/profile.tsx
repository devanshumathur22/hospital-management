import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { API } from "../../services/api";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    address: "",
    emergencyContact: "",
  });

  const getAge = (dob: string) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const load = async () => {
    try {
      const res = await API.get("/auth/me");
      const user = res.data?.user;

      if (user) {
        setForm({
          name: user.name || "",
          phone: user.phone || "",
          gender: user.gender || "",
          dob: user.dob ? user.dob.split("T")[0] : "",
          bloodGroup: user.bloodGroup || "",
          address: user.address || "",
          emergencyContact: user.emergencyContact || "",
        });
      }
    } catch {
      Alert.alert("Error", "Failed to load profile");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      await API.put("/profile", form);
      Alert.alert("Success", "Profile updated ✅");
      setEditing(false);
      load();
    } catch {
      Alert.alert("Error", "Update failed");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">

      <Text className="text-xl font-bold mb-4">
        Patient Profile
      </Text>

      {/* NAME */}
      <Text>Name</Text>
      <TextInput
        value={form.name}
        editable={editing}
        onChangeText={(t) => setForm({ ...form, name: t })}
        className="border p-2 rounded mb-2"
      />

      {/* PHONE */}
      <Text>Phone</Text>
      <TextInput
        value={form.phone}
        editable={editing}
        onChangeText={(t) => setForm({ ...form, phone: t })}
        className="border p-2 rounded mb-2"
      />

      {/* GENDER */}
      <Text>Gender</Text>
      <TextInput
        value={form.gender}
        editable={editing}
        onChangeText={(t) => setForm({ ...form, gender: t })}
        className="border p-2 rounded mb-2"
      />

      {/* DOB */}
      <Text>DOB</Text>
      <TextInput
        value={form.dob}
        editable={editing}
        onChangeText={(t) => setForm({ ...form, dob: t })}
        className="border p-2 rounded mb-2"
      />

      {/* AGE */}
      <Text>Age: {getAge(form.dob)}</Text>

      {/* BLOOD */}
      <Text>Blood Group</Text>
      <TextInput
        value={form.bloodGroup}
        editable={editing}
        onChangeText={(t) => setForm({ ...form, bloodGroup: t })}
        className="border p-2 rounded mb-2"
      />

      {/* EMERGENCY */}
      <Text>Emergency Contact</Text>
      <TextInput
        value={form.emergencyContact}
        editable={editing}
        onChangeText={(t) =>
          setForm({ ...form, emergencyContact: t })
        }
        className="border p-2 rounded mb-2"
      />

      {/* ADDRESS */}
      <Text>Address</Text>
      <TextInput
        value={form.address}
        editable={editing}
        onChangeText={(t) => setForm({ ...form, address: t })}
        className="border p-2 rounded mb-4"
      />

      {/* BUTTONS */}
      {!editing ? (
        <TouchableOpacity
          onPress={() => setEditing(true)}
          className="bg-blue-600 p-3 rounded"
        >
          <Text className="text-white text-center">
            Edit
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="flex-row gap-2">

          <TouchableOpacity
            onPress={save}
            className="flex-1 bg-green-600 p-3 rounded"
          >
            <Text className="text-white text-center">
              Save
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setEditing(false);
              load();
            }}
            className="flex-1 bg-gray-400 p-3 rounded"
          >
            <Text className="text-white text-center">
              Cancel
            </Text>
          </TouchableOpacity>

        </View>
      )}

    </ScrollView>
  );
}