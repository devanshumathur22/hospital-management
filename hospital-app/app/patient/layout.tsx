// app/patient/layout.tsx

import { Tabs } from "expo-router";

export default function PatientLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>

      <Tabs.Screen name="dashboard" options={{ title: "Home" }} />

      <Tabs.Screen name="doctors" options={{ title: "Doctors" }} />

      <Tabs.Screen name="appointments" options={{ title: "Appointments" }} />

      <Tabs.Screen name="bills" options={{ title: "Bills" }} />

      <Tabs.Screen name="profile" options={{ title: "Profile" }} />

    </Tabs>
  );
}