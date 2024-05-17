import axios from 'axios';
import { Diagnosis } from '../types';
import { apiBaseUrl } from '../constants';

async function getAllDiagnoses() {
  const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);

  return data;
}

async function fetchDiagnoses(diagnosisCodes: string[]): Promise<Diagnosis[]> {
  const data = await getAllDiagnoses();
  if (!data) {
    throw new Error('Unable to fetch diagnoses data');
  }
  return diagnosisCodes.map((code) => data.find((diagnosis) => diagnosis.code === code)!);
}

export default { fetchDiagnoses };
