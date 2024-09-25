import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  BackdropBlur,
  Blur,
  BlurMask,
  Canvas,
  Fill,
  Group,
  Path,
  RadialGradient,
  rect,
  Rect,
  RoundedRect,
  rrect,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: WindowWidth, height: WindowHeight } = Dimensions.get('window');

type BlurredCardProps = {
  blurredProgress: SharedValue<number>;
};
const BlurredCard = ({ blurredProgress }: BlurredCardProps) => {
  const clipPath = useMemo(() => {
    const skPath = Skia.Path.Make();
    const x = WindowWidth / 2 - 150;
    const y = WindowHeight / 2 - 100;
    const width = 300;
    const height = 200;
    const r = 20;
    skPath.addRRect(rrect(rect(x, y, width, height), r, r));
    return skPath;
  }, []);

  const blur = useDerivedValue(() => {
    return 5 * blurredProgress.value;
  });

  return (
    <Group>
      <Path path={clipPath} color={'rgba(255, 255, 255, 0.1)'} />
      <Path
        path={clipPath}
        style={'stroke'}
        strokeWidth={2}
        opacity={blurredProgress}
        color={'rgba(255, 255, 255, 0.2)'}
      />
      <BackdropBlur blur={blur} clip={clipPath} />
    </Group>
  );
};

const App = () => {
  const progress = useSharedValue(0);

  return (
    <View
      style={styles.container}
      onTouchStart={() => {
        progress.value = withTiming(1, {
          duration: 1000,
        });
      }}
      onTouchEnd={() => {
        progress.value = withTiming(0, {
          duration: 1000,
        });
      }}>
      <StatusBar style="light" />
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} width={WindowWidth} height={WindowHeight}>
          <RadialGradient
            c={vec(WindowWidth / 2, WindowHeight / 2)}
            r={Math.min(WindowWidth, WindowHeight) / 2}
            colors={['violet', 'black']}
          />
          <Blur blur={100} />
        </Rect>
        {new Array(5).fill(0).map((_, index) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const transform = useDerivedValue(() => {
            return [
              {
                rotate: (-Math.PI / 2) * progress.value,
              },
              {
                translateX: 25 * index * progress.value,
              },
              { perspective: 10000 },
              {
                rotateY: (Math.PI / 3) * progress.value,
              },
              {
                rotate: (Math.PI / 4) * progress.value,
              },
            ];
          });

          return (
            <Group
              key={index}
              origin={vec(WindowWidth / 2, WindowHeight / 2)}
              transform={transform}>
              <BlurredCard blurredProgress={progress} />
            </Group>
          );
        })}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  canvas: {
    flex: 1,
  },
});

export { App };
