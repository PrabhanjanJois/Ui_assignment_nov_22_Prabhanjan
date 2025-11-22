import React, { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Loader from "./components/common/Loader";

import "./styles/global.css";
import ErrorBoundary from "./components/common/ErrorBoundry";

// Lazy load the Dashboard for better initial load performance
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <div className="app">
          <Suspense fallback={<Loader fullScreen />}>
            <Dashboard />
          </Suspense>
        </div>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
