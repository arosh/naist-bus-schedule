import Footer from '../components/Footer';
import Share from '../components/Share';
import Form from './Form';
import List from './List';
import Next from './Next';

type Props = {
  pageTitle: string;
};

function App({ pageTitle }: Props) {
  return (
    <div className="mx-auto max-w-xl px-4 text-gray-700">
      <h1 className="mt-4 mb-2 text-center text-2xl">{pageTitle}</h1>
      <Share />
      <Form />
      <Next />
      <List />
      <div className="mt-4 mb-6">
        <Footer />
      </div>
    </div>
  );
}

export default App;
