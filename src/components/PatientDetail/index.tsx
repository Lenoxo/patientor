import { useEffect, useState } from 'react';
import { NewEntry, Patient } from '../../types';
import patientService from '../../services/patients';
import PatientEntry from './PatientEntry';
import AddEntryModal from '../AddEntryModal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MaleOutlined from '@mui/icons-material/MaleOutlined';
import FemaleOutlined from '@mui/icons-material/FemaleOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import axios from 'axios';

export default function PatientDetail() {
  const [patient, setPatient] = useState<Patient>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const currentPath = window.location.pathname;
  // Saves just the string part, after the last /
  const id = currentPath.substring(currentPath.lastIndexOf('/'));

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  useEffect(() => {
    async function getPatientData() {
      const patientData = await patientService.getOne(id);
      if (!patientData) {
        return console.error('PatientData in PatientDetail is undefined');
      }

      setPatient(patientData);
    }

    getPatientData();
  }, [id]);

  async function submitNewEntry(values: NewEntry) {
    try {
      const updatedPatient = await patientService.createEntry(values, id);
      setPatient(updatedPatient);
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === 'string') {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError('Unrecognized axios error');
        }
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
  }

  return (
    <>
      <Typography variant="h5" style={{ marginTop: '0.5em' }}>
        {patient?.name}
      </Typography>
      <List style={{ maxWidth: 340 }}>
        <ListItem>
          <ListItemText primary={patient?.gender} secondary="Gender" />
          <ListItemIcon>
            {patient?.gender === 'female' ? <FemaleOutlined fontSize="large" /> : <MaleOutlined fontSize="large" />}
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemText primary={patient?.occupation} secondary="Occupation" />
          <ListItemIcon>
            <WorkOutlineOutlinedIcon fontSize="large" />
          </ListItemIcon>
        </ListItem>
        <ListItem>
          <ListItemText primary={patient?.ssn} secondary="SSN" />
          <ListItemIcon>
            <BadgeOutlinedIcon fontSize="large" />
          </ListItemIcon>
        </ListItem>
      </List>
      <AddEntryModal modalOpen={modalOpen} onSubmit={submitNewEntry} error={error} onClose={closeModal} />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
      <Typography variant="h5" style={{ marginBottom: '0.5em', marginTop: '0.5em' }}>
        Entries
      </Typography>
      {patient?.entries.map((entry, index) => <PatientEntry key={index} entryData={entry} />)}
    </>
  );
}
