import { useEffect, useState } from 'react';
import {
  Diagnosis,
  EntryWithoutIdAndSpecialist,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry
} from '../../types';
import diagnosesService from '../../services/diagnoses';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';

export default function PatientEntry({ entryData }: { entryData: EntryWithoutIdAndSpecialist }) {
  const { date, description, diagnosisCodes } = entryData;
  const [patientDiagnosisInfo, setPatientDiagnosisInfo] = useState<Diagnosis[]>([]);

  useEffect(() => {
    async function fetchDiagnosisInfo() {
      try {
        if (!diagnosisCodes) return;
        const diagnosisInfo = await diagnosesService.findDiagnosisDataForPatient(diagnosisCodes);
        setPatientDiagnosisInfo(diagnosisInfo);
      } catch (error) {
        console.error('Error fetching diagnosis info:', error);
      }
    }

    fetchDiagnosisInfo();
  }, [diagnosisCodes]);

  return (
    <>
      <Box component="article" sx={{ p: 2, border: '1px solid grey', borderRadius: 1, marginBottom: 4 }}>
        <List>
          <Typography variant="h6" style={{ marginBottom: '0.15em', paddingLeft: 15 }}>
            Details
          </Typography>
          <ListItem>
            <ListItemText primary={date} secondary={description} />
          </ListItem>
          <Typography variant="h6" style={{ marginBottom: '0.15em', paddingLeft: 15 }}>
            Diagnosis
          </Typography>
          <List>
            {patientDiagnosisInfo.map((diagnosis, index) => (
              <ListItem divider={true} key={index}>
                <ListItemText primary={diagnosis.code} secondary={diagnosis.name} />
              </ListItem>
            ))}
          </List>
        </List>
        <List>{renderAddionalEntryInfo(entryData)}</List>
      </Box>
    </>
  );
}

function renderAddionalEntryInfo(entryData: EntryWithoutIdAndSpecialist) {
  switch (entryData.type) {
    case 'Hospital':
      const { discharge } = entryData;
      return <HospitalComponent discharge={discharge} />;
    case 'HealthCheck':
      const { healthCheckRating } = entryData;
      return <HealthCheckComponent healthCheckRating={healthCheckRating} />;
    case 'OccupationalHealthcare':
      const { employerName, sickLeave } = entryData;
      return <OccupationalHealthcareComponent employerName={employerName} sickLeave={sickLeave} />;
    default:
      assertNever(entryData);
  }
}

function assertNever(value: never): never {
  throw new Error(`This type is not expected in entries: ${value}`);
}

// Additional details components

function HospitalComponent({ discharge }: { discharge: HospitalEntry['discharge'] }) {
  return (
    <>
      <ListItem>
        <ListItemIcon>
          <LocalHospitalOutlinedIcon fontSize="large" />
        </ListItemIcon>
        <ListItemText primary="Hospital" />
      </ListItem>
      <Typography paragraph style={{ marginBottom: '0.15em', paddingLeft: 15 }}>
        Discharge
      </Typography>
      <ListItem>
        <ListItemText primary={discharge.date} secondary={`Criteria: ${discharge.criteria}`} />
      </ListItem>
    </>
  );
}

function HealthCheckComponent({ healthCheckRating }: { healthCheckRating: HealthCheckRating }) {
  return (
    <>
      <ListItem>
        <ListItemIcon>
          <FactCheckOutlinedIcon fontSize="large" />
        </ListItemIcon>
        <ListItemText primary="HealthCheck" />
      </ListItem>
      <ListItem>
        <ListItemText primary={healthCheckRating} secondary="HealthCheck Rating" />
      </ListItem>
    </>
  );
}

function OccupationalHealthcareComponent({
  employerName,
  sickLeave
}: {
  employerName: OccupationalHealthcareEntry['employerName'];
  sickLeave: OccupationalHealthcareEntry['sickLeave'];
}) {
  return (
    <>
      <ListItem>
        <ListItemIcon>
          <WorkOutlineOutlinedIcon fontSize="large" />
        </ListItemIcon>
        <ListItemText primary="OccupationalHealthcare" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Employer Name" secondary={employerName} />
      </ListItem>
      {sickLeave && (
        <>
          <Typography paragraph style={{ marginBottom: '0.15em', paddingLeft: 15 }}>
            Sick Leave
          </Typography>
          <ListItem divider={true}>
            <ListItemText primary="Start Date" secondary={sickLeave.startDate} />
          </ListItem>
          <ListItem divider={true}>
            <ListItemText primary="End Date" secondary={sickLeave.endDate} />
          </ListItem>
        </>
      )}
    </>
  );
}
