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
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

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
      </Box>
    </>
  );
}

// {/* <ul> */}
// {/*   <p> */}
// {/*     <b>{date}</b> {description} */}
// {/*   </p> */}
// {/*   <h4>Diagnoses</h4> */}
// {/*   <ul> */}
// {/*     {patientDiagnosisInfo.map((diagnosis, index) => ( */}
// {/*       <li key={index}> */}
// {/*         {diagnosis.code}: {diagnosis.name} */}
// {/*       </li> */}
// {/*     ))} */}
// {/*   </ul> */}
// {/*   {renderAddionalEntryInfo(entryData)} */}
// {/* </ul> */}

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
      <h4>Discharge</h4>
      <ul>
        <li>
          <b>date</b> {discharge.date}
        </li>
        <li>
          <b>criteria</b> {discharge.criteria}
        </li>
      </ul>
    </>
  );
}

function HealthCheckComponent({ healthCheckRating }: { healthCheckRating: HealthCheckRating }) {
  return <p>HealthCheck Rating: {healthCheckRating}</p>;
}

function OccupationalHealthcareComponent({
  employerName,
  sickLeave
}: {
  employerName: OccupationalHealthcareEntry['employerName'];
  sickLeave: OccupationalHealthcareEntry['sickLeave'];
}) {
  return (
    <ul>
      <li>
        <b>Employer Name: </b>
        {employerName}
      </li>
      {sickLeave && (
        <ul>
          <h4>Sick Leave</h4>
          <li>
            <b>start date: </b>
            {sickLeave.startDate}
          </li>
          <li>
            <b>end date: </b>
            {sickLeave.endDate}
          </li>
        </ul>
      )}
    </ul>
  );
}
