import { Stack } from "expo-router";

// import "../global.css";
import "../global.css";

export default function () {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // presentation: "modal",
      }}
    />
  );
}
