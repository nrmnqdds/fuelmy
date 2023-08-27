import "expo-router/entry";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  LogBox,
} from "react-native";
import { Image } from "expo-image";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useRef, useMemo, useState } from "react";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import DisplayChart from "./components/DisplayChart";
import RON95LOGO from "./assets/images/ron95.png";
import RON97LOGO from "./assets/images/ron97.png";
import DIESELLOGO from "./assets/images/diesel.png";

LogBox.ignoreLogs(["Require cycle: node_modules/victory"]);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const fuelData = [
  {
    id: 0,
    name: "RON95",
    image: RON95LOGO,
    description: "Research Octane Number 95",
  },
  {
    id: 1,
    name: "RON97",
    image: RON97LOGO,
    description: "Research Octane Number 97",
  },
  {
    id: 3,
    name: "Diesel",
    image: DIESELLOGO,
    description: "Euro 5",
  },
];

const App = () => {
  const [fontsLoaded] = useFonts({
    UberBold: require("./assets/fonts/UberMoveBold.otf"),
    UberMedium: require("./assets/fonts/UberMoveMedium.otf"),
  });

  const [selectedFuel, setSelectedFuel] = useState(fuelData[0]);

  const bottomSheetModalRef = useRef();

  const snapPoints = useMemo(() => ["50%", "60%"], []);

  const handlePresentModalPress = useCallback((item) => {
    setSelectedFuel(item);
    bottomSheetModalRef.current?.present();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        className="bg-zinc-900 flex-1 items-center"
        onLayout={onLayoutRootView}
      >
        <Text
          className="text-white py-10 text-4xl"
          style={{ fontFamily: "UberBold" }}
        >
          FuelMY
        </Text>
        <View className="w-screen flex-1">
          <FlatList
            data={fuelData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePresentModalPress(item)}
                className="py-6 px-2 flex flex-row items-center justify-between"
              >
                <View className="flex flex-row items-center justify-center">
                  <Image
                    source={item.image}
                    width={70}
                    height={70}
                    contentFit="contain"
                    transition={1000}
                  />
                  <View className="px-1">
                    <Text
                      className="text-white text-lg"
                      style={{ fontFamily: "UberBold" }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      className="text-zinc-500"
                      style={{ fontFamily: "UberMedium" }}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
      >
        <View className="flex-1 items-center">
          <DisplayChart fuelType={selectedFuel.name} />
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "#1F2937",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default App;
