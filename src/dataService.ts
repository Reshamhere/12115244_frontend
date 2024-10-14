import Papa from 'papaparse';

export const fetchHotelData = async () => {
    const response = await fetch('/hotel_bookings_1000.csv');
    const text = await response.text();
    const parsedData = Papa.parse(text, { header: true });
    return parsedData.data;
};
