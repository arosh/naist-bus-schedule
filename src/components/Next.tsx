import type { UpcomingBus } from '../services/TimeDiffService';

const pad = (value: number): string => value.toString().padStart(2, '0');

type Props = {
  buses: UpcomingBus[];
};

type UrgencyStyle = {
  cardClass: string;
  rankClass: string;
  badgeClass: string;
  label: string | null;
};

const getUrgencyStyle = (remainingFromEnd: number): UrgencyStyle => {
  if (remainingFromEnd === 1) {
    return {
      cardClass: 'border-red-500 bg-red-50 text-red-950',
      rankClass: 'bg-red-600 text-white',
      badgeClass: 'bg-red-600 text-white',
      label: 'FINAL',
    };
  }
  if (remainingFromEnd === 2) {
    return {
      cardClass: 'border-orange-500 bg-orange-50 text-orange-950',
      rankClass: 'bg-orange-500 text-white',
      badgeClass: 'bg-orange-500 text-white',
      label: '2nd Last',
    };
  }
  if (remainingFromEnd === 3) {
    return {
      cardClass: 'border-yellow-500 bg-yellow-50 text-yellow-950',
      rankClass: 'bg-yellow-500 text-gray-900',
      badgeClass: 'bg-yellow-500 text-gray-900',
      label: '3rd Last',
    };
  }
  return {
    cardClass: 'border-green-500 bg-green-50 text-green-950',
    rankClass: 'bg-green-600 text-white',
    badgeClass: '',
    label: null,
  };
};

const Next = ({ buses }: Props) => {
  if (buses.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="mb-2 text-xl font-bold">次発バスまでの時間</h2>
      <div className="space-y-2.5">
        {buses.map((bus, idx) => {
          const rank = idx + 1;
          const style = getUrgencyStyle(bus.remainingFromEnd);

          return (
            <div
              key={`${rank}-${bus.departureTime}`}
              className={`flex items-center justify-between rounded border-l-4 px-4 py-3 shadow-sm transition-colors ${style.cardClass}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${style.rankClass}`}
                >
                  {rank}
                </span>
                <span className="font-mono text-xl font-bold">
                  {bus.departureTime}
                </span>
                {style.label && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold tracking-wide uppercase ${style.badgeClass}`}
                  >
                    {style.label}
                  </span>
                )}
              </div>

              <div
                className={`font-mono font-bold ${
                  rank === 1 ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                }`}
              >
                {pad(bus.hour)}
                <span className="mx-1">:</span>
                {pad(bus.minute)}
                <span className="mx-1">:</span>
                {pad(bus.second)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Next;
