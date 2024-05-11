import { useEffect, useState } from "react";
import { BaseEntry, Diagnosis } from "../../types";
import diagnosesService from "../../services/diagnoses";

type PatientBaseEntry = Omit<BaseEntry, "id" | "specialist">

export default function PatientEntry({ date, description, diagnosisCodes }: PatientBaseEntry) {
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
      <ul>
        {patientDiagnosisInfo.map((diagnosis, index) => (
          <li key={index}>{diagnosis.code}: {diagnosis.name}</li>
        ))}
      </ul>
    </div>
  );
}
