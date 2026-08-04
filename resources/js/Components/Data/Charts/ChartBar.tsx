import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface ChartBarProps {
    data: any[];
    xKey: string;
    series: {
        key: string;
        color: string;
        name: string;
    }[];
    height?: number;
    className?: string;
    layout?: "vertical" | "horizontal";
}

export default function ChartBar({
    data,
    xKey,
    series,
    height = 300,
    className = "",
    layout = "horizontal",
}: ChartBarProps) {
    return (
        <div className={`w-full pr-8 rounded-2xl ${className}`}>
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={data} layout={layout}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={layout === "horizontal"}
                        vertical={layout === "vertical"}
                        stroke="#e2e8f0"
                    />
                    {layout === "horizontal" ? (
                        <>
                            <XAxis
                                dataKey={xKey}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#64748b", fontSize: 12 }}
                            />
                        </>
                    ) : (
                        <>
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#64748b", fontSize: 12 }}
                            />
                            <YAxis
                                type="category"
                                dataKey={xKey}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                width={100}
                            />
                        </>
                    )}
                    <Tooltip
                        cursor={{ fill: "#f1f5f9" }}
                        contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    {series.map((item, index) => (
                        <Bar
                            key={index}
                            dataKey={item.key}
                            fill={item.color}
                            name={item.name}
                            radius={
                                layout === "horizontal"
                                    ? [4, 4, 0, 0]
                                    : [0, 4, 4, 0]
                            }
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
