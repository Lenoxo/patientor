import { SyntheticEvent, useState } from 'react';
import { TextField, Grid, Button, Select, MenuItem, SelectChangeEvent, InputLabel } from '@mui/material';
import { BaseEntryWithoutId, Diagnosis, NewEntry } from '../../types';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  onCancel: () => void;
  onSubmit: (values: NewEntry) => void;
  availableDiagnoses: Diagnosis[];
}

function AddEntryForm({ onCancel, onSubmit, availableDiagnoses }: Props) {
  const [entryType, setEntryType] = useState<string>('HealthCheck');
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [dischargeDate, setDischargeDate] = useState<Dayjs>(dayjs());
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const availableEntryTypes: string[] = ['HealthCheck', 'OccupationalHealthcare', 'Hospital'];

  function handleEntryTypeChange(event: SelectChangeEvent<string>) {
    event.preventDefault();
    if (typeof event.target.value === 'string') {
      const value = event.target.value;
      const isValidValue = availableEntryTypes.some((type) => type === value);

      if (isValidValue) {
        setEntryType(value);
      }
    }
  }

  function handleDiagnosisCodesChange(event: SelectChangeEvent<string[]>) {
    event.preventDefault();
    const value = event.target.value;
    // Here the value really is an Array, but when you apply typeof to an array, it returns 'object'
    typeof value === 'object' && setDiagnosisCodes(value);
  }

  function addEntry(event: SyntheticEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    let newEntry;

    const commonValues: BaseEntryWithoutId = {
      description: form.description.value,
      date: dayjs(date).format('YYYY-MM-DD'),
      specialist: form.specialist.value,
      diagnosisCodes
    };

    switch (entryType) {
      case 'HealthCheck':
        newEntry = {
          ...commonValues,
          type: entryType,
          healthCheckRating: parseInt(form.healthCheckRating.value)
        };
        return onSubmit(newEntry);

      case 'Hospital':
        newEntry = {
          ...commonValues,
          type: entryType,
          discharge: {
            date: dayjs(dischargeDate).format('YYYY-MM-DD'),
            criteria: form.dischargeCriteria.value
          }
        };
        return onSubmit(newEntry);

      case 'OccupationalHealthcare':
        const startDate = form.startDate.value;
        const endDate = form.endDate.value;
        if (startDate && endDate) {
          newEntry = {
            ...commonValues,
            type: entryType,
            employerName: form.employerName.value,
            sickLeave: {
              startDate,
              endDate
            }
          };
          return onSubmit(newEntry);
        } else {
          newEntry = {
            ...commonValues,
            type: entryType,
            employerName: form.employerName.value
          };
          return onSubmit(newEntry);
        }

      default:
        throw new Error(`Invalid entryType: ${entryType}`);
    }
  }

  return (
    <div>
      <form onSubmit={addEntry}>
        <InputLabel style={{ marginTop: 20 }}>Entry Type</InputLabel>
        <Select label="Entry Type" fullWidth required={true} value={entryType} onChange={handleEntryTypeChange}>
          {availableEntryTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        <TextField label="description" id="description" fullWidth required={true} />
        <DatePicker
          slotProps={{ textField: { fullWidth: true, label: 'Date', required: true } }}
          format="MM - DD - YYYY"
          onChange={(newDate) => newDate && setDate(newDate)}
        />
        <TextField label="specialist" id="specialist" fullWidth required={true} />
        <InputLabel style={{ marginTop: 10 }}>Diagnosis Codes (optional)</InputLabel>
        <Select
          id="diagnosisCodes"
          label="Diagnosis Codes (optional)"
          fullWidth
          multiple={true}
          value={diagnosisCodes}
          onChange={handleDiagnosisCodesChange}
        >
          {availableDiagnoses?.map((diagnosis) => {
            return (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.code}
              </MenuItem>
            );
          })}
        </Select>

        {entryType === 'HealthCheck' && (
          <TextField type="number" label="HealthCheck Rating" id="healthCheckRating" fullWidth required={true} />
        )}

        {entryType === 'Hospital' && (
          <>
            <DatePicker
              slotProps={{ textField: { fullWidth: true, label: 'Discharge Date', required: true } }}
              format="MM - DD - YYYY"
              onChange={(newDate) => newDate && setDischargeDate(newDate)}
            />
            <TextField label="discharge criteria" id="dischargeCriteria" fullWidth required={true} />
          </>
        )}

        {entryType === 'OccupationalHealthcare' && (
          <>
            <TextField label="employer name" id="employerName" fullWidth required={true} />
            <InputLabel style={{ marginTop: 10 }}>Sick Leave (opt)</InputLabel>
            <TextField label="start date" id="startDate" fullWidth />
            <TextField label="end date" id="endDate" fullWidth />
          </>
        )}

        <Grid>
          <Grid item marginTop={4}>
            <Button color="secondary" variant="contained" style={{ float: 'left' }} type="button" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button color="primary" variant="contained" style={{ float: 'right' }} type="submit">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
export default AddEntryForm;
