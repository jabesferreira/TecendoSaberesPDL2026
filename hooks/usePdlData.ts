import { useEffect, useState } from 'react';

const usePdlData = (data) => {
    const [processedData, setProcessedData] = useState([]);
    const [kpi, setKpi] = useState(null);

    useEffect(() => {
        if(data) {
            // Process data and calculate KPIs
            const newData = data.map(item => ({
                ...item,
                calculatedValue: item.value * someFactor // Replace with actual calculation
            }));
            setProcessedData(newData);

            // Example KPI calculation
            const totalValue = newData.reduce((acc, item) => acc + item.calculatedValue, 0);
            setKpi(totalValue);
        }
    }, [data]);

    return { processedData, kpi };
};

export default usePdlData;