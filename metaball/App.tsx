import { StatusBar, Text, View, useWindowDimensions } from 'react-native';
import React, { useMemo } from 'react';
import {
  Blur,
  Canvas,
  Circle,
  ColorMatrix,
  Group,
  Paint,
  SweepGradient,
  runSpring,
  useValue,
  vec,
} from '@shopify/react-native-skia';
import Touchable, { useGestureHandler } from 'react-native-skia-gesture';

const RADIUS = 80;

export default function App() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const cx = useValue(windowWidth / 2);
  const cy = useValue(windowHeight / 2);

  const gestureHandler = useGestureHandler<{
    x: number;
    y: number;
  }>({
    onStart: (_, context) => {
      context.x = cx.current;
      context.y = cy.current;
    },
    onActive: ({ translationX, translationY }, context) => {
      cx.current = translationX + context.x;
      cy.current = translationY + context.y;
    },
    onEnd: () => {
      runSpring(cx, windowWidth / 2);
      runSpring(cy, windowHeight / 2);
    },
  });

  const layer = useMemo(() => {
    return (
      <Paint>
        {/* pixelOpacity > blurredOpacity * 60 - 30 */}
        <Blur blur={30} />
        <ColorMatrix
          matrix={[
            // R, G, B, A, Bias (Offset)
            // prettier-ignore
            1, 0, 0, 0, 0,
            // prettier-ignore
            0, 1, 0, 0, 0,
            // prettier-ignore
            0, 0, 1, 0, 0,
            // prettier-ignore
            0, 0, 0, 60, -30,
          ]}
        />
      </Paint>
    );
  }, []);

  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <Touchable.Canvas
        style={{
          flex: 1,
          backgroundColor: '#111',
        }}
      >
        <Group layer={layer}>
          <Touchable.Circle {...gestureHandler} cx={cx} cy={cy} r={RADIUS} />
          <Circle cx={windowWidth / 2} cy={windowHeight / 2} r={RADIUS} />
          <SweepGradient c={vec(0, 0)} colors={['cyan', 'magenta', 'cyan']} />
        </Group>
      </Touchable.Canvas>
    </>
  );
}
