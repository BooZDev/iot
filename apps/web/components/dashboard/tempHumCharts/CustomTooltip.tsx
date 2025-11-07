export default function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: [{ value: number }?, { value: number }?];
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-content1 p-3 rounded-md shadow-md border border-divider">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-primary">
          Temperature: {payload[0]?.value ?? 'N/A'}°C
        </p>
        <p className="text-sm text-secondary">
          Humidity: {payload[1]?.value ?? 'N/A'}%
        </p>
      </div>
    );
  }
  return null;
}