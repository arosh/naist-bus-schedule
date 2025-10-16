import Footer from '../components/Footer';
import Share from '../components/Share';
import Form from './Form';
import List from './List';
import Next from './Next';

function App() {
  return (
  <div className="max-w-xl mx-auto px-4 text-gray-700">
    <h1 className="text-center text-2xl mt-4 mb-2">{document.title}</h1>
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
