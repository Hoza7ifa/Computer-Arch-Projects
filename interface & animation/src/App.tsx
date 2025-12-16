import { CPUProvider } from './context/CPUContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import MainView from './components/MainView.tsx';

function App() {
  return (
    <ThemeProvider>
      <CPUProvider>
        <Layout>
          <MainView />
        </Layout>
      </CPUProvider>
    </ThemeProvider>
  );
}

export default App;
