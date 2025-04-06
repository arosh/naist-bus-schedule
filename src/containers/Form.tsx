import { useAtom } from 'jotai';
import Form from '../components/Form';
import { directionAtom, busStopAtom, scheduleTypeAtom } from '../stores';
import { startTransition } from 'react';

const FormContainer = () => {
  const [direction, setDirection] = useAtom(directionAtom);
  const [busStop, setBusStop] = useAtom(busStopAtom);
  const [scheduleType, setScheduleType] = useAtom(scheduleTypeAtom);

  const handleDirectionChange = (newDirection: string) => {
    startTransition(() => {
      setDirection(newDirection);
    });
  };

  const handleBusStopChange = (newBusStop: string) => {
    startTransition(() => {
      setBusStop(newBusStop);
    });
  };

  const handleScheduleTypeChange = (newScheduleType: string) => {
    startTransition(() => {
      setScheduleType(newScheduleType);
    });
  };

  return (
    <Form
      direction={direction}
      busStop={busStop}
      scheduleType={scheduleType}
      onDirectionChange={handleDirectionChange}
      onBusStopChange={handleBusStopChange}
      onScheduleTypeChange={handleScheduleTypeChange}
    />
  );
};

export default FormContainer;
