import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import ErrorBoundary from './components/common/ErrorBoundary';
import ErrorPage from './pages/statusPage/errorPage';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
