import { SyntheticEvent } from 'react';
import { TextField, InputLabel, MenuItem, Select, Grid, Button, SelectChangeEvent } from '@mui/material';
import { HealthCheckEntryValues } from '../../types';

interface Props {
  onCancel: () => void;
  onSubmit: (values: HealthCheckEntryValues) => void;
}

function AddEntryForm({ onCancel, onSubmit }: Props) {
  function addEntry(event: SyntheticEvent) {
    event.preventDefault();
    onSubmit({} as HealthCheckEntryValues); // Object with new entry data, this assertion will be removed in later phases
  }

  return (
    <div>
      <form onSubmit={addEntry}>
        <TextField label="description" fullWidth />
        <TextField label="date" fullWidth />
        <TextField label="specialist" fullWidth />
        <TextField label="diagnosis Codes" fullWidth />
        <TextField label="type" fullWidth />
        <TextField label="HealthCheck Rating" fullWidth />
      </form>
    </div>
  );
}
export default AddEntryForm;
