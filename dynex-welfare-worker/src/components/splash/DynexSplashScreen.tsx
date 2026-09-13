import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, View } from 'react-native';
import * as SplashScreenNative from 'expo-splash-screen';
import { splashColors } from '../../theme';
import AnimatedBackground from './AnimatedBackground';
import LogoGlow from './LogoGlow';
import LogoShimmer from './LogoShimmer';
import OrbitalRings from './OrbitalRings';
import SplashTransition from './SplashTransition';

// How long the animated splash stays up at minimum, so a fast network
// doesn't skip the brand moment entirely. Actual hand-off also waits for
// `ready` -- see the component doc below.
const MIN_DISPLAY_MS = 2500;
const MIN_DISPLAY_MS_REDUCED_MOTION = 700;

// Fixed square "stage" that LogoGlow, OrbitalRings and the logo image all
// center themselves within, so they share one exact center point
// regardless of device size. Keep this in sync with the STAGE_SIZE
// constants in LogoGlow.tsx and OrbitalRings.tsx.
const STAGE_SIZE = 340;

// Native asset is 1900x407; keep that exact aspect ratio so the logo is
// never stretched or distorted.
const LOGO_WIDTH = 210;
const LOGO_HEIGHT = LOGO_WIDTH / (1900 / 407);

interface DynexSplashScreenProps {
  // Whether the app has actually finished its own startup work
  // (language + auth state resolved -- see RootNavigator). The splash
  // waits for both this AND its own minimum on-screen time before
  // handing off, so a slow network doesn't cut the animation short and a
  // fast one doesn't skip the brand moment entirely.
  ready: boolean;
  onFinish: () => void;
}

export default function DynexSplashScreen({ ready, onFinish }: DynexSplashScreenProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [exiting, setExiting] = useState(false);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;

  // Respect the OS "Reduce Motion" setting, live -- not just at launch.
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduceMotion(value);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (value) => {
      setReduceMotion(value);
    });
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  // The native (pre-JS) splash shows the same navy background + white
  // wordmark configured in app.json, so hiding it as soon as this
  // component has mounted (and painted the identical-looking JS splash
  // underneath) is a seamless hand-off with no flash.
  useEffect(() => {
    SplashScreenNative.hideAsync().catch(() => {
      // Safe to ignore -- e.g. already hidden, or running on web.
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => setMinTimeElapsed(true),
      reduceMotion ? MIN_DISPLAY_MS_REDUCED_MOTION : MIN_DISPLAY_MS
    );
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  // Logo entrance: starts slightly smaller/transparent, settles in by
  // ~900ms. Runs the same way under reduced motion (a plain fade/scale-in
  // is an allowed "simple" transition, per the brief's accessibility note).
  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 550,
        delay: 350,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 55,
        delay: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (ready && minTimeElapsed) setExiting(true);
  }, [ready, minTimeElapsed]);

  return (
    <SplashTransition visible={!exiting} onHidden={onFinish} style={styles.root}>
      <AnimatedBackground reduceMotion={reduceMotion} />

      <Animated.View style={styles.stage}>
        <LogoGlow reduceMotion={reduceMotion} />
        <OrbitalRings reduceMotion={reduceMotion} />
        <View style={styles.logo}>
          <Animated.Image
            source={require('../../../assets/dynex-wordmark-white.png')}
            resizeMode="contain"
            style={[styles.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
          />
          <LogoShimmer width={LOGO_WIDTH} height={LOGO_HEIGHT} reduceMotion={reduceMotion} />
        </View>
      </Animated.View>
    </SplashTransition>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: splashColors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  stage: {
    width: STAGE_SIZE,
    height: STAGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
});
