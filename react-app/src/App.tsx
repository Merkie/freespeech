import { useState } from 'react';
import reactLogo from './assets/react.svg';
import { ProjectProvider, useProject } from './contexts/ProjectContext';

function App() {
  const [count, setCount] = useState(0);

  const { project, loading } = useProject();

  if (loading) {
    return (
      <main className="grid h-screen w-screen place-items-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (project)
    return (
      <main className="grid h-screen w-screen place-items-center">
        <section className="flex flex-col items-center">
          <p className="mb-4 text-3xl">
            {count} (project {project.name})
          </p>
          <button onClick={() => setCount((count) => count + 1)}>
            <img className="h-[100pz] w-[100px]" src={reactLogo} alt="react logo" />
          </button>
          <div className="mt-8 flex items-center rounded-lg border border-neutral-200 px-2 text-neutral-600">
            <i className="bi bi-info"></i>
            <span className="text-sm">Click the React logo to increment the count.</span>
          </div>
        </section>
      </main>
    );
}
function AppWithProviders() {
  return (
    <ProjectProvider>
      <App />
    </ProjectProvider>
  );
}

export default AppWithProviders;
