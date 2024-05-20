import { SyntheticEvent, useState } from 'react';
import { TextField, Grid, Button, Select, MenuItem, SelectChangeEvent, InputLabel } from '@mui/material';
import { BaseEntry, HealthCheckEntryValues } from '../../types';

interface Props {
  onCancel: () => void;
  onSubmit: (values: HealthCheckEntryValues) => void;
}

// TODO: allow the user to handle the other two types of entries
function AddEntryForm({ onCancel, onSubmit }: Props) {
  const [entryType, setEntryType] = useState('HealthCheck');

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

  function addEntry(event: SyntheticEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    let newEntry;

    const commonValues: BaseEntry = {
      description: form.description.value,
      date: form.date.value,
      specialist: form.specialist.value,
      diagnosisCodes: [form.diagnosisCodes.value]
    };

    switch (entryType) {
      case 'HealthCheck':
        newEntry = {
          ...commonValues,
          type: entryType,
          healthCheckRating: parseInt(form.healthCheckRating.value)
        };
        break;

      case 'Hospital':
        newEntry = {
          ...commonValues,
          type: entryType,
          discharge: {
            date: form['discharge-date'].value,
            criteria: form['discharge-criteria'].value
          }
        };

        console.log(newEntry);
        break;

      default:
        break;
    }

    onSubmit(newEntry);
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
        <TextField label="date" id="date" fullWidth required={true} />
        <TextField label="specialist" id="specialist" fullWidth required={true} />
        <TextField label="diagnosis Codes" id="diagnosisCodes" fullWidth />
        {entryType === 'HealthCheck' && (
          <TextField label="HealthCheck Rating" id="healthCheckRating" fullWidth required={true} />
        )}

        {entryType === 'Hospital' && (
          <>
            <TextField label="discharge date" id="discharge-date" fullWidth required={true} />
            <TextField label="discharge criteria" id="discharge-criteria" fullWidth required={true} />
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
