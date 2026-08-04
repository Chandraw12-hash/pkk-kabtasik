import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface ChartLineProps {
    data: any[];
    xKey: string;
    series: {
        key: string;
        color: string;
        name: string;
    }[];
    height?: number;
    className?: string;
}

export default function ChartLine({
    data,
    xKey,
    series,
    height = 300,
    className = "",
}: ChartLineProps) {
    return (
        <div className={`w-full pr-8 rounded-2xl ${className}`}>
            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={data}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                    />
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
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    {series.map((item, index) => (
                        <Line
                            key={index}
                            type="monotone"
                            dataKey={item.key}
                            stroke={item.color}
                            name={item.name}
                            strokeWidth={3}
                            dot={{
                                r: 4,
                                fill: "#fff",
                                strokeWidth: 2,
                                stroke: item.color,
                            }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
