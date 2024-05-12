import { useEffect, useState } from "react";
import {
  Diagnosis, Entry, HealthCheckEntry, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry
} from "../../types";
import diagnosesService from "../../services/diagnoses";

type PatientBaseEntry = Omit<Entry, "id" | "specialist">;

export default function PatientEntry({ entryData }: { entryData: PatientBaseEntry }) {
  const { date, description, diagnosisCodes } = entryData;
  const [patientDiagnosisInfo, setPatientDiagnosisInfo] = useState<Diagnosis[]>([]);

  useEffect(() => {
    async function fetchDiagnosisInfo() {
      try {
        if (!diagnosisCodes) return;
        const diagnosisInfo = await diagnosesService.fetchDiagnoses(diagnosisCodes);
        setPatientDiagnosisInfo(diagnosisInfo);
      } catch (error) {
        console.error("Error fetching diagnosis info:", error);
      }
    }

    fetchDiagnosisInfo();
  }, [diagnosisCodes]);

  return (
    <ul>
      <p><b>{date}</b> {description}</p>
      <h4>Diagnoses</h4>
      <ul>
        {patientDiagnosisInfo.map((diagnosis, index) => (
          <li key={index}>{diagnosis.code}: {diagnosis.name}</li>
        ))}
      </ul>
      {renderAddionalEntryInfo(entryData)}
    </ul>

  );
}

function renderAddionalEntryInfo(entryData: PatientBaseEntry) {
  switch (entryData.type) {
    case "Hospital":
      const { discharge } = entryData as HospitalEntry
      console.log(discharge)
      return <HospitalComponent discharge={discharge} />
    case "HealthCheck":
      const { healthCheckRating } = entryData as HealthCheckEntry
      return <HealthCheckComponent healthCheckRating={healthCheckRating} />
    case "OccupationalHealthcare":
      const { employerName, sickLeave } = entryData as OccupationalHealthcareEntry
      return <OccupationalHealthcareComponent employerName={employerName} sickLeave={sickLeave} />
    default:
      assertNever(entryData.type as never)
  }
}

function assertNever(value: never): never {
  throw new Error(`This type is not expected in entries: ${value}`)
}

// Additional details components

function HospitalComponent({ discharge }: { discharge: HospitalEntry["discharge"] }) {
  return (
    <>
      <h4>Discharge</h4>
      <ul>
        <li><b>date</b> {discharge.date}</li>
        <li><b>criteria</b> {discharge.criteria}</li>
      </ul>
    </>
  )
}

function HealthCheckComponent({ healthCheckRating }: { healthCheckRating: HealthCheckRating }) {
  return <p>HealthCheck Rating: {healthCheckRating}</p>
}

function OccupationalHealthcareComponent({ employerName, sickLeave }: { employerName: OccupationalHealthcareEntry["employerName"], sickLeave: OccupationalHealthcareEntry["sickLeave"] }) {
  return (
    <ul>
      <li><b>Employer Name: </b>{employerName}</li>
      {sickLeave && (<li><b>Employer Name: </b>{employerName}</li>)}
    </ul>
  )
}
