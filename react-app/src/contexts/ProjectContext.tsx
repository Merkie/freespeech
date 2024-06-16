'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

const ProjectContext = createContext<{
  project: Project | null;
  loading: boolean;
}>({
  project: null,
  loading: false
});

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchDefaultProject() {
    setLoading(true);

    const response = await fetch('/boards/project-core.obf');
    const data = await response.json();
    setProject(data);

    setLoading(false);
  }

  useEffect(() => {
    fetchDefaultProject();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        project,
        loading
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);

  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }

  return context;
};
