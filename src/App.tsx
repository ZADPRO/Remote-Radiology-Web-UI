import { Toaster } from './components/ui/sonner';
import MainRoutes from './pages/Routes/MainRoutes';

function App() {
  
  return (
    <>
     <MainRoutes/>
     <Toaster closeButton richColors />
    </>
  )
}

export default App
