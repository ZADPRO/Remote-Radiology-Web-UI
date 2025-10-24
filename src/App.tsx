import { Label } from "./components/ui/label";
import { Toaster } from "./components/ui/sonner";
import MainRoutes from "./pages/Routes/MainRoutes";
import { useDisableNumberScroll } from "./utlis/useDisableNumberScroll";

function App() {
  useDisableNumberScroll(); // disable number increment when i scoll in input type number
  return (
    <>
      <MainRoutes />
      <Toaster closeButton richColors />

      <Label className="fixed bottom-0 left-1/2 -translate-x-1/2 text-gray-800 opacity-80 text-xs z-50">
        Copyright © Wellthgreen
      </Label>
      <Label className="fixed bottom-0 left-1/2 -translate-x-1/2 text-gray-800 opacity-80 text-xs z-50">
        Enhancement Working
      </Label>
    </>
  );
}

export default App;
