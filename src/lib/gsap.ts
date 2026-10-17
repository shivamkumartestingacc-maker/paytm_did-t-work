import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once. Native browser scrolling is used; no smooth-scroll library hijacks the wheel.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
