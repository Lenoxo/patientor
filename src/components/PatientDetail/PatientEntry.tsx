import { Entry } from "../../types";

export default function PatientEntry({ date, description, diagnosisCodes }: Entry) {
  return (
    <div>
      <p><b>{date}</b>  {description}</p>
      <ul>
        <li>{diagnosisCodes}</li>
      </ul>
    </div>
  )
}
