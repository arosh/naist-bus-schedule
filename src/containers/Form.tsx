import { useAtom } from 'jotai';
import { startTransition } from 'react';
import Form from '../components/Form';
import {
  directionAtom,
  busStopAtom,
  scheduleTypeAtom,
  type DirectionValue,
  type BusStopValue,
  type ScheduleTypeValue,
} from '../stores';

const FormContainer = () => {
  const [direction, setDirection] = useAtom(directionAtom);
  const [busStop, setBusStop] = useAtom(busStopAtom);
  const [scheduleType, setScheduleType] = useAtom(scheduleTypeAtom);

  const handleDirectionChange = (newDirection: DirectionValue) => {
    startTransition(() => {
      setDirection(newDirection);
    });
  };

  const handleBusStopChange = (newBusStop: BusStopValue) => {
    startTransition(() => {
      setBusStop(newBusStop);
    });
  };

  const handleScheduleTypeChange = (newScheduleType: ScheduleTypeValue) => {
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
