import { useEffect, useState } from 'react';
import { HealthCheckEntryValues, Patient } from '../../types';
import patientService from '../../services/patients';
import PatientEntry from './PatientEntry';
import AddEntryModal from '../AddEntryModal';
import { Button } from '@mui/material';
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

  async function submitNewEntry(values: HealthCheckEntryValues) {
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
      <h3>{patient?.name}</h3>
      <p>{patient?.gender}</p>
      <p>{patient?.occupation}</p>
      <p>{patient?.ssn}</p>
      <AddEntryModal modalOpen={modalOpen} onSubmit={submitNewEntry} error={error} onClose={closeModal} />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
      <h3>entries</h3>
      {patient?.entries.map((entry, index) => <PatientEntry key={index} entryData={entry} />)}
    </>
  );
}
