import logo from './logo.svg';
import './App.css';
import Matrix from './matrix';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1EER5hZ5i7_gzwabMux9DUoJvwWzGGpxb0A&usqp=CAU"
          className="App-logo"
          alt="logo"
          style={{ borderRadius: '50%' }}
        />
      </header>
      <Matrix />
    </div>
  );
}

export default App;
