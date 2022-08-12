import {
  Canvas,
  Group,
  runTiming,
  SweepGradient,
  useTouchHandler,
  useValue,
  vec,
} from '@shopify/react-native-skia';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RoundedItem } from './components/rounded-item';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDING,
  SQUARES_AMOUNT_HORIZONTAL,
  SQUARES_AMOUNT_VERTICAL,
  SQUARE_CONTAINER_SIZE,
  SQUARE_SIZE,
} from './constants';

export default function App() {
  const touchedPoint = useValue<{ x: number; y: number } | null>(null);

  const progress = useValue(0);

  const touchHandler = useTouchHandler({
    onStart: (event) => {
      runTiming(progress, 1, { duration: 300 });
      touchedPoint.current = { x: event.x, y: event.y };
    },
    onActive: (event) => {
      touchedPoint.current = { x: event.x, y: event.y };
    },
    onEnd: () => {
      runTiming(progress, 0, { duration: 300 });
      touchedPoint.current = null;
    },
  });

  return (
    <View style={styles.container}>
      <Canvas
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        }}
        onTouch={touchHandler}
      >
        <Group>
          {new Array(SQUARES_AMOUNT_HORIZONTAL).fill(0).map((_, i) => {
            return new Array(SQUARES_AMOUNT_VERTICAL).fill(0).map((_, j) => {
              return (
                <RoundedItem
                  progress={progress}
                  point={touchedPoint}
                  key={`i${i}-j${j}`}
                  x={i * SQUARE_CONTAINER_SIZE + PADDING / 2}
                  y={j * SQUARE_CONTAINER_SIZE + PADDING / 2}
                  width={SQUARE_SIZE}
                  height={SQUARE_SIZE}
                />
              );
            });
          })}
          <SweepGradient
            c={vec(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)}
            colors={['cyan', 'magenta', 'yellow', 'cyan']}
          />
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
