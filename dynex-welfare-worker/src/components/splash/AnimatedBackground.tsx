import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { splashColors } from '../../theme';
import LightWave from './LightWave';

interface ParticleSpec {
  top: `${number}%`;
  left: `${number}%`;
  size: number;
  delay: number;
}

// A handful of tiny, slow, low-opacity dots -- just enough to read as
// depth in the negative space, not a starfield.
const PARTICLES: ParticleSpec[] = [
  { top: '18%', left: '22%', size: 3, delay: 0 },
  { top: '30%', left: '78%', size: 2, delay: 900 },
  { top: '58%', left: '12%', size: 2.5, delay: 400 },
  { top: '70%', left: '85%', size: 3, delay: 1300 },
  { top: '45%', left: '50%', size: 2, delay: 1800 },
  { top: '82%', left: '35%', size: 2.5, delay: 700 },
];

function Particle({ top, left, size, delay, reduceMotion }: ParticleSpec & { reduceMotion: boolean }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.6, duration: 1800, delay, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: splashColors.white,
        opacity,
      }}
    />
  );
}

// Full-screen gradient ground plus the two curved "light wave" bands and
// a few background particles. Everything here is decorative and inert
// (pointerEvents="none") so it never intercepts touches meant for the
// app underneath once the splash starts fading out.
export default function AnimatedBackground({ reduceMotion }: { reduceMotion: boolean }) {
  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shift, { toValue: 1, duration: 5000, delay: 400, useNativeDriver: true }),
        Animated.timing(shift, { toValue: 0, duration: 5000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion]);

  const overlayOpacity = shift.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.38] });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[splashColors.navy, splashColors.midnight, splashColors.royal, splashColors.blueGray]}
        locations={[0, 0.42, 0.78, 1]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Slow "living light" -- a second soft diagonal gradient whose
          opacity breathes, standing in for a moving gradient without
          needing to animate the gradient's own color stops. */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: reduceMotion ? 0.18 : overlayOpacity }]}
      >
        <LinearGradient
          colors={['transparent', splashColors.cobalt, 'transparent']}
          locations={[0.2, 0.55, 0.9]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <LightWave
        colors={[splashColors.cobalt, 'transparent'] as const}
        size={340}
        top={-160}
        left={-140}
        rotation="35deg"
        reduceMotion={reduceMotion}
        driftDelayMs={0}
      />
      <LightWave
        colors={['transparent', splashColors.champagne, splashColors.cobalt] as const}
        size={300}
        bottom={-180}
        right={-120}
        rotation="-28deg"
        reduceMotion={reduceMotion}
        driftDelayMs={1200}
      />

      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} reduceMotion={reduceMotion} />
      ))}
    </View>
  );
}
