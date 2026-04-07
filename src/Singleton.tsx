import {useEffect, useRef, useState, useCallback} from 'react';
import './index.css';

const cards = [
  {
    eyebrow: '01',
    title: 'Thin markets lose traders',
    body:
      'Liquidity is product quality. Better depth and cleaner pricing make markets easier to trade and easier to come back to.',
  },
  {
    eyebrow: '02',
    title: 'Better Inputs\nBetter Markets',
    body:
      'Proprietary data access that turns fragmented signals into pricing inputs used in live event markets.',
  },
  {
    eyebrow: '03',
    title: 'Engine in use',
    body: 'More than $19M in volume has already moved through our execution engine.',
  },
];

function SingletonScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || window.innerWidth < 900) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let modelsLoaded = 0;
    let targetOffsetX = 0;
    let targetOffsetY = 0;
    let currentOffsetX = 0;
    let currentOffsetY = 0;

    const loadScene = async () => {
      const [{GLTFLoader}, THREE] = await Promise.all([
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three'),
      ]);

      if (cancelled || !canvas.isConnected) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 14);

      const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(4, 5, 8);
      const rimLight = new THREE.DirectionalLight(0xe9c176, 2.5);
      rimLight.position.set(-3, 2, 5);
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
      scene.add(keyLight, rimLight, ambientLight);

      const outerMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf4f1eb,
        roughness: 0.1,
        metalness: 0.22,
        transmission: 0.88,
        clearcoat: 1,
        thickness: 1.8,
        ior: 1.42,
      });

      const goldMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe2c78d,
        emissive: 0x2a1f0f,
        emissiveIntensity: 0.018,
        roughness: 0.22,
        metalness: 0.16,
        transmission: 0.7,
        clearcoat: 0.9,
        thickness: 1.2,
      });

      const graphiteMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x91969c,
        emissive: 0x0d1014,
        emissiveIntensity: 0.008,
        roughness: 0.18,
        metalness: 0.08,
        transmission: 0.82,
        clearcoat: 0.72,
        thickness: 1.1,
      });

      const palette = [outerMaterial, goldMaterial, graphiteMaterial];

      const objects: {
        mesh: import('three').Object3D;
        floating: boolean;
        baseY: number;
        baseX: number;
        baseScale: number;
      }[] = [];
      const loader = new GLTFLoader();
      const modelBase = new URL('models/', document.baseURI).toString();

      const addModel = (
        url: string,
        position: [number, number, number],
        scale: number,
        floating: boolean,
      ) => {
        loader.load(url, (gltf) => {
          if (cancelled) return;

          const model = gltf.scene;
          let meshIndex = 0;
          model.traverse((child) => {
            if ((child as import('three').Mesh).isMesh) {
              const mesh = child as import('three').Mesh;
              const accentIndex = floating ? (meshIndex + 1) % palette.length : meshIndex % palette.length;
              mesh.material = palette[accentIndex];
              meshIndex += 1;
            }
          });

          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size);
          box.getCenter(center);
          const maxDimension = Math.max(size.x, size.y, size.z) || 1;
          const scaleFactor = scale / maxDimension;
          model.scale.setScalar(scaleFactor);
          model.position.sub(center.multiplyScalar(scaleFactor));
          model.position.set(...position);
          scene.add(model);
          objects.push({
            mesh: model,
            floating,
            baseY: position[1],
            baseX: position[0],
            baseScale: model.scale.x,
          });

          modelsLoaded += 1;
          if (modelsLoaded === 2) {
            canvas.classList.add('singleton-canvas--loaded');
          }
        });
      };

      addModel(`${modelBase}shape-hero.glb`, [4.4, 1.8, -1], 3.68, false);
      addModel(`${modelBase}shape-4.glb`, [-4.4, -3.3, -2], 3.1, true);

      const onResize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      const onPointerMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        targetOffsetX = normalizedX * 0.85;
        targetOffsetY = normalizedY * 0.55;
      };

      window.addEventListener('resize', onResize);
      window.addEventListener('pointermove', onPointerMove, {passive: true});
      onResize();

      const clock = new THREE.Clock();
      let frameId = 0;

      const animate = () => {
        frameId = window.requestAnimationFrame(animate);
        const time = clock.getElapsedTime();
        currentOffsetX += (targetOffsetX - currentOffsetX) * 0.11;
        currentOffsetY += (targetOffsetY - currentOffsetY) * 0.11;

        objects.forEach((object, index) => {
          const baseSpinY = 0.0052 + index * 0.0011;
          const baseSpinX = 0.003 + index * 0.00035;
          object.mesh.rotation.y += baseSpinY;
          object.mesh.rotation.x += baseSpinX;
          if (object.floating) {
            object.mesh.position.y = object.baseY + Math.sin(time * 1.15) * 0.44 - currentOffsetY;
            object.mesh.position.x = object.baseX + currentOffsetX * 1.02;
            const scaleDelta = Math.min(0.14, Math.max(-0.015, (Math.abs(currentOffsetX) + Math.abs(currentOffsetY)) * 0.07));
            const maxScale = object.baseScale * 1.14;
            object.mesh.scale.setScalar(Math.min(maxScale, object.baseScale + scaleDelta));
            object.mesh.rotation.z = currentOffsetX * 0.12 + currentOffsetY * 0.08;
          } else {
            object.mesh.position.x = object.baseX;
            object.mesh.scale.setScalar(object.baseScale);
          }
        });

        renderer.render(scene, camera);
      };

      animate();

      cleanup = () => {
        window.cancelAnimationFrame(frameId);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('pointermove', onPointerMove);
        outerMaterial.dispose();
        goldMaterial.dispose();
        graphiteMaterial.dispose();
        objects.forEach(({mesh}) => scene.remove(mesh));
        renderer.dispose();
      };
    };

    const timer = window.setTimeout(loadScene, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      cleanup?.();
    };
  }, []);

  return (
    <>
      <div className="singleton-orb singleton-orb--top" aria-hidden="true" />
      <div className="singleton-orb singleton-orb--bottom" aria-hidden="true" />
      <canvas ref={canvasRef} className="singleton-canvas" aria-hidden="true" />
    </>
  );
}

const CALENDAR_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ29Bm-_F3Vq03bG4OG5Vz6oK5hvspwO0DNu6JRynAdlPtSyIKv9L-2DD0cyTpkKVEOrRNs15RWL?gv=true';

function CalendarModal({onClose}: {onClose: () => void}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="calendar-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Schedule a call">
      <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
        <button className="calendar-modal__close" onClick={onClose} aria-label="Close">&#x2715;</button>
        <iframe
          src={CALENDAR_URL}
          className="calendar-modal__frame"
          title="Schedule a call"
          frameBorder="0"
        />
      </div>
    </div>
  );
}

export default function Singleton() {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const closeCalendar = useCallback(() => setCalendarOpen(false), []);

  return (
    <div className="singleton-page font-body selection:bg-gold selection:text-primary">
      <main className="singleton-shell">
        <section className="singleton-panel">
          <SingletonScene />
          <div className="singleton-header">
            <a href="/" className="singleton-brand">
              <img src="/emetruth-mark.png" alt="" className="singleton-brand__mark" />
              <span>EmeTruth</span>
            </a>
          </div>

          <div className="singleton-grid">
            <div className="singleton-copy">
              <h1 className="singleton-title">
                Liquidity Layer
                <br />
                <span className="singleton-title__plain">for </span>
                <span className="singleton-title__accent">Prediction</span>
                <br />
                <span className="singleton-title__accent">Markets.</span>
              </h1>
              <p className="singleton-description">
                Emetruth works with prediction markets to ensure deep liquidity and quality markets,
                so traders keep coming back.
              </p>

              <div className="singleton-cards">
                {cards.map((card) => (
                  <article key={card.eyebrow} className="singleton-card">
                    <p className="singleton-card__eyebrow">{card.eyebrow}</p>
                    <h2 className="singleton-card__title">
                      {card.title.split('\n').map((line) => (
                        <span key={line}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </h2>
                    <p className="singleton-card__body">{card.body}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="singleton-actions">
              <div className="singleton-actions__inner">
                <a href="mailto:emetruth@proton.me" className="singleton-action singleton-action--primary">
                  Contact us
                </a>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setCalendarOpen(true); }}
                  className="singleton-action singleton-action--secondary"
                >
                  Schedule a call
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="singleton-footer">
        <span className="singleton-footer__copy">&copy; {new Date().getFullYear()} EmeTruth</span>
        <nav className="singleton-footer__links" aria-label="Legal">
          <a href="/privacy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
          <a href="/disclosures.html">Disclosures</a>
        </nav>
      </footer>

      {calendarOpen && <CalendarModal onClose={closeCalendar} />}
    </div>
  );
}
