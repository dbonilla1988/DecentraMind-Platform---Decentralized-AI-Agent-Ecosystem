import React, { createContext, useContext } from 'react';
import { projectMetadata } from '../config/project-metadata';
import { projectStructure } from '../config/project-structure';

interface ProjectContextType {
    metadata: typeof projectMetadata;
    structure: typeof projectStructure;
}

const ProjectContext = createContext<ProjectContextType>({
    metadata: projectMetadata,
    structure: projectStructure
});

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ProjectContext.Provider value={{
            metadata: projectMetadata,
            structure: projectStructure
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => useContext(ProjectContext); 