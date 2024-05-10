import { BaseEntry } from "../../types";

// I omit these properties because for now, they're not used in this component.
type PatientBaseEntry = Omit<BaseEntry, "id" | "specialist">

export default function PatientEntry({ date, description, diagnosisCodes }: PatientBaseEntry) {
  return (
    <div>
      <p><b>{date}</b>  {description}</p>
      <ul>
        <li>{diagnosisCodes}</li>
      </ul>
    </div>
  )
}
