# SpaceMind Demo Script

**Target Duration**: 2:30 - 3:00 minutes
**Presenter**: SpaceMind Lead Engineer

### 00:00 — Problem
*(Presenter stands by the projector showing the SpaceMind upload screen)*
"A normal room video only captures what the camera can see. The problem is that a 3D reconstruction cannot simply treat invisible geometry as observed."

### 00:15 — TRY DEMO ROOM
*(Presenter clicks the TRY DEMO ROOM button)*
"SpaceMind solves this by separating the scene into explicitly observed, inferred, and generated regions. Let's load a standard room evaluation benchmark."

### 00:30 — Reconstructed Scene
*(UI loads the RECONSTRUCTED view)*
"First, we reconstruct only the geometry supported by the video. If the camera didn't see it, it doesn't exist here."

### 00:50 — Unseen Regions
*(Presenter toggles to UNSEEN REGIONS view)*
"Here we can see a region that was never directly observed. In traditional tools, this is either an ugly hole or a hallucinatory guess."

### 01:05 — Complete World
*(Presenter toggles to COMPLETE WORLD view)*
"SpaceMind uses structural constraints from the surrounding room to generate a plausible completion—filling the gap cleanly."

### 01:20 — Generated Region → Provenance
*(Presenter clicks on the newly generated wall region. The Provenance Panel slides open)*
"But instead of hiding that this geometry was generated, we can click it and inspect the evidence and confidence behind the prediction. You can see its visibility score was 0%, but structural continuation gave it a 54% prediction confidence."

### 01:40 — Benchmark
*(Presenter opens the BENCHMARK Evaluation Dashboard)*
"Now we evaluate the prediction against withheld ground truth."

### 02:00 — Ground Truth / Prediction / Difference
*(Presenter runs the 'Hidden Back Wall' scenario and shows Difference View)*
"The difference view shows exactly where the prediction matches, misses, or misaligns with reality. Green patches are correct, amber is misaligned."

### 02:15 — Metrics
*(Presenter scrolls down to the Space Mind Benchmark summary)*
"We get physical, testable metrics. On this benchmark, our procedural continuation achieved 1.00 IoU and 0.000m geometric error against the hidden ground truth."

### 02:30 — Ablation
*(Presenter highlights the Method Comparison table)*
"Finally, we compare geometry-only completion, structural constraints, and the full SpaceMind pipeline. Geometry-only achieves roughly 40% overlap, but full structural constraint mapping brings us to a mathematically perfect alignment on this layout."

### 02:45 — Low Confidence
*(Presenter runs the 'Low Evidence' scenario. The Provenance UI flags a red warning)*
"But what if we strip away even more evidence? We drop 40% of observations. The system dynamically lowers its confidence and explicitly flags the region as 'LOW-CONFIDENCE GENERATED'."

### 03:00 — Closing statement
*(Presenter returns to the complete world view)*
"The key idea is simple: SpaceMind does not just reconstruct a 3D scene. It knows what it knows."
