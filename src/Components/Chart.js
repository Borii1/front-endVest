import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart elements
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlyFundingChart = ({ userId, companyId }) => {
  const currentYear = new Date().getFullYear();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(currentYear);

  // Years for the dropdown from current year to 4 years back
  const availableYears = Array.from({ length: 5 }, (val, index) => currentYear - index);

  // Function to convert "YYYY-MM" to month name
  const getMonthName = (monthString) => {
    const date = new Date(monthString + '-01'); // Add a day to create a valid date
    return date.toLocaleString('default', { month: 'long' }); // Get the full month name
  };

  useEffect(() => {
    const fetchMonthlyFunding = async () => {
      try {
        let url = '';
        if (userId) {
          url = `${process.env.REACT_APP_API_URL}/funding-rounds/monthly-funding/${userId}?year=${year}`;
        } else if (companyId) {
          url = `${process.env.REACT_APP_API_URL}/funding-rounds/company-monthly-funding/${companyId}?year=${year}`;
        } else {
          const storedUserId = localStorage.getItem('userId');
          if (storedUserId) {
            url = `${process.env.REACT_APP_API_URL}/funding-rounds/monthly-funding/${storedUserId}?year=${year}`;
          } else {
            throw new Error('User ID or Company ID must be provided');
          }
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = response.data;
        const labels = data.map(item => getMonthName(item.month)); // Convert to month names
        const totals = data.map(item => item.total);

        setChartData({
          labels,
          datasets: [
            {
              label: `Monthly Funding for ${year}`,
              data: totals,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 1,
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching monthly funding data:', error);
        setLoading(false);
      }
    };

    fetchMonthlyFunding();
  }, [userId, companyId, year]);

  const handleYearChange = (event) => {
    setYear(Number(event.target.value)); // Ensure the selected year is a number
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div>
        <label htmlFor="yearSelect">Select Year: </label>
        <select id="yearSelect" value={year} onChange={handleYearChange}>
          {availableYears.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 3.5,
          scales: {
            y: {
              title: {
                display: true,
                text: 'Funding Amount',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default MonthlyFundingChart;
