import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { splashColors } from '../../theme';

// Must match LogoGlow's `STAGE_SIZE` / DynexSplashScreen's stage size.
const STAGE_SIZE = 340;

interface RingSpec {
  size: number;
  borderColor: string;
  borderWidth: number;
  opacity: number;
  durationMs: number;
  clockwise: boolean;
  // A tiny bright dot riding the ring itself -- rotates for free along
  // with the ring's own transform, which is what gives the "light
  // streak traveling around the orbit" effect the brief asks for,
  // without needing a masked/animated gradient arc.
  highlight?: { color: string; size: number; opacity: number };
}

const RINGS: RingSpec[] = [
  {
    // Outer ring: slow clockwise rotation, carries the blue-white streak.
    size: 232,
    borderColor: splashColors.cobalt,
    borderWidth: 1.5,
    opacity: 0.24,
    durationMs: 10000,
    clockwise: true,
    highlight: { color: splashColors.white, size: 7, opacity: 0.9 },
  },
  {
    // Middle ring: slower counter-clockwise, occasional warm accent.
    size: 188,
    borderColor: splashColors.blueGray,
    borderWidth: 1.25,
    opacity: 0.18,
    durationMs: 15000,
    clockwise: false,
    highlight: { color: splashColors.champagne, size: 5, opacity: 0.6 },
  },
  {
    // Inner ring: noticeably calmer than the other two -- supports the
    // logo instead of competing with it.
    size: 148,
    borderColor: splashColors.white,
    borderWidth: 1,
    opacity: 0.15,
    durationMs: 20000,
    clockwise: true,
  },
];

function Ring({
  spec,
  reduceMotion,
  entrance,
}: {
  spec: RingSpec;
  reduceMotion: boolean;
  entrance: Animated.Value;
}) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: spec.durationMs,
        useNativeDriver: true,
        isInteraction: false,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion]);

  const deg = spin.interpolate({
    inputRange: [0, 1],
    outputRange: spec.clockwise ? ['0deg', '360deg'] : ['360deg', '0deg'],
  });

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          top: (STAGE_SIZE - spec.size) / 2,
          left: (STAGE_SIZE - spec.size) / 2,
          width: spec.size,
          height: spec.size,
          borderRadius: spec.size / 2,
          borderWidth: spec.borderWidth,
          borderColor: spec.borderColor,
          opacity: Animated.multiply(entrance, spec.opacity),
          transform: [{ rotate: reduceMotion ? '0deg' : deg }],
        },
      ]}
    >
      {spec.highlight ? (
        <View
          style={{
            position: 'absolute',
            top: -spec.highlight.size / 2,
            left: spec.size / 2 - spec.borderWidth - spec.highlight.size / 2,
            width: spec.highlight.size,
            height: spec.highlight.size,
            borderRadius: spec.highlight.size / 2,
            backgroundColor: spec.highlight.color,
            opacity: spec.highlight.opacity,
          }}
        />
      ) : null}
    </Animated.View>
  );
}

// Two to three concentric rings orbiting the logo, each at a different
// speed/direction/opacity per the brief. Kept thin and low-opacity
// throughout -- they're meant to be felt more than seen.
export default function OrbitalRings({ reduceMotion }: { reduceMotion: boolean }) {
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 900,
      delay: 250,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {RINGS.map((spec, i) => (
        <Ring key={i} spec={spec} reduceMotion={reduceMotion} entrance={entrance} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ring: {
    position: 'absolute',
  },
});
