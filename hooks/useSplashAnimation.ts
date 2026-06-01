import { useEffect } from 'react';
import {
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

interface Props {
  onFinish: () => void;
}

export function useSplashAnimation({
  onFinish,
}: Props) {
  const nScale = useSharedValue(0.5);
  const nOpacity = useSharedValue(0);

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

  useEffect(() => {
    nOpacity.value = withTiming(1, { duration: 600 });
    nScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });

    const timeout = setTimeout(startTextAnimation, 800);

    return () => clearTimeout(timeout);
  }, []);

  return {
    nScale,
    nOpacity,
    textOpacity,
    textY,
    screenOpacity,
  };
}