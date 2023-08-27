import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { csv2json } from "csvjson-csv2json";
import {
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryVoronoiContainer,
} from "victory-native";

const DisplayChart = ({ fuelType }) => {
  const [chartData, setChartData] = useState([{ month: "", price: "" }]);

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
            // label: item[fuelType.toLowerCase()].toFixed(2),
          }));
        setChartData(filteredData);
        // console.log(filteredData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fuelType]);

  return (
    <View className="bg-zinc-800 flex-1 items-center pt-5">
      <Text className="text-white">{fuelType}</Text>
      <VictoryChart
        theme={VictoryTheme.material}
        domain={{ y: [1, 2.5] }}
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
    </View>
  );
};

export default DisplayChart;
