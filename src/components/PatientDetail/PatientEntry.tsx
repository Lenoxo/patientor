import { useEffect, useState } from "react";
import { BaseEntry, Diagnosis } from "../../types";
import diagnosesService from "../../services/diagnoses";

// I omit these properties because for now, they're not used in this component.
type PatientBaseEntry = Omit<BaseEntry, "id" | "specialist">

export default function PatientEntry({ date, description, diagnosisCodes }: PatientBaseEntry) {
  const [patientDiagnosisInfo, setPatientDiagnosisInfo] = useState<Diagnosis[]>([])

  function filterPatientDiagnosisInfo(listOfDiagnosis: Diagnosis[], patientDiagnosisCode: Diagnosis["code"]) {
    const filteredDiagnosis = listOfDiagnosis.find((diagnosis) => {
      return diagnosis.code === patientDiagnosisCode
    })
    return filteredDiagnosis as Diagnosis
  }

  useEffect(() => {
    async function getDiagnosesInfo() {
      const data = await diagnosesService.getAllDiagnoses()
      if (!data) {
        return console.error("diagnoses in PatientEntry is undefined");
      }

      if (!diagnosisCodes) {
        return;
      }

      // This is a n sqrt operation, that's the reason why I left the validation of diagnosisCodes above.
      let updatedDiagnoses = [];

      for (let i = 0; i < diagnosisCodes.length; i++) {
        const diagnosesWithDescription = filterPatientDiagnosisInfo(data, diagnosisCodes[i])
        updatedDiagnoses.push(diagnosesWithDescription)
      }

      setPatientDiagnosisInfo(updatedDiagnoses)
    }

    getDiagnosesInfo()

  }, [])

  return (
    <div>
      <p><b>{date}</b>  {description}</p>
      <ul>
        {patientDiagnosisInfo?.map((codeInfo, index) => <li key={index}>{codeInfo.code}: {codeInfo.name}</li>)}
      </ul>
    </div>
  )
}
