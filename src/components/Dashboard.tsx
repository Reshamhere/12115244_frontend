import React, { useEffect, useState } from 'react';
import { fetchHotelData } from '../dataService';
import Chart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, format } from 'date-fns';

const Dashboard: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);


    useEffect(() => {
        const getData = async () => {
            const hotelData = await fetchHotelData();
            setData(hotelData);
        };
        getData();
    }, []);

    const filterDataByDate = () => {
        if (!dateRange[0] || !dateRange[1]) return data;
        
        const startDate = dateRange[0].getTime();
        const endDate = dateRange[1].getTime();

        return data.filter(entry => {
            const entryDate = new Date(
                `${entry.arrival_date_year}-${entry.arrival_date_month}-${entry.arrival_date_day_of_month}`
            ).getTime();
            return entryDate >= startDate && entryDate <= endDate;
        });
    };

    const filteredData = filterDataByDate();

    // Time Series Data
    const timeSeriesData = filteredData.map(entry => ({
        x: new Date(`${entry.arrival_date_year}-${entry.arrival_date_month}-${entry.arrival_date_day_of_month}`),
        y: parseInt(entry.adults) + parseInt(entry.children) + parseInt(entry.babies),
    }));

    // Column Chart Data
    const visitorsByCountry = filteredData.reduce((acc: Record<string, number>, entry) => {
        acc[entry.country] = (acc[entry.country] || 0) + parseInt(entry.adults) + parseInt(entry.children) + parseInt(entry.babies);
        return acc;
    }, {});

    const columnChartData = Object.entries(visitorsByCountry).map(([country, count]) => ({ x: country, y: count }));

    // Sparkline Data
    const adultsCount = filteredData.map(entry => parseInt(entry.adults));
    const childrenCount = filteredData.map(entry => parseInt(entry.children));

    return (
        <div>
            <DatePicker
                selected={dateRange[0] || undefined}
                onChange={(dates) => {
                    const [start, end] = dates;
                    setDateRange([start ?? undefined, end ?? undefined]);
                }}
                startDate={dateRange[0] || undefined}
                endDate={dateRange[1] || undefined}
                selectsRange
                inline
            />


            {/* Time Series Chart */}
            <Chart
                options={{
                    xaxis: {
                        type: 'datetime',
                    },
                }}
                series={[{ name: 'Visitors', data: timeSeriesData }]}
                type="line"
            />

            {/* Column Chart */}
            <Chart
                options={{
                    xaxis: {
                        categories: Object.keys(visitorsByCountry),
                    },
                    title: {
                        text: 'Number of Visitors by Country',
                    },
                }}
                series={[{ name: 'Visitors', data: columnChartData }]}
                type="bar"
            />

            {/* Sparkline Charts */}
            <div>
                <h3>Total Adult Visitors</h3>
                <Chart
                    options={{}}
                    series={[{ name: 'Adults', data: adultsCount }]}
                    type="line"
                    height={50}
                />
                
                <h3>Total Children Visitors</h3>
                <Chart
                    options={{}}
                    series={[{ name: 'Children', data: childrenCount }]}
                    type="line"
                    height={50}
                />
            </div>
        </div>
    );
};

export default Dashboard;
