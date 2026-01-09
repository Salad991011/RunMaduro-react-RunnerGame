import { Howl } from "howler";
import { ASSETS } from "../assets/manifest";

type SfxName = keyof typeof ASSETS.sounds;

const cache = new Map<SfxName, Howl>();

function load(name: SfxName, loop = false, volume = 0.8) {
  const src = ASSETS.sounds[name];
  const howl = new Howl({ src: [src], loop, volume });
  cache.set(name, howl);
  return howl;
}

export const AudioBus = {
  play(name: SfxName) {
    let h = cache.get(name);
    if (!h) h = load(name);
    h.play();
  },
  musicOn() {
    let h = cache.get("music");
    if (!h) h = load("music", true, 0.35);
    if (!h.playing()) h.play();
  },
  musicOff() {
    const h = cache.get("music");
    if (h && h.playing()) h.stop();
  },
};
