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
      <h2 className="mb-2 text-xl font-bold">次発バスまでの時間</h2>
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <div className="p-4">
          <div className="flex items-center justify-center font-mono text-4xl font-bold">
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
