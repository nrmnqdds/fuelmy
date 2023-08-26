import { useState, useEffect } from "react";
import { csv2json } from "csvjson-csv2json";

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
          }));
        setChartData(filteredData);
        // console.log(filteredData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fuelType]);
};

export default DisplayChart;
