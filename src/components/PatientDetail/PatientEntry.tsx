import { useEffect, useState } from "react";
import {
  Diagnosis, Entry, HospitalEntry
} from "../../types";
import diagnosesService from "../../services/diagnoses";

type PatientBaseEntry = Omit<Entry, "id" | "specialist">;

function assertNever(value: never): never {
  throw new Error(`This type is not expected in entries: ${value}`)
}

function renderAddionalEntryInfo(entryData: PatientBaseEntry) {
  switch (entryData.type) {
    case "Hospital":
      const { discharge } = entryData as HospitalEntry
      console.log(discharge)
      return <HospitalComponent discharge={discharge} />
    // case "HealthCheck":
    //   return <HealthCheckComponent />
    // case "OccupationalHealthcare":
    //   return <OccupationalHealthcareComponent />
    default:
      assertNever(entryData.type as never)
  }
}


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
    <div>
      <p><b>{date}</b> {description}</p>
      <h4>Diagnoses</h4>
      <ul>
        {patientDiagnosisInfo.map((diagnosis, index) => (
          <li key={index}>{diagnosis.code}: {diagnosis.name}</li>
        ))}
        {renderAddionalEntryInfo(entryData)}
      </ul>
    </div>

  );
}

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
