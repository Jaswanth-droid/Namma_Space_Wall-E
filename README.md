# Namma Space: Intelligent Indoor Spatial Engine
### Submission for Techfest, IIT Bombay — Wall-E Team

An end-to-end spatial engine that converts standard smartphone captures of indoor spaces into interactive 3D digital twins with virtual walkthroughs, Point of Interest (POI) spatial indexing, and free-roaming capabilities.

---

## Architecture Overview

```
Smartphone Video Capture (4K / 1080p, 60fps)
            │
            ▼
Google Colab GPU Engine (T4 / A100)
    ├── FFmpeg Keyframe Sampling (2–3 fps)
    ├── COLMAP Structure-from-Motion (Pose Estimation)
    ├── Nerfstudio splatfacto (3D Gaussian Splatting Training)
    └── Export .ply / .splat
            │
            ▼
Local Web Viewer (Three.js + React Three Fiber)
    ├── PointerLock FPS Free-Roaming (WASD + Mouse)
    ├── Real-Time Spatial Telemetry HUD (X, Y, Z Coordinates)
    ├── Interactive Spatial POI Tagging & Search Index
    └── Obstacle-Aware NavMesh Pathfinding Engine (Round 2 Ready)
```

---

## 1. Standard Operating Procedure (SOP) for Capture

1. **Space Preparation**:
   - Turn on all interior lighting to avoid harsh dynamic shadow changes.
   - Secure loose cables and clear moving obstacles.
   - Keep all room doors propped open.

2. **Capture Path**:
   - Hold smartphone horizontally at chest height (1.4m–1.6m).
   - Walk in continuous overlapping loops around the room periphery and center.
   - Maintain a slow, steady walking pace (0.5 m/s) with 70–80% visual overlap between adjacent passes.
   - Duration: 90 to 180 seconds per indoor room.

---

## 2. Launching Model Training (Google Colab)

Since local mobile GPUs (e.g. 2GB VRAM) cannot train dense 3D Gaussian Splats, we provide a self-contained Google Colab notebook:

1. Open [Google Colab](https://colab.research.google.com).
2. Click **Upload** and select [`indoor_3dgs_training_colab.ipynb`](./indoor_3dgs_training_colab.ipynb).
3. Ensure GPU accelerator is enabled: **Runtime > Change runtime type > T4 GPU**.
4. Run the cells in order:
   - Cell 1-3: Install dependencies (COLMAP, FFmpeg, Nerfstudio).
   - Cell 4-5: Upload your smartphone `.mp4` video.
   - Cell 6: `ns-process-data` automatically extracts frames and runs COLMAP SfM.
   - Cell 7: `ns-train splatfacto` trains the 3D Gaussian Splats (~20-30 mins).
   - Cell 8: `ns-export` outputs web-ready `.ply` model files directly to your downloads.

---

## 3. Running the Local Web Viewer

To test the free-roaming 3D platform locally:

```bash
cd web-viewer
npm install
npm run dev
```

Open `http://localhost:5173` in your browser:
- **Click anywhere** to engage First-Person PointerLock.
- **W, A, S, D**: Move around the 3D digital twin.
- **Mouse**: 360° look-around.
- **Shift**: Sprint.
- **Space / E**: Ascend.
- **Ctrl / Q**: Descend.
- **ESC**: Release mouse cursor.
- **POI Panel**: Tag coordinates and query spatial points of interest.
