// @flow
import { useAtom } from 'jotai';
import Form from '../components/Form';
import { directionAtom, busStopAtom, scheduleTypeAtom } from '../stores';
import { startTransition } from 'react';

const FormContainer = () => {
  const [direction, setDirection] = useAtom(directionAtom);
  const [busStop, setBusStop] = useAtom(busStopAtom);
  const [scheduleType, setScheduleType] = useAtom(scheduleTypeAtom);

  const handleDirectionChange = (newDirection) => {
    startTransition(() => {
      setDirection(newDirection);
    });
  };

  const handleBusStopChange = (newBusStop) => {
    startTransition(() => {
      setBusStop(newBusStop);
    });
  };

  const handleScheduleTypeChange = (newScheduleType) => {
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
