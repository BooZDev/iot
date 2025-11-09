import { IoAnalyticsOutline } from "react-icons/io5";
import clsx from "clsx";

export default function CustomLegend({
  payload,
}: {
  payload: [{ dataKey: string; value: string }];
}) {
  // payload is an array of items: { value, type, color, payload }
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {payload
        .sort((a, b) => (a.value > b.value ? -1 : a.value < b.value ? 1 : 0))
        .map((entry) => {
          const key = entry.dataKey ?? entry.value;
          return (
            <div key={key} className={clsx("flex items-center gap-1 justify-center",
              entry.value == "temp" ? "text-green-600" : "text-blue-500"
            )}>
              <IoAnalyticsOutline size={24} />
              <span>{entry.value == "temp" ? "Nhiệt độ" : "Độ ẩm"}</span>
            </div>
          );
        })}
    </div>
  );
}
