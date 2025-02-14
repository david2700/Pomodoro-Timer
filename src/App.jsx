import styles from './App.module.css';
import Header from './components/Header/Header';
import Timer from './components/Timer/Timer';
import { ThemeProvider } from "./ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <div className={styles.container}>
        <Header />
        <Timer />
      </div>
    </ThemeProvider>
  );
}

export default App;

