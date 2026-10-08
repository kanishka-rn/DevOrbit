# SpaceMind Architecture Diagrams

## Presentation (Simplified) Architecture

```mermaid
flowchart TD
    A[INPUT] --> B[RECONSTRUCTION]
    B --> C[VISIBILITY]
    C --> D[UNSEEN REGION DETECTION]
    D --> E[STRUCTURAL COMPLETION]
    E --> F[PROVENANCE + CONFIDENCE]
    F --> G[3D SCENE]
    G --> H[EVALUATION]
```

## Complete System Architecture

```mermaid
flowchart TD
    subgraph Input
        A[BLUEPRINT] 
        B[VIDEO]
    end
    
    A --> C[Blueprint Parser]
    B --> D[Frame Extraction]
    
    C --> E[Structural Prior]
    D --> F[Camera Estimation]
    F --> G[Depth Estimation]
    
    E --> H
    G --> H[SCENE ALIGNMENT]
    
    H --> I[VISIBILITY MAPPING]
    I --> J[UNOBSERVED REGION DETECTION]
    J --> K[STRUCTURAL COMPLETION]
    K --> L[PROVENANCE + CONFIDENCE]
    
    L --> M[NAVIGABLE 3D SCENE]
    
    M --> N[EVALUATION]
    M --> O[EXPORT]
```
*(Ground truth appears only on the evaluation branch. It does not enter the reconstruction pipeline.)*
