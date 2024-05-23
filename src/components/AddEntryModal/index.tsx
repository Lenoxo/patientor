import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';
import diagnosesService from '../../services/diagnoses';
import AddEntryForm from './AddEntryForm';
import { Diagnosis, NewEntry } from '../../types';
import { useEffect, useState } from 'react';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewEntry) => void;
  error?: string;
}

function AddEntryModal({ modalOpen, onClose, onSubmit, error }: Props) {
  const [diagnosesInfo, setDiagnosesInfo] = useState<Diagnosis[]>([]);
  useEffect(() => {
    async function getDiagnoses() {
      const response = await diagnosesService.getAllDiagnoses();
      setDiagnosesInfo(response);
    }

    getDiagnoses();
  }, []);
  return (
    <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
      <DialogTitle>Add a new entry</DialogTitle>
      <Divider />
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <AddEntryForm onSubmit={onSubmit} onCancel={onClose} availableDiagnoses={diagnosesInfo} />
      </DialogContent>
    </Dialog>
  );
}

export default AddEntryModal;
