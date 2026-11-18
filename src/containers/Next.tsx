import { useAtom } from 'jotai';
import Next from '../components/Next';
import { nextBusesAtom } from '../stores';

const NextContainer = () => {
  const [nextBuses] = useAtom(nextBusesAtom);
  return <Next buses={nextBuses} />;
};

export default NextContainer;
