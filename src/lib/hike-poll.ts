// Lambda Function URL backing the poll (see lambda/hike-poll).
export const HIKE_POLL_ENDPOINT = "https://w2gbvkh745kix7msskcmtxnsmu0rwcdn.lambda-url.us-west-2.on.aws/";

export type HikeVote = {
  name: string;
  dates: string[];
  updated: string;
};

export type HikeOption = {
  date: string;
  label: string;
};

const pad = (value: number) => String(value).padStart(2, "0");

export const weekendOptions = (
  year: number,
  month: number,
  fromDay = 1,
  toDay = new Date(year, month, 0).getDate()
): HikeOption[] => {
  const options: HikeOption[] = [];
  for (let day = fromDay; day <= toDay; day += 1) {
    const weekday = new Date(year, month - 1, day).getDay();
    if (weekday !== 0 && weekday !== 6) continue;
    options.push({
      date: `${year}-${pad(month)}-${pad(day)}`,
      label: `${weekday === 6 ? "Sat" : "Sun"} ${month}/${day}`
    });
  }
  return options;
};

export const HIKE_OPTIONS = [...weekendOptions(2026, 10, 3), ...weekendOptions(2026, 11, 1, 1)];

const parseVotes = async (response: Response): Promise<HikeVote[]> => {
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  const data = await response.json();
  if (!data.ok) throw new Error(data.error ?? "Request failed");
  return data.votes as HikeVote[];
};

export const fetchVotes = async () => parseVotes(await fetch(HIKE_POLL_ENDPOINT));

export const submitVote = async (name: string, dates: string[]) =>
  parseVotes(
    await fetch(HIKE_POLL_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, dates })
    })
  );

export const sameName = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase();
