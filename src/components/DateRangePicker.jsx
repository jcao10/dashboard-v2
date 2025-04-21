import React from 'react';
import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

const DateRangePicker = ({ onDateChange }) => {
  const [startDate, setStartDate] = React.useState(new Date('2025-04-01'));
  const [endDate, setEndDate] = React.useState(new Date());

  const handleStartDateChange = (date) => {
    setStartDate(date);
    onDateChange({ startDate: date, endDate });
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDateChange({ startDate, endDate: date });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <DatePicker
          label="Fecha Inicio"
          value={startDate}
          onChange={handleStartDateChange}
          format="dd/MM/yyyy"
          sx={{ mr: 2 }}
        />
        <DatePicker
          label="Fecha Fin"
          value={endDate}
          onChange={handleEndDateChange}
          format="dd/MM/yyyy"
        />
      </LocalizationProvider>
    </Box>
  );
};

export default DateRangePicker; 