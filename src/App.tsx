import {FormEvent, useEffect, useMemo, useRef, useState} from 'react';
import {motion, useScroll, useTransform} from 'motion/react';

const CONTACT_EMAIL = 'partners@emetruth.capital';
const CONTACT_FORM_ENDPOINT = import.meta.env.VITE_CONTACT_FORM_ENDPOINT?.trim();
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL?.trim();

type FloatingObject = {
  baseY: number;
  mesh: import('three').Object3D;
  rotSpeedX: number;
  rotSpeedY: number;
};

type FormStatus =
  | {type: 'idle'; message: ''}
  | {type: 'success'; message: string}
  | {type: 'error'; message: string};

function BackgroundScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 900;

    if (prefersReducedMotion || isMobile) {
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const loadScene = async () => {
      const [{GLTFLoader}, THREE] = await Promise.all([
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three'),
      ]);

      if (cancelled || !canvas.isConnected) return;

      const modelBase = new URL('models/', document.baseURI).toString();
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#FCF9F8');
      scene.fog = new THREE.FogExp2('#FCF9F8', 0.02);

      const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100,
      );
      camera.position.z = 15;

      const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false});
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
      keyLight.position.set(5, 5, 5);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xe6f0ff, 1.0);
      fillLight.position.set(-5, 0, 5);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xe9c176, 4.0);
      rimLight.position.set(0, 5, -10);
      scene.add(rimLight);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.95,
        ior: 1.5,
        thickness: 2.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.5,
      });

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();

      const envScene = new THREE.Scene();
      const envLight1 = new THREE.PointLight(0xe9c176, 10, 50);
      envLight1.position.set(5, 5, 5);
      const envLight2 = new THREE.PointLight(0xffffff, 10, 50);
      envLight2.position.set(-5, -5, -5);
      envScene.add(envLight1, envLight2);
      scene.environment = pmremGenerator.fromScene(envScene).texture;

      const loader = new GLTFLoader();
      const objects: FloatingObject[] = [];

      const registerObject = (
        object: import('three').Object3D,
        position: [number, number, number],
        rotSpeedX: number,
        rotSpeedY: number,
        baseY: number,
      ) => {
        object.position.set(...position);
        scene.add(object);
        objects.push({mesh: object, rotSpeedX, rotSpeedY, baseY});
      };

      const createFallbackObject = (
        geometry: import('three').BufferGeometry,
        targetSize: number,
      ) => {
        const mesh = new THREE.Mesh(geometry, glassMaterial);
        mesh.scale.setScalar(targetSize);
        return mesh;
      };

      const normalizeModel = (model: import('three').Object3D, targetSize: number) => {
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxDimension = Math.max(size.x, size.y, size.z) || 1;
        const scaleFactor = targetSize / maxDimension;

        model.scale.setScalar(scaleFactor);
        model.position.sub(center.multiplyScalar(scaleFactor));
        return model;
      };

      const addModelWithFallback = (
        url: string,
        fallbackGeometry: import('three').BufferGeometry,
        position: [number, number, number],
        rotSpeedX: number,
        rotSpeedY: number,
        baseY: number,
        targetSize: number,
      ) => {
        loader.load(
          url,
          (gltf) => {
            if (cancelled) return;

            const model = gltf.scene;
            model.traverse((child) => {
              if ((child as import('three').Mesh).isMesh) {
                (child as import('three').Mesh).material = glassMaterial;
              }
            });

            registerObject(
              normalizeModel(model, targetSize),
              position,
              rotSpeedX,
              rotSpeedY,
              baseY,
            );
          },
          undefined,
          () => {
            if (cancelled) return;

            registerObject(
              createFallbackObject(fallbackGeometry, targetSize),
              position,
              rotSpeedX,
              rotSpeedY,
              baseY,
            );
          },
        );
      };

      addModelWithFallback(
        `${modelBase}shape-hero.glb`,
        new THREE.IcosahedronGeometry(1, 0),
        [5.8, 2.3, -2],
        0.002,
        0.003,
        2,
        3.05,
      );
      addModelWithFallback(
        `${modelBase}shape-2.glb`,
        new THREE.OctahedronGeometry(1, 0),
        [-5, -8, -4],
        -0.001,
        0.002,
        -8,
        2.35,
      );
      addModelWithFallback(
        `${modelBase}shape-3.glb`,
        new THREE.TorusKnotGeometry(1, 0.28, 100, 16),
        [5, -18, -3],
        0.003,
        0.001,
        -18,
        1.8,
      );
      addModelWithFallback(
        `${modelBase}shape-4.glb`,
        new THREE.TetrahedronGeometry(1, 0),
        [-4, -28, -5],
        0.002,
        -0.002,
        -28,
        2.9,
      );

      let scrollY = window.scrollY;
      const onScroll = () => {
        scrollY = window.scrollY;
      };

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      };

      window.addEventListener('scroll', onScroll, {passive: true});
      window.addEventListener('resize', onResize);

      const clock = new THREE.Clock();
      let frameId = 0;

      const animate = () => {
        frameId = window.requestAnimationFrame(animate);
        const time = clock.getElapsedTime();
        const targetCameraY = -(scrollY * 0.012);

        camera.position.y += (targetCameraY - camera.position.y) * 0.05;

        objects.forEach((obj, index) => {
          obj.mesh.rotation.x += obj.rotSpeedX;
          obj.mesh.rotation.y += obj.rotSpeedY;
          obj.mesh.position.y = obj.baseY + Math.sin(time * 0.5 + index) * 0.3;
        });

        renderer.render(scene, camera);
      };

      animate();

      cleanup = () => {
        window.cancelAnimationFrame(frameId);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        pmremGenerator.dispose();
        glassMaterial.dispose();
        objects.forEach(({mesh}) => {
          mesh.traverse((child) => {
            if ((child as import('three').Mesh).isMesh) {
              (child as import('three').Mesh).geometry.dispose();
            }
          });
          scene.remove(mesh);
        });
        renderer.dispose();
      };
    };

    let idleHandle: number | ReturnType<typeof globalThis.setTimeout> = 0;
    let usingIdleCallback = false;

    if ('requestIdleCallback' in window) {
      usingIdleCallback = true;
      idleHandle = window.requestIdleCallback(loadScene, {timeout: 1200});
    } else {
      idleHandle = globalThis.setTimeout(loadScene, 500);
    }

    return () => {
      cancelled = true;
      if (usingIdleCallback && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleHandle as number);
      } else {
        globalThis.clearTimeout(idleHandle);
      }
      cleanup?.();
    };
  }, []);

  return <canvas id="webgl-canvas" ref={canvasRef} aria-hidden="true" />;
}

const marketCards = [
  {
    id: '01',
    heading: 'Liquidity',
    title: 'Thin markets lose traders',
    body:
      'When spreads stay wide and size disappears, traders stop trusting the market. Volume slips, launches feel weak, and retention suffers.',
    points: ['Wide spreads push traders away', 'Weak launches are hard to recover'],
    className: '',
    sectionId: 'problem',
  },
  {
    id: '02',
    heading: 'Retention',
    title: 'Better markets keep users',
    body:
      'For operators, liquidity is product quality. Better depth and cleaner pricing make markets easier to trade and easier to come back to.',
    points: ['Better trader experience', 'Stronger retention'],
    className: 'pt-0 md:pt-32 pl-0 md:pl-12',
    sectionId: 'outcome',
  },
];

const programCards = [
  {
    title: 'Ongoing Market Making',
    body: 'Continuous quoting for live venues to improve spread quality and visible depth.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="square"
          strokeLinejoin="miter"
          strokeWidth="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    className: '',
  },
  {
    title: 'Launch Seeding',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="square"
          strokeLinejoin="miter"
          strokeWidth="2"
          d="M12 3v18m9-9H3m15.5-5.5l-11 11"
        />
      </svg>
    ),
    body: 'Support for new contracts and new venues so markets open with real liquidity.',
    className: 'mt-0 md:mt-16',
  },
  {
    title: 'Market Design Advice',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="square"
          strokeLinejoin="miter"
          strokeWidth="2"
          d="M4 6h16M4 12h10M4 18h7"
        />
      </svg>
    ),
    body: 'Input on which markets to open and how to structure them for better early trading.',
    className: '',
  },
  {
    title: 'Venue Collaboration',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="square"
          strokeLinejoin="miter"
          strokeWidth="2"
          d="M8 12h8M12 8v8M4 7h4v10H4zM16 7h4v10h-4z"
        />
      </svg>
    ),
    body: 'Hands-on work around APIs, testing, and execution when venue infrastructure needs improvement.',
    className: 'mt-0 md:mt-16',
  },
];

const specialistCards = [
  {
    title: 'Prediction-Market Native',
    body: 'We work specifically with prediction markets, not as a generic crypto market maker selling broad coverage.',
    className: 'bg-surface',
    bodyClassName: 'text-muted',
    titleClassName: '',
  },
  {
    title: 'Signal Workflows',
    body: 'We turn fragmented external signals into pricing inputs that can actually be used in live event markets.',
    className: 'executive-card md:-translate-y-8',
    bodyClassName: 'text-gray-400',
    titleClassName: 'text-white',
  },
  {
    title: 'Built for Event Risk',
    body: 'Those workflows feed execution built for openings, repricing, and market launches where prediction-market microstructure matters.',
    className: 'bg-surface',
    bodyClassName: 'text-muted',
    titleClassName: '',
  },
];

const proofCards = [
  {
    title: 'Operator-Focused',
    body: 'We work with prediction market operators that care about market quality, launch readiness, and trader retention.',
  },
  {
    title: 'Private Until Committed',
    body: 'Activity stays private until commitment, reducing signal leakage before orders hit the market.',
  },
  {
    title: '$19M Through The Engine',
    body: 'More than $19M in volume has already moved through the execution engine in live use.',
  },
];

const navItems = [
  {href: '#program', label: 'What We Do', sectionId: 'program'},
  {href: '#specialist', label: 'Edge', sectionId: 'specialist'},
  {href: '#proof', label: 'Proof', sectionId: 'proof'},
];

const revealUp = {
  hidden: {opacity: 0, y: 40},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.75, ease: [0.22, 1, 0.36, 1]},
  },
};

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('program');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>({type: 'idle', message: ''});
  const {scrollYProgress} = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0.35]);

  useEffect(() => {
    const sectionIds = ['program', 'specialist', 'proof', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: '-22% 0px -45% 0px',
        threshold: [0.2, 0.35, 0.55, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scheduleHref = useMemo(() => {
    if (CALENDLY_URL) return CALENDLY_URL;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Schedule Intro Call')}`;
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      company: String(formData.get('company') || ''),
      interest: String(formData.get('interest') || ''),
      message: String(formData.get('message') || ''),
    };

    setIsSubmitting(true);
    setFormStatus({type: 'idle', message: ''});

    try {
      if (CONTACT_FORM_ENDPOINT) {
        const response = await fetch(CONTACT_FORM_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Unable to send form.');
        }

        form.reset();
        setFormStatus({
          type: 'success',
          message: 'Your message was sent. We will follow up directly.',
        });
      } else {
        const subject = `${payload.interest || 'Operator Inquiry'} - ${payload.company || payload.name}`;
        const body = [
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          `Company: ${payload.company}`,
          `Interest: ${payload.interest}`,
          '',
          payload.message,
        ].join('\n');
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setFormStatus({
          type: 'success',
          message: 'Your email draft opened. Send it and we will follow up directly.',
        });
      }
    } catch {
      setFormStatus({
        type: 'error',
        message: `The form could not be sent. Email us directly at ${CONTACT_EMAIL}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-body selection:bg-gold selection:text-primary">
      <BackgroundScene />

      <nav className="glass-nav fixed top-0 z-50 flex w-full items-center justify-between px-6 py-5 transition-all duration-300 md:px-8 md:py-6">
        <a href="/" className="flex items-center gap-3 font-headline text-xl font-extrabold uppercase tracking-tighter">
          <img src="/emetruth-mark.png" alt="" className="h-9 w-9 rounded-lg object-cover" />
          <span>EmeTruth</span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.sectionId}
              href={item.href}
              data-active={activeSection === item.sectionId}
              className="nav-link font-headline text-[11px] font-bold uppercase tracking-[0.18em] text-muted transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="#contact"
          className="rounded bg-gold px-6 py-4 font-headline text-[11px] font-bold uppercase tracking-[0.18em] text-primary transition-opacity hover:opacity-80 md:px-8"
        >
          Talk To Us
        </a>
      </nav>

      <main className="relative z-10 pt-28 md:pt-32">
        <motion.section
          style={{y: heroY, opacity: heroOpacity}}
          className="flex min-h-[85vh] items-center px-8 md:px-16 lg:px-24"
        >
          <motion.div
            className="w-full max-w-6xl"
            initial="hidden"
            animate="visible"
            variants={revealUp}
          >
            <p className="mb-8 font-headline text-sm font-bold uppercase tracking-[0.2em] text-gold">
              For Prediction Market Operators
            </p>
            <h1 className="mb-10 max-w-5xl font-headline text-5xl leading-[0.94] font-extrabold tracking-tighter md:text-7xl lg:text-[6.25rem]">
              Liquidity Layer
              <br />
              <span className="text-gold">for prediction</span>
              <br />
              markets.
            </h1>
            <div className="mt-12 flex max-w-4xl flex-col gap-8 md:flex-row md:gap-16">
              <div className="h-24 w-1 shrink-0 bg-gold" />
              <div className="space-y-5">
                <p className="max-w-3xl text-lg leading-relaxed font-medium text-muted md:text-xl">
                  Emetruth works with prediction markets to improve market quality and quantity, so
                  your traders keep coming back.
                </p>
              </div>
            </div>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <a
                href="#contact"
                className="cta-button rounded-full bg-gold px-10 py-5 font-headline text-xs font-bold uppercase tracking-widest text-primary transition-opacity hover:opacity-80"
              >
                Talk To Us
              </a>
              <a
                href={scheduleHref}
                target={CALENDLY_URL ? '_blank' : undefined}
                rel={CALENDLY_URL ? 'noreferrer' : undefined}
                className="secondary-button px-10 py-5 text-center font-headline text-xs font-bold uppercase tracking-widest text-primary"
              >
                Schedule A Call
              </a>
            </div>
          </motion.div>
        </motion.section>

        <section id="problem" className="second-fold relative px-8 py-32 md:px-16 lg:px-24">
          <div className="second-fold__veil" aria-hidden="true" />
          <div className="mx-auto mb-16 max-w-4xl">
            <p className="mb-5 font-headline text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Market Quality
            </p>
            <h2 className="max-w-4xl font-headline text-4xl font-extrabold uppercase tracking-tighter md:text-5xl">
              If markets are thin, traders leave.
            </h2>
          </div>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-24 md:grid-cols-2">
            {marketCards.map((card, index) => (
              <motion.div
                key={card.id}
                id={card.sectionId}
                className={`space-y-12 pr-0 md:pr-12 ${card.className}`}
                variants={revealUp}
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.25}}
                transition={{delay: index * 0.1}}
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-headline text-5xl font-extrabold text-gold">{card.id}</span>
                  <h2 className="font-headline text-3xl font-extrabold uppercase tracking-tight">
                    {card.heading}
                  </h2>
                </div>
                <div className="ambient-shadow fold-card relative bg-surface-elevated p-12">
                  <div className="absolute top-0 left-0 h-16 w-1 bg-gold" />
                  <h3 className="mb-6 font-headline text-2xl font-bold">{card.title}</h3>
                  <p className="mb-10 leading-relaxed text-muted">{card.body}</p>
                  <ul className="space-y-5">
                    {card.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-4 font-headline text-xs font-bold uppercase tracking-widest"
                      >
                        <div className="h-2 w-2 rounded-full bg-gold" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="program" className="px-8 py-48 md:px-16 lg:px-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-12">
            <motion.div
              className="lg:col-span-5"
              variants={revealUp}
              initial="hidden"
              whileInView="visible"
              viewport={{once: true, amount: 0.3}}
            >
              <p className="mb-6 font-headline text-xs font-bold uppercase tracking-[0.2em] text-gold">
                What We Do
              </p>
              <h2 className="mb-8 font-headline text-5xl leading-[1.1] font-extrabold uppercase tracking-tighter md:text-6xl">
                Liquidity
                <br />
                Programs For
                <br />
                Prediction Markets
              </h2>
              <p className="mb-12 text-lg leading-relaxed text-muted">
                Built for prediction markets that need reliable liquidity, stronger launches, and a
                better trader experience from day one.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:col-span-7">
              {programCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  className={`execution-panel fold-card group flex h-72 flex-col justify-end bg-surface-alt p-12 transition-all duration-500 hover:bg-surface-elevated hover:ambient-shadow ${card.className}`}
                  variants={revealUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true, amount: 0.3}}
                  transition={{delay: index * 0.12}}
                >
                  <div className="mb-8 h-10 w-10 text-gold">{card.icon}</div>
                  <h3 className="font-headline text-lg font-extrabold uppercase tracking-wide">
                    {card.title}
                  </h3>
                  <p className="mt-4 max-w-xs leading-relaxed text-muted">{card.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="specialist" className="intelligence-fold px-8 py-32 md:px-16 lg:px-24">
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="mb-24 text-center"
              variants={revealUp}
              initial="hidden"
              whileInView="visible"
              viewport={{once: true, amount: 0.35}}
            >
              <p className="mb-6 font-headline text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Why EmeTruth
              </p>
              <h2 className="mb-8 font-headline text-4xl font-extrabold uppercase tracking-tighter md:text-5xl">
                Better Inputs
                <br />
                Better Markets
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted">
                Prediction markets need specialist liquidity. The job is not generic crypto flow
                coverage. It is pricing event risk, openings, and repricing with tighter operational
                feedback loops.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {specialistCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  className={`ambient-shadow fold-card intelligence-panel relative overflow-hidden p-12 ${card.className}`}
                  variants={revealUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true, amount: 0.28}}
                  transition={{delay: index * 0.08}}
                >
                  <div className="absolute top-0 left-0 h-16 w-1 bg-gold" />
                  <h3
                    className={`mb-6 font-headline text-xl font-extrabold uppercase ${card.titleClassName}`}
                  >
                    {card.title}
                  </h3>
                  <p className={`${card.bodyClassName} leading-relaxed`}>{card.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="proof" className="px-8 py-32 md:px-16 lg:px-24">
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="mb-20 max-w-3xl"
              variants={revealUp}
              initial="hidden"
              whileInView="visible"
              viewport={{once: true, amount: 0.3}}
            >
              <p className="mb-6 font-headline text-xs font-bold uppercase tracking-[0.2em] text-gold">
                Execution Engine
              </p>
              <h2 className="mb-8 font-headline text-4xl font-extrabold uppercase tracking-tighter md:text-5xl">
                Engine
                <br />
                In Use
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-muted">
                The engine is already live, built for fast execution, and keeps activity private
                until committed. It has already carried real volume in market. We will expand public
                proof over time, but the operating posture is already live.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {proofCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  className="ambient-shadow fold-card relative overflow-hidden bg-surface-elevated p-12"
                  variants={revealUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true, amount: 0.28}}
                  transition={{delay: index * 0.08}}
                >
                  <div className="absolute top-0 left-0 h-16 w-1 bg-gold" />
                  <h3 className="mb-6 font-headline text-xl font-extrabold uppercase">
                    {card.title}
                  </h3>
                  <p className="leading-relaxed text-muted">{card.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="lps" className="second-fold relative px-8 py-28 md:px-16 lg:px-24">
          <div className="second-fold__veil" aria-hidden="true" />
          <motion.div
            className="ambient-shadow fold-card relative mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 p-12 md:grid-cols-[1.35fr_0.65fr]"
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, amount: 0.3}}
          >
            <div className="absolute top-0 left-0 h-20 w-1 bg-gold" />
            <div>
              <p className="mb-6 font-headline text-xs font-bold uppercase tracking-[0.2em] text-gold">
                For LPs
              </p>
              <h2 className="mb-6 font-headline text-4xl font-extrabold uppercase tracking-tighter md:text-5xl">
                Selective Capital
                <br />
                Partners
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-muted">
                We are open to selective conversations with LPs and strategic capital partners.
                That path stays secondary and handled directly.
              </p>
            </div>
            <div className="flex items-end">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=LP%20Inquiry`}
                className="cta-button inline-flex w-full items-center justify-center rounded-full bg-primary px-10 py-5 font-headline text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-85"
              >
                Inquire As An LP
              </a>
            </div>
          </motion.div>
        </section>

        <section id="contact" className="px-8 py-36 md:px-16 lg:px-24">
          <motion.div
            className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr]"
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, amount: 0.3}}
          >
            <div className="space-y-8">
              <div>
                <p className="mb-6 font-headline text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  Contact
                </p>
                <h2 className="mb-6 font-headline text-5xl leading-[0.92] font-extrabold uppercase tracking-tighter md:text-7xl">
                  Talk To
                  <br />
                  EmeTruth
                </h2>
                <p className="max-w-xl text-lg leading-relaxed text-muted">
                  Reach out if you run a prediction market, are launching one, or want to discuss a
                  specialist liquidity program.
                </p>
              </div>
              <div className="fold-card space-y-6 p-10">
                <div>
                  <h3 className="font-headline text-xl font-extrabold uppercase tracking-wide">
                    Direct Contact
                  </h3>
                  <p className="mt-3 text-muted">
                    Email us directly at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-4">{CONTACT_EMAIL}</a>.
                  </p>
                </div>
                <div>
                  <h3 className="font-headline text-xl font-extrabold uppercase tracking-wide">
                    Schedule
                  </h3>
                  <p className="mt-3 text-muted">
                    Use the scheduling link for intro calls. If Calendly is not live yet, this opens a direct email request.
                  </p>
                </div>
                <a
                  href={scheduleHref}
                  target={CALENDLY_URL ? '_blank' : undefined}
                  rel={CALENDLY_URL ? 'noreferrer' : undefined}
                  className="secondary-button inline-flex min-h-14 items-center justify-center px-8 py-4 font-headline text-xs font-bold uppercase tracking-widest text-primary"
                >
                  Schedule Intro Call
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="fold-card space-y-6 p-10">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="form-label">Name</span>
                  <input required name="name" type="text" className="form-input" />
                </label>
                <label className="space-y-2">
                  <span className="form-label">Work Email</span>
                  <input required name="email" type="email" className="form-input" />
                </label>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="form-label">Company</span>
                  <input required name="company" type="text" className="form-input" />
                </label>
                <label className="space-y-2">
                  <span className="form-label">Inquiry Type</span>
                  <select required name="interest" className="form-input">
                    <option value="">Select one</option>
                    <option value="Operator Inquiry">Operator inquiry</option>
                    <option value="Launch Support">Launch support</option>
                    <option value="LP Inquiry">LP inquiry</option>
                    <option value="General">General</option>
                  </select>
                </label>
              </div>
              <label className="space-y-2">
                <span className="form-label">What are you working on?</span>
                <textarea
                  required
                  name="message"
                  rows={6}
                  className="form-input min-h-40 resize-y"
                  placeholder="Tell us about the market, launch timeline, liquidity issues, or what you want to improve."
                />
              </label>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cta-button rounded-full bg-gold px-10 py-5 font-headline text-xs font-bold uppercase tracking-widest text-primary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
                <p className="max-w-sm text-sm leading-relaxed text-muted">
                  {CONTACT_FORM_ENDPOINT
                    ? 'Submissions send directly through the contact endpoint.'
                    : 'Until a form backend is configured, submit opens a prefilled email draft.'}
                </p>
              </div>
              {formStatus.type !== 'idle' ? (
                <p
                  className={`text-sm ${formStatus.type === 'error' ? 'text-red-700' : 'text-green-700'}`}
                  aria-live="polite"
                >
                  {formStatus.message}
                </p>
              ) : null}
            </form>
          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 flex flex-col items-center justify-between gap-8 bg-surface-elevated px-8 py-12 md:flex-row md:px-16 lg:px-24">
        <div className="flex items-center gap-3 font-headline text-lg font-extrabold uppercase tracking-tighter">
          <img src="/emetruth-mark.png" alt="" className="h-8 w-8 rounded-lg object-cover" />
          <span>EmeTruth</span>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a
            href="/privacy.html"
            className="font-headline text-[10px] font-bold uppercase tracking-widest text-muted transition-colors hover:text-gold"
          >
            Privacy Policy
          </a>
          <a
            href="/terms.html"
            className="font-headline text-[10px] font-bold uppercase tracking-widest text-muted transition-colors hover:text-gold"
          >
            Terms of Service
          </a>
          <a
            href="/disclosures.html"
            className="font-headline text-[10px] font-bold uppercase tracking-widest text-muted transition-colors hover:text-gold"
          >
            Regulatory Disclosures
          </a>
          <a
            href="#contact"
            className="font-headline text-[10px] font-bold uppercase tracking-widest text-muted transition-colors hover:text-gold"
          >
            Contact
          </a>
        </div>
        <div className="font-headline text-[10px] font-bold uppercase tracking-widest text-muted/50">
          © 2026 EmeTruth. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
