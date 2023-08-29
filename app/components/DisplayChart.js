import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { csv2json } from "csvjson-csv2json";
import {
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryVoronoiContainer,
} from "victory-native";
import * as Linking from "expo-linking";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const DisplayChart = ({ fuelType }) => {
  const [chartData, setChartData] = useState([{ month: "", price: "" }]);
  const [minPrice, setMinPrice] = useState(0);
  const [lastPrice, setLastPrice] = useState(0);
  const [fontsLoaded] = useFonts({
    UberBold: require("../assets/fonts/UberMoveBold.otf"),
    UberMedium: require("../assets/fonts/UberMoveMedium.otf"),
  });

  useEffect(() => {
    fetch(
      "https://corsproxy.io/?https://storage.googleapis.com/dosm-public-economy/fuelprice.csv"
    )
      .then(async (response) => {
        const resp = await response.text();
        const json = csv2json(resp, { parseNumbers: true });
        // console.log(json);

        // Process the JSON data to extract the month and diesel price for "series_type": "level"
        const filteredData = json
          .filter((item) => item.series_type === "level")
          // .slice(1, 5)
          .map((item) => ({
            date: item.date,
            price: item[fuelType.toLowerCase()],
          }));
        setChartData(filteredData);
        // console.log(filteredData);

        // Find the minimum price value
        const minPriceValue = Math.min(
          ...filteredData.map((item) => item.price)
        );
        setMinPrice(minPriceValue);

        // Find the last price value
        const lastPriceValue = filteredData[filteredData.length - 1].price;
        setLastPrice(lastPriceValue);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fuelType]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      className="bg-zinc-800 flex-1 items-center pt-5"
      onLayout={onLayoutRootView}
    >
      <Text className="text-white" style={{ fontFamily: "UberMedium" }}>
        {fuelType}
      </Text>

      <View className="flex flex-row items-baseline">
        <Text
          className="text-white text-3xl"
          style={{ fontFamily: "UberBold" }}
        >{`RM${lastPrice.toFixed(2)}`}</Text>
        <Text className="text-zinc-400">/litre</Text>
      </View>

      <VictoryChart
        theme={VictoryTheme.material}
        minDomain={{ y: minPrice - 0.1 }}
        containerComponent={
          <VictoryVoronoiContainer
            labels={({ datum }) => `${datum.date}, ${datum.price.toFixed(2)}`}
          />
        }
      >
        <VictoryAxis
          dependentAxis
          tickFormat={(tick) => `${tick}`}
          style={{
            grid: { stroke: "#000000", strokeWidth: 0 },
          }}
        />
        <VictoryLine
          style={{
            data: { fill: "rgba(255, 41, 41, 0.2)", stroke: "#c43a41" },
          }}
          data={chartData}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 },
          }}
          x="date"
          y="price"
        />
      </VictoryChart>
      <View className="flex flex-row">
        <Text className="text-white">Source: </Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://open.dosm.gov.my/data-catalogue")
          }
        >
          <Text className="text-blue-400">
            https://open.dosm.gov.my/data-catalogue
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex flex-row items-baseline">
        <Text className="text-zinc-400">Last updated: </Text>
        <Text className="text-zinc-400">
          {chartData[chartData.length - 1]?.date}
        </Text>
      </View>
    </View>
  );
};

export default DisplayChart;
