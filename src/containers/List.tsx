import { useAtom } from 'jotai';
import List from '../components/List';
import { timeTableMapAtom } from '../stores';

const ListContainer = () => {
  const [scheduleMap] = useAtom(timeTableMapAtom);
  return <List scheduleMap={scheduleMap} />;
};

export default ListContainer;
