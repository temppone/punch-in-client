import { IClock } from "../pages/Reports";

export const rootTimeToShort = (time: string) => {
  return Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(new Date(`2000-01-01T${time}`)));
};

export function sumTimeByCreatedAtAtDayWork(
  clocks: IClock[] | undefined,
  day: string
) {
  const clockInSeconds = clocks
    ?.filter((clock) => {
      return (
        day === Intl.DateTimeFormat("pt-BR").format(new Date(clock.createdAt))
      );
    })
    .map((clock) => {
      const splitedClock = clock.clock.split(":");

      const seconds =
        +splitedClock[0] * 60 * 60 + +splitedClock[1] * 60 + +splitedClock[2];

      return seconds;
    });

  console.log({ clockInSeconds });

  const shifts = clockInSeconds?.map((clock, index) => {
    let total = 0;

    if (index % 2 !== 0) {
      console.log(index, clock, clockInSeconds[index - 1]);

      total = total + (clock - clockInSeconds[index - 1]);
    }

    return total;
  });

  console.log({ shifts });

  const initialValue = 0;

  const dayShift =
    shifts?.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue
    ) || 0;

  const result = new Date(dayShift * 1000).toISOString().slice(11, 19);

  return result;
}
