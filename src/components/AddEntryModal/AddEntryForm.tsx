import { SyntheticEvent } from 'react';
import { TextField, InputLabel, MenuItem, Select, Grid, Button, SelectChangeEvent } from '@mui/material';
import { HealthCheckEntryValues } from '../../types';

interface Props {
  onCancel: () => void;
  onSubmit: (values: HealthCheckEntryValues) => void;
}

// TODO: allow the user to handle the other two types of entries
function AddEntryForm({ onCancel, onSubmit }: Props) {
  function addEntry(event: SyntheticEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const newEntry: HealthCheckEntryValues = {
      description: form.description.value,
      date: form.date.value,
      specialist: form.specialist.value,
      diagnosisCodes: form.diagnosisCodes.value,
      healthCheckRating: form.healthCheckRating.value
    };

    onSubmit(newEntry); // Object with new entry data, this assertion will be removed in later phases
  }

  return (
    <div>
      <form onSubmit={addEntry}>
        <TextField label="description" id="description" fullWidth required={true} />
        <TextField label="date" id="date" fullWidth required={true} />
        <TextField label="specialist" id="specialist" fullWidth required={true} />
        <TextField label="diagnosis Codes" id="diagnosisCodes" fullWidth />
        <TextField label="HealthCheck Rating" id="healthCheckRating" fullWidth required={true} />
        <Grid>
          <Grid item marginTop={4}>
            <Button color="secondary" variant="contained" style={{ float: 'left' }} type="button" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button color="primary" variant="contained" style={{ float: 'right' }} type="submit" onClick={onCancel}>
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
export default AddEntryForm;
