# Screenshot Checklist

The following screenshots are required for the final presentation. Please capture these manually from the frozen local build (`npm run dev`). Do NOT fabricate these.

- [ ] **1. Home / upload screen**: Capture the dark UI showing "Mode A: Blueprint" and "Mode B: Room Video" dropzones.
- [ ] **2. Video input**: Capture the active upload state or demo loading state.
- [ ] **3. Reconstructed scene**: Workspace showing ONLY the observed geometry (click "RECONSTRUCTION" in top bar).
- [ ] **4. Unseen region**: Workspace showing the dark/ghosted coverage highlighting missing geometry (click "UNSEEN REGIONS").
- [ ] **5. Complete world**: Workspace showing the fully completed structure with filled yellow/orange inferred sections.
- [ ] **6. Generated region selected**: 3D viewer showing an orange (Generated) wall glowing explicitly with a blue highlight overlay.
- [ ] **7. Provenance panel**: The right sidebar displaying "SOURCE: GENERATED", "CONFIDENCE: 54%", and "Prediction-time estimate" for the selected wall.
- [ ] **8. Benchmark page**: The `/evaluation` route dashboard showing "RUN ALL SCENARIOS" and the method comparison tables.
- [ ] **9. Ground Truth / Prediction / Difference**: The workspace ViewMode toggle set to "DIFFERENCE VIEW" showing correct (green) and misaligned (amber) meshes alongside the Difference Summary floating overlay.
- [ ] **10. Ablation table**: The bottom half of the Evaluation page showing Geometry Only vs Structural Constraints IoU metrics.
- [ ] **11. Robustness graph**: The robustness curve outputs from the Evaluation page showing degradation from 0% to 10% noise.
- [ ] **12. Low-confidence case**: The Provenance panel showing the red ⚠ "LOW-CONFIDENCE GENERATED" warning box when Confidence < 0.5.
- [ ] **13. Export panel**: The right sidebar showing GLB, PLY, and JSON export buttons.
- [ ] **14. Final 3D scene**: A beautiful, hero-quality angle of the fully completed scene in "COMPLETE WORLD" mode with grid lines and environment lighting active.
