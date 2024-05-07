import { useEffect, useState } from "react";
import { Patient } from "../../types";
import patientService from "../../services/patients";

export default function PatientDetail() {
  const [patient, setPatient] = useState<Patient>();
  const currentPath = window.location.pathname;
  // Saves just the string part, after the last /
  const id = currentPath.substring(currentPath.lastIndexOf("/"));

  useEffect(() => {
    async function getPatientData() {
      const patientData = await patientService.getOne(id);
      if (!patientData) {
        return console.error("PatientData in PatientDetail is undefined");
      }

      setPatient(patientData);
    }

    getPatientData();
  }, [id]);

  return (
    <>
      <h3>{patient?.name}</h3>
      <p>{patient?.gender}</p>
      <p>{patient?.occupation}</p>
      <p>{patient?.ssn}</p>
    </>
  );
}
