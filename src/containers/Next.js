// @flow
import { useAtom } from 'jotai';
import Next from '../components/Next';
import { nextTimeAtom } from '../stores';

const NextContainer = () => {
  const [nextTime] = useAtom(nextTimeAtom);
  if (nextTime.hour !== -1) {
    return (
      <Next
        exist={true}
        hours={nextTime.hour}
        minutes={nextTime.minute}
        seconds={nextTime.second}
      />
    );
  }
  return <Next exist={false} />;
};

export default NextContainer;
