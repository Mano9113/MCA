import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const Chart = ({ data, selectedFeature, setSelectedFeature }) => {
    const [barChartSeries, setBarChartSeries] = useState([]);
    const [barChartCategories, setBarChartCategories] = useState([]);
    const [lineChartSeries, setLineChartSeries] = useState([]);

    // Aggregate Data by Date
    const aggregateDataByDate = (data, selectedFeature) => {
        const aggregatedData = {};

        data.forEach((item) => {
            const date = new Date(item.Date).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            if (!aggregatedData[date]) {
                aggregatedData[date] = { x: date, y: 0, count: 0 };
            }
            aggregatedData[date].y += item[selectedFeature] || 0;
            aggregatedData[date].count += 1;
        });
        

        // Average the feature values for duplicate dates
        return Object.values(aggregatedData).map(({ x, y, count }) => ({
            x,
            y: y / count,
        }));
    };

    // Prepare Bar Chart Data
    useEffect(() => {
        if (data.length > 0) {
            const categories = ["KANNADA", "ENGLISH", "PHYSICS", "CHEMISTRY", "MATHEMATICS", "BIOLOGY"];
            const totals = categories.map((category) =>
                data.reduce((sum, item) => sum + (item[category] || 0), 0)
            );

            setBarChartCategories(categories);
            setBarChartSeries([{ name: "Total", data: totals }]);
        }
    }, [data]);

    // Prepare Line Chart Data for Selected Feature
    useEffect(() => {
        if (data.length > 0 && selectedFeature) {
            const aggregatedData = aggregateDataByDate(data, selectedFeature);

            setLineChartSeries([
                {
                    name: selectedFeature,
                    data: aggregatedData,
                },
            ]);
        }
    }, [data, selectedFeature]);

    // Handle Bar Click
    const handleBarClick = (event, chartContext, config) => {
        const feature = barChartCategories[config.dataPointIndex];
        setSelectedFeature(feature); // Update selected feature
    };

    return (
        <div className="container mt-5">
            {/* Bar Chart */}
            <div className="row mb-4">
                <div className="col-12 d-flex justify-content-center">
                    <ReactApexChart
                        type="bar"
                        series={barChartSeries}
                        options={{
                            chart: {
                                type: "bar",
                                events: {
                                    dataPointSelection: handleBarClick,
                                },
                                toolbar: { show: true },
                            },
                            plotOptions: { bar: { horizontal: true } },
                            xaxis: { categories: barChartCategories },
                            dataLabels: { enabled: false },
                        }}
                        height={400}
                        width="200%"
                    />
                </div>
            </div>

            {/* Line Chart */}
            {selectedFeature && lineChartSeries.length > 0 && (
                <div className="row">
                    <div className="col-12 text-center">
                        <h5>Line Chart for {selectedFeature}</h5>
                    </div>
                    <div className="col-12">
                        <ReactApexChart
                            type="line"
                            series={lineChartSeries}
                            options={{
                                chart: { type: "line", toolbar: { show: true } },
                                xaxis: {
                                    type: "category", // Interpret x-axis values as dates
                                    title: { text: "Date" },
                                },
                                yaxis: {
                                    title: { text: selectedFeature },
                                },
                                tooltip: {
                                    x: { format: "yyyy-MM-dd" }, // Format the date in tooltips
                                },
                                dataLabels: { enabled: true },
                            }}
                            height={500}
                            width="100%"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chart;
