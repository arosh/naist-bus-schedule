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
            <div className="bg-gray-100 rounded-lg p-3 shadow-inner">
              {pad(hours)}
            </div>
            <span className="mx-2">:</span>
            <div className="bg-gray-100 rounded-lg p-3 shadow-inner">
              {pad(minutes)}
            </div>
            <span className="mx-2">:</span>
            <div className="bg-gray-100 rounded-lg p-3 shadow-inner">
              {pad(seconds)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Next;
