# 3D Performance Plan

## Objective

Reduce the marketing site's initial payload before progressively loading the decorative 3D layer.

## Step 1: Optimize Source Assets

- Inspect every `.glb` for unused geometry, oversized textures, and duplicate materials.
- Run geometry simplification where silhouette quality holds up.
- Compress textures to WebP or KTX2 where supported.
- Remove any model variants that do not materially improve the homepage composition.
- Set target budgets:
  - hero model under 700 KB
  - secondary models under 250 KB each
  - total 3D asset budget under 2 MB compressed

## Step 2: Keep 3D Out of the Main Bundle

- Dynamically import `three` and `GLTFLoader` only when the scene is actually needed.
- Keep all 3D code in a split chunk so the homepage copy and conversion path render first.

## Step 3: Lazy Load Scene Work

- Only start scene initialization after idle time.
- Skip the 3D layer entirely for users who prefer reduced motion.
- Skip or heavily reduce the scene on mobile breakpoints where it contributes less to conversion.

## Step 4: Verify

- Compare before and after bundle sizes with `vite build`.
- Test LCP and interaction timing on a simulated mid-tier laptop and mobile device.
- Confirm the page still feels premium without blocking core content.
