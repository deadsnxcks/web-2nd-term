import './CSS/app.css';
import buildings from './data.jsx';
import Table from './components/Table.jsx';

function App() {
  return (
    <div className='App'>
        <h3>Самые высокие здания и сооружения</h3>
        <Table 
          data={buildings} 
          amountRows={10} 
          pagination={true}
        />   
    </div>
  );
}

export default App;