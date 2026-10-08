# WorldForge AI
**Evidence-Grounded 3D World Reconstruction & Completion**

## 1. Problem
Currently, 3D reconstruction tools simply build what they see. When faced with occlusions or unseen regions, they either leave holes or seamlessly hallucinate structures without explaining what is real and what is guessed.

## 2. Solution
WorldForge AI reconstructs what was observed, reasons about what is hidden, generates plausible missing regions under spatial constraints, validates those regions, and explicitly tells the user what is observed, inferred, generated, and uncertain.

## 3. Key Features
- **Video to 3D Pipeline**: Extract frames, estimate camera pose, predict depth, and construct a 3D point cloud.
- **Evidence-Grounded Completion**: Intelligently fills in missing regions while respecting physical constraints.
- **World Confidence Graph**: Detailed provenance for every region of the geometry.
- **Uncertainty Heatmap**: Visualizes the confidence of different parts of the reconstructed scene.
- **Appearance Studio**: Edit materials and colors of the world using natural language.

## 4. Architecture
WorldForge AI consists of a React/Three.js frontend and a Python/FastAPI backend, utilizing Open3D and deep learning models for reconstruction.

## 5. AI Pipeline
1. Frame extraction & keyframe selection
2. Camera movement estimation
3. Depth generation
4. 3D reconstruction
5. Visibility & missing region detection
6. Scene completion & validation

## 6. Novelty
"Don't just reconstruct what you saw. Prove what you know. Infer what you don't. Complete the world."

## 7. World State
The central representation containing cameras, geometry, scene graph, relationships, visibility, and completion states.

## 8. Provenance
Every region explicitly stores its source, confidence, evidence used for generation, and validation checks passed.

## 9. Uncertainty
Visualize the scene colored by confidence, from highly certain observations to lower confidence generations.

## 10. Completion
Generates multiple hypotheses for missing regions, constrained by structural information and neighboring geometry.

## 11. Validation
Automatically checks generated geometry for spatial continuity, room enclosure, and object containment.

## 12. Appearance Editing
Allows users to alter the appearance of reconstructed elements, such as wall colors or furniture materials.

## 13. Blueprint Mode
Extract 3D structure from 2D floor plans. (Planned)

## 14. Installation
\`\`\`bash
git clone https://github.com/kanishka-rn/DevOrbit.git
cd DevOrbit
\`\`\`

## 15. Environment Setup
Requires Node.js for the frontend and Python 3.9+ for the backend.

## 16. Running Backend
\`\`\`bash
cd backend
python -m venv venv
# Activate venv depending on OS
pip install -r requirements.txt
python -m app.main
\`\`\`

## 17. Running Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 18. Demo
A "Demo Room" button skips file upload and runs the pipeline on an included sample video.

## 19. Export
Scenes can be exported in GLB and PLY formats.

## 20. Evaluation
Tracks metrics such as observed coverage, generated coverage, point counts, and processing time.

## 21. Limitations
Hardware constraints on single-pass mesh completion and metric scale without structural priors.

## 22. Future Work
Advanced cross-modal fusion linking blueprints with video directly, and full generative multi-room traversal.

## 23. Hackathon Judging Alignment
Built to address structural geometry inference with explicitly tracked provenance and uncertainty.
