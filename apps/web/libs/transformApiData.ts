interface ApiDataItem {
  timestamp: string;
  avgTemp: number;
  avgHum: number;
}

interface TransformedDataItem {
  time: string;
  temp: number;
  hum: number;
}

export function transformApiData(
  apiData: ApiDataItem[]
): TransformedDataItem[] {
  const now = new Date();

  // Map dữ liệu theo yyyy-mm-dd-hh (local time)
  const dataMap: Record<string, { temp: number; hum: number }> = {};

  apiData.forEach((item) => {
    const d = new Date(new Date(item.timestamp).getTime() - 7 * 60 * 60 * 1000);

    // Convert UTC → local (JS tự làm)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
    dataMap[key] = {
      temp: Number(item.avgTemp.toFixed(2)),
      hum: Number(item.avgHum.toFixed(2)),
    };
  });

  const result: TransformedDataItem[] = [];

  // 24 giờ gần nhất
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(now.getHours() - i, 0, 0, 0);

    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
    const hour = String(d.getHours()).padStart(2, "0");

    result.push({
      time: `${hour}:00`,
      temp: dataMap[key]?.temp ?? 0,
      hum: dataMap[key]?.hum ?? 0,
    });
  }

  return result;
}
