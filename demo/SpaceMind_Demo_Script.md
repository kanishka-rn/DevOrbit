# SpaceMind Demo Script

**Target Duration**: 2:30 - 3:00 minutes
**Presenter**: SpaceMind Lead Engineer

### 00:00–00:15 — Problem + One-Sentence Solution
*(Presenter stands by the projector showing the SpaceMind upload screen)*
"A normal room video only captures what the camera can see. The problem is that a 3D reconstruction cannot simply treat invisible geometry as observed. SpaceMind solves this by separating the scene into explicitly observed, inferred, and generated regions."

### 00:15–00:35 — TRY DEMO ROOM
*(Presenter clicks the TRY DEMO ROOM button)*
"Let's load a standard room evaluation benchmark."
*(Wait for the processing spinner to finish)*

### 00:35–00:55 — RECONSTRUCTED
*(UI loads the RECONSTRUCTED view in the Workspace)*
"First, we reconstruct only the geometry supported by the video. If the camera didn't see it, it doesn't exist here. This is pure, un-hallucinated observation."

### 00:55–01:10 — UNSEEN REGIONS
*(Presenter clicks the COMPLETION tab on the top toolbar, then toggles to UNSEEN REGIONS)*
"By analyzing visibility, SpaceMind detects exactly what it missed. Here we can see a region that was never directly observed. In traditional tools, this is an ugly hole."

### 01:10–01:25 — COMPLETE WORLD
*(Presenter toggles to COMPLETE WORLD view)*
"SpaceMind uses structural constraints from the surrounding room to generate a plausible completion—filling the gap cleanly."

### 01:25–01:40 — Click generated region → Provenance
*(Presenter clicks on the newly generated wall region. The Provenance Panel slides open)*
"But instead of hiding that this geometry was generated, we can click it and inspect the evidence. You can see its visibility score was 0%, but structural continuation gave it a prediction confidence above 50%."

### 01:40–02:00 — Benchmark
*(Presenter opens the BENCHMARK Evaluation Dashboard)*
"Now we evaluate the prediction against withheld ground truth."
*(Presenter clicks RUN ALL SCENARIOS)*

### 02:00–02:15 — Ground Truth / Prediction / Difference
*(Presenter switches to Difference View inside the workspace or points to the Evaluation panel)*
"The difference view shows exactly where the prediction matches, misses, or misaligns with reality. Green patches are correct, amber is misaligned."

### 02:15–02:30 — Metrics
*(Presenter scrolls down to the Space Mind Benchmark summary)*
"We get physical, testable metrics. On the Hidden Back Wall benchmark, our procedural continuation achieved 1.00 IoU and 0.000m geometric error against the hidden ground truth."

### 02:30–02:45 — Ablation
*(Presenter highlights the Method Comparison table)*
"Finally, we run an ablation. Geometry-only completion achieves roughly 40% overlap, but full structural constraint mapping brings us to a mathematically perfect alignment on this layout."

### 02:45–03:00 — Low-confidence case + Closing statement
*(Presenter selects the 'Low Evidence' scenario)*
"But what if we strip away evidence? We drop observations. The system dynamically lowers its confidence and explicitly flags the region as 'LOW-CONFIDENCE GENERATED'. The key idea is simple: SpaceMind does not just reconstruct a 3D scene. It knows what it knows."
