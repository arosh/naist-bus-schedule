const pad = (value: number): string => value.toString().padStart(2, '0');

type Props = {
  exist: boolean;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

const Next = ({ exist, hours = 0, minutes = 0, seconds = 0 }: Props) => {
  if (!exist) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">次発バスまでの時間</h2>
      <div className="rounded-lg border border-gray-300 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-center items-center text-4xl font-mono font-bold">
            {pad(hours)}
            <span className="mx-2">:</span>
            {pad(minutes)}
            <span className="mx-2">:</span>
            {pad(seconds)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Next;
