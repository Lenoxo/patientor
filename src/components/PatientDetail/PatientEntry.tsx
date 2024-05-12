import { useEffect, useState } from "react";
import {
  Diagnosis, Entry
} from "../../types";
import diagnosesService from "../../services/diagnoses";

type PatientBaseEntry = Omit<Entry, "id" | "specialist">;

function assertNever(value: never): never {
  throw new Error(`This type is not expected in entries: ${value}`)
}

export default function PatientEntry({ entryData }: { entryData: PatientBaseEntry }) {
  const { date, description, diagnosisCodes, type } = entryData;
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

  switch (type) {
    case "Hospital":
      return <HospitalComponent />
    case "HealthCheck":
      return <HealthCheckComponent />
    case "OccupationalHealthcare":
      return <OccupationalHealthcareComponent />
    default:
      assertNever(type)

  }

  return (
    <div>
      <p><b>{date}</b> {description}</p>
      <ul>
        {patientDiagnosisInfo.map((diagnosis, index) => (
          <li key={index}>{diagnosis.code}: {diagnosis.name}</li>
        ))}
      </ul>
    </div>
  );
}

// function OccupationalHealthcareComponent({ discharge }) {
//   return (
//     <>
//       <h4>Discharge:</h4>
//       <p>{discharge.date}</p>
//       <p>{discharge.criteria}</p>
//     </>
//   )
// }
