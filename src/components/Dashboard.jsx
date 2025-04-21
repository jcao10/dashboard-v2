import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Tabs, Tab, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DateRangePicker from './DateRangePicker';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [viewType, setViewType] = useState('byChannel');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2025-04-01'),
    endDate: new Date()
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const formattedStartDate = dateRange.startDate.toISOString().split('T')[0];
        const formattedEndDate = dateRange.endDate.toISOString().split('T')[0];
        
        const response = await fetch(`/api/query-by-channel?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard de Trading
      </Typography>
      
      <DateRangePicker onDateChange={handleDateChange} />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={viewType} onChange={(e, newValue) => setViewType(newValue)}>
          <Tab label="Vista por Canal" value="byChannel" />
          <Tab label="Vista por Día" value="byDay" />
        </Tabs>
      </Box>

      {viewType === 'byChannel' && data && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Canal</TableCell>
                <TableCell align="right">Volumen</TableCell>
                <TableCell align="right">AUM</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.channel}>
                  <TableCell>{row.channel}</TableCell>
                  <TableCell align="right">{row.volume.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.aum.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {viewType === 'byDay' && data && (
        <Box>
          <Bar
            data={{
              labels: data.map(item => item.date),
              datasets: [
                {
                  label: 'Volumen Diario',
                  data: data.map(item => item.volume),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Volumen Diario'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Volumen'
                  }
                }
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Dashboard; 