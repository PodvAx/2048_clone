import { DotLottie } from "@lottiefiles/dotlottie-web";

const SWIPES_PATH =
  "https://lottie.host/eb3886c4-cdf4-4b3b-a684-270e56c2ac6b/fs03vzzBv1.lottie";
const ARROWS_PATH =
  "https://lottie.host/faad9686-d0e9-480b-a729-36159d6476dd/WfFbSC8L9V.lottie";

const ID_LOTTIE_CANVAS = "lottie-canvas";

const lottieContainer = document.querySelector("#" + ID_LOTTIE_CANVAS);
let animationDotLottie = null;

// Check if the device is mobile and return the path to the animation
function getAnimationPath() {
  const isMobile =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches;

  return isMobile ? SWIPES_PATH : ARROWS_PATH;
}

// Create a new DotLottie instance and play the animation
export function updateAnimation() {
  if (animationDotLottie) {
    animationDotLottie.destroy();
  }

  animationDotLottie = new DotLottie({
    loop: true,
    speed: 1,
    canvas: lottieContainer,
    src: getAnimationPath(),
  });

  animationDotLottie.addEventListener("load", () => {
    animationDotLottie.play();
  });
}

export function stopAnimation() {
  if (animationDotLottie) {
    animationDotLottie.stop();
  }
}
