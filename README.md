# ReactGL2D

2D Framework for creating interfaces with WebGL. Using React for state management and scene structure - with WebGL for drawing.

WIP, repo needs converting from app to lib.

Inspired by https://github.com/pmndrs/react-three-fiber

## Goals/Features/IDK

- Exposes WebGL directly
- Plain react for describing UI state (redux etc can be used)
- Scene tree structure with matricies, automatically managed with reconciler (Could use proxies to detect when transforms are updated for matrix recalc??)
- Tools for managing geometry and programs + VBO caching
- Animation helpers
