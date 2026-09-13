import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LogoShimmerProps {
  width: number;
  height: number;
  reduceMotion: boolean;
}

// A soft diagonal highlight that sweeps across the wordmark every few
// seconds -- the brief's "light streak / shimmer" effect, applied
// directly to the logo itself (the orbital rings carry their own
// smaller version of this via their highlight dots -- see
// OrbitalRings.tsx). Clipped tightly to the logo's own bounding box, so
// it reads as a shine passing over the mark rather than a separate
// decoration.
export default function LogoShimmer({ width, height, reduceMotion }: LogoShimmerProps) {
  const sweep = useRef(new Animated.Value(0)).current;
  const bandWidth = width * 0.5;
  const bandHeight = height * 3;

  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(1250),
        Animated.timing(sweep, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(sweep, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.delay(3400),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion]);

  if (reduceMotion) return null;

  const travel = width + bandWidth;
  const translateX = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-travel / 2, travel / 2],
  });

  return (
    <View pointerEvents="none" style={[styles.clip, { width, height }]}>
      <Animated.View
        style={[
          styles.band,
          {
            width: bandWidth,
            height: bandHeight,
            left: width / 2 - bandWidth / 2,
            top: height / 2 - bandHeight / 2,
            transform: [{ translateX }, { rotate: '18deg' }],
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { position: 'absolute', top: 0, left: 0, overflow: 'hidden' },
  band: { position: 'absolute' },
});
