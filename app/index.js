import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useRef, useMemo } from "react";
import {
  BottomSheetModalProvider,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import DisplayChart from "./components/DisplayChart";
import RON95LOGO from "./assets/images/ron95.png";
import RON97LOGO from "./assets/images/ron97.png";
import DIESELLOGO from "./assets/images/diesel.png";

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

  // ref
  const bottomSheetModalRef = useRef();

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    // console.log("handleSheetChanges", index);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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
                onPress={handlePresentModalPress}
                className="my-1 py-6 px-4 flex flex-row items-center justify-between bg-zinc-800 rounded-xl"
              >
                <View className="flex flex-row items-center justify-center">
                  <Image
                    source={item.image}
                    placeholder={blurhash}
                    width={70}
                    height={70}
                    contentFit="contain"
                    transition={1000}
                  />
                  <View className="px-4">
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
        onChange={handleSheetChanges}
        style={styles.bottomSheet}
      >
        <View className="flex-1 items-center">
          <Text>Awesome 🎉</Text>
          <DisplayChart fuelType="RON95" />
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "#fff",
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
