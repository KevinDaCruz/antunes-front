import { CONDITION_STYLES } from "../constants/categories";

function ConditionBadge({ condition }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-extrabold text-ink ${CONDITION_STYLES[condition] ?? "bg-white"}`}
    >
      {condition}
    </span>
  );
}

export default ConditionBadge;
