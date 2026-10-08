# Judge Q&A Guide

### Innovation
**What is the core innovation?**
"Our main contribution is evidence-aware 3D reconstruction. SpaceMind explicitly separates observed, inferred, and generated geometry and attaches provenance and confidence to generated regions."

### Existing methods
**How is this different from ordinary 3D reconstruction?**
"Most tools focus solely on generating a plausible mesh. They hide their guesses. SpaceMind focuses on transparency. It breaks the scene down into regions and explicitly documents the evidence backing every single surface."

### Unseen regions
**How do you reconstruct geometry that was not observed?**
"SpaceMind uses visibility mapping to detect holes, and then applies structural priors—like room bounding constraints, adjacent planes, and floor/ceiling alignment—to procedurally extend and complete missing regions."

### Ground truth
**How do you prevent ground-truth leakage?**
"The reconstruction pipeline runs entirely blind to the ground truth. Ground truth is withheld and only loaded by a separate Evaluation module post-prediction, specifically to compare the generated bounding boxes against reality."

### Evaluation
**How do you measure completion quality?**
"We withhold specific geometry from the observation, run SpaceMind without access to that ground truth, then compare the final prediction against the withheld reference using Intersection over Union (IoU) and Mean Geometric Error."

### Ablation
**Why is the ablation important?**
"We run an ablation comparing geometry-only completion, structural constraints, and the full SpaceMind pipeline under the same observation. It proves mathematically that our structural reasoning actually improves alignment, rather than just guessing."

### Confidence
**How is confidence different from accuracy?**
"Confidence is a prediction-time estimate based on available evidence and structural anchors. Accuracy is a post-hoc measurement against ground truth. SpaceMind never uses accuracy to calculate confidence."

### Failure
**What happens when evidence is insufficient?**
"The system lowers its confidence and explicitly labels the result as low-confidence generated rather than presenting it as observed geometry. We treat failure transparency as a feature."

### Neural models
**Why are some components procedural/fallback-based?**
"The current hackathon implementation uses modular adapters with lightweight/procedural fallback components so that the full pipeline can run reliably on a normal laptop. The architecture is designed so stronger learned camera, depth, and completion models can be inserted later."

### Scalability
**What happens with larger or more complex scenes?**
"Our 10x10 surface-region representation is inherently more scalable than dense voxel grids. For complex non-planar geometry like furniture, the system would need to integrate learned diffusion-based completion adapters."

### Real-world use
**Who would use this?**
"Remote inspectors, real estate appraisers, and disaster response teams. Anyone who needs a 3D environment to be trustworthy, and needs to know exactly which parts of the digital twin were actually observed."

### Future scope
**What would you improve next?**
"We would integrate stronger neural depth estimators and learned completion diffusion models, constrained by our structural evidence maps, to handle non-planar objects and larger, multi-room spaces."
