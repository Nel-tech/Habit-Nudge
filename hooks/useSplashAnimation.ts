import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  useSharedValue,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export function useSplashAnimation({
  onFinish,
}: Props) {
  const nRotation = useSharedValue(25);
  const nScale = useSharedValue(1);

  const stickX = useSharedValue(-80);
  const stickOpacity = useSharedValue(0);

  const legKickAngle = useSharedValue(0);

  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(20);

  const screenOpacity = useSharedValue(1);

  function startExitAnimation() {
    screenOpacity.value = withDelay(
      600,
      withTiming(0, { duration: 400 }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      })
    );
  }

  function startTextAnimation() {
    textOpacity.value = withTiming(1, {
      duration: 500,
    });

    textY.value = withSpring(0, {
      damping: 15,
    });

    setTimeout(startExitAnimation, 1200);
  }

  function kickN() {
    nRotation.value = withSpring(0, {
      damping: 6,
      stiffness: 200,
      mass: 0.8,
    });

    nScale.value = withSequence(
      withTiming(1.15, { duration: 80 }),
      withSpring(1, {
        damping: 8,
        stiffness: 200,
      })
    );

    legKickAngle.value = withSequence(
      withTiming(-60, { duration: 120 }),
      withTiming(0, { duration: 200 })
    );

    stickX.value = withDelay(
      300,
      withTiming(width, {
        duration: 400,
        easing: Easing.in(Easing.quad),
      })
    );

    setTimeout(startTextAnimation, 800);
  }

  useEffect(() => {
    const runInDelay = setTimeout(() => {
      stickOpacity.value = withTiming(1, {
        duration: 100,
      });

      stickX.value = withTiming(
        width / 2 - 60,
        {
          duration: 500,
          easing: Easing.out(Easing.quad),
        },
        (finished) => {
          if (finished) {
            runOnJS(kickN)();
          }
        }
      );
    }, 400);

    return () => clearTimeout(runInDelay);
  }, []);

  return {
    nRotation,
    nScale,
    stickX,
    stickOpacity,
    legKickAngle,
    textOpacity,
    textY,
    screenOpacity,
  };
}