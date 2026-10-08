# SPACEMIND

**Evidence-Aware 3D Scene Reconstruction and Completion**
From Blueprints and Room Video to Navigable 3D Spaces

*Team: World Forge AI (DevOrbit)*
*Hackathon: HNX26EPS06*

> **“SpaceMind knows what it knows.”**

*(Visual: Strong screenshot of the final 3D workspace showing Reconstructed + Inferred regions)*

---

# THE PROBLEM

A room video or blueprint does not always provide complete visual evidence.

Problems include:
- Occluded surfaces
- Unseen walls
- Hidden corners
- Incomplete camera coverage
- Noisy observations
- Uncertain geometry

> A visually plausible 3D scene is not necessarily a trustworthy reconstruction.

**How can we reconstruct what is missing without pretending that unseen geometry was actually observed?**

*(Visual Concept)*
```
Camera
  ↓
[ Sofa ]
████████████
Hidden Wall
????????????
```

---

# WHY DOES THIS MATTER?

Users often cannot physically inspect every part of an environment.

- REAL ESTATE
- RENOVATION
- CONSTRUCTION
- REMOTE INSPECTION
- ROBOTICS
- DISASTER RESPONSE
- ACCESSIBILITY
- DIGITAL TWINS

**SpaceMind helps create:**
Navigable 3D representation
+ Unseen-region completion
+ Evidence transparency

---

# THE SPACEMIND APPROACH

BLUEPRINT / VIDEO
       ↓
3D RECONSTRUCTION
       ↓
VISIBILITY ANALYSIS
       ↓
UNSEEN REGION DETECTION
       ↓
STRUCTURAL COMPLETION
       ↓
PROVENANCE + CONFIDENCE
       ↓
NAVIGABLE 3D SCENE

*(Highlighting)*
OBSERVED | INFERRED | GENERATED

> SpaceMind does not treat every part of the final scene as equally certain.

---

# FROM 3D RECONSTRUCTION TO EVIDENCE-AWARE RECONSTRUCTION

| Capability | Conventional Reconstruction | SpaceMind |
|---|---|---|
| 3D reconstruction | ✓ | ✓ |
| Unseen-region completion | Limited | ✓ |
| Visibility reasoning | Limited | ✓ |
| Structural constraints | Limited | ✓ |
| Region-level evidence | Limited | ✓ |
| Provenance | Limited | ✓ |
| Confidence | Limited | ✓ |
| Ground-truth evaluation | External | Integrated |
| Ablation | — | ✓ |
| Failure transparency | Limited | ✓ |

---

# SYSTEM ARCHITECTURE

```
                    INPUT
                      │
             ┌────────┴────────┐
             │                 │
        BLUEPRINT            VIDEO
             │                 │
             ▼                 ▼
     Blueprint Parser    Frame Extraction
             │                 │
             ▼                 ▼
     Structural Prior    Camera Estimation
             │                 │
             │                 ▼
             │           Depth Estimation
             │                 │
             └────────┬────────┘
                      ▼
               SCENE ALIGNMENT
                      │
                      ▼
              VISIBILITY MAPPING
                      │
                      ▼
         UNOBSERVED REGION DETECTION
                      │
                      ▼
          STRUCTURAL COMPLETION
                      │
                      ▼
          PROVENANCE + CONFIDENCE
                      │
                      ▼
             NAVIGABLE 3D SCENE
                      │
                 ┌────┴────┐
                 ▼         ▼
             EVALUATION   EXPORT
```
*(Ground truth appears only on the evaluation branch.)*

---

# THE CORE IDEA: EVERY REGION HAS EVIDENCE

```
┌────┬────┬────┬────┬────┐
│ O  │ O  │ O  │ U  │ U  │
├────┼────┼────┼────┼────┤
│ O  │ O  │ P  │ U  │ U  │
├────┼────┼────┼────┼────┤
│ O  │ P  │ G  │ G  │ U  │
└────┴────┴────┴────┴────┘
O = Observed, P = Partially Observed, U = Unobserved, G = Generated
```

For each region:
- Visibility
- Observation Count
- Evidence Frames
- Supporting Elements
- Confidence
- Completion Reason

---

# HOW DO WE KNOW THE COMPLETION IS CORRECT?

```
GROUND TRUTH
      │
      ├──→ Observation Generator
      │
      │     ↓
      │   SpaceMind
      │     ↓
      │   Prediction
      │
      └──────────────→ Evaluator
                         ↓
                    Comparison
```

> Ground truth is withheld from the reconstruction pipeline.

Metrics:
- Completion IoU
- Mean Geometric Error
- Surface Coverage
- Scene Completeness

**Prediction Confidence ≠ Ground-Truth Similarity**

---

# DO STRUCTURAL CONSTRAINTS ACTUALLY HELP?

*(Controlled synthetic benchmark)*

| Method | IoU | Mean Error |
|---|---:|---:|
| Geometry Only | ~0.40 | ~0.450 m |
| Structural Constraints | ~0.70 | ~0.250 m |
| Full SpaceMind | ~1.00 | ~0.000 m |

> On the controlled hidden-wall benchmark, the full procedural constraint system achieved perfect overlap. This result should not be interpreted as universal reconstruction accuracy.

---

# WHAT HAPPENS WHEN OBSERVATIONS GET WORSE?

*(Controlled benchmark robustness experiment)*

| Observation Noise | Completion IoU |
|---:|---:|
| 0% | ~1.00 |
| 2% | ~0.96 |
| 5% | ~0.91 |
| 10% | ~0.84 |

> SpaceMind degrades measurably as observation quality decreases instead of silently treating noisy geometry as certain.

---

# WHEN THE EVIDENCE IS WEAK

⚠ **LOW-CONFIDENCE GENERATED**

**Evidence Strength:** LOW
**Visibility:** 18%
**Observation Count:** 2
**Prediction Confidence:** 41%

**Reason:** Insufficient visual evidence and missing structural anchors.

> **A trustworthy reconstruction system should know when it is uncertain.**

---

# FROM DEMO TO REAL-WORLD SYSTEM

**Demo Flow:**
VIDEO → RECONSTRUCTED → UNSEEN REGIONS → COMPLETE WORLD → PROVENANCE → BENCHMARK → DIFFERENCE → ABLATION

**FUTURE SCOPE:**
- Stronger learned camera/depth models
- Learned completion models
- Larger real-world indoor datasets
- Non-planar surface reasoning
- Blueprint-guided video reconstruction
- Sparse photo reconstruction
- Object-level scene understanding
- Robotics / digital-twin integration

---

# SPACEMIND

> **Reconstruct what you can see.**
>
> **Infer what the structure supports.**
>
> **Generate what is missing.**
>
> **And show the difference.**

**“SpaceMind knows what it knows.”**

Thank You
Questions?
