import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Ícone Estilo Apple iOS 18 / visionOS Dark Glass
 * Possui geometria squircle, camada translúcida escura, borda especular
 * e reflexo superior sutil (specular highlight), sem uso de emojis.
 */
export function DarkGlassIcon({
  name,
  size = 20,
  boxSize = 42,
  borderRadius = 12,
  accentColor = '#00ffcc',
  glassBg = 'rgba(10, 22, 38, 0.78)',
  borderColor = 'rgba(0, 255, 204, 0.28)',
  active = false,
  style,
}) {
  const effectiveBg = active ? accentColor : glassBg;
  const effectiveBorder = active ? accentColor : borderColor;
  const effectiveIconColor = active ? '#06101a' : accentColor;

  return (
    <View
      style={[
        styles.squircleBase,
        {
          width: boxSize,
          height: boxSize,
          borderRadius,
          backgroundColor: effectiveBg,
          borderColor: effectiveBorder,
          shadowColor: accentColor,
        },
        style,
      ]}
    >
      {/* Reflexo especular superior estilo Apple Dark Glass */}
      <View
        style={[
          styles.specularTop,
          {
            borderTopLeftRadius: Math.max(2, borderRadius - 2),
            borderTopRightRadius: Math.max(2, borderRadius - 2),
            backgroundColor: active
              ? 'rgba(255, 255, 255, 0.35)'
              : 'rgba(255, 255, 255, 0.12)',
          },
        ]}
      />
      {/* Halo interno translúcido */}
      {!active ? (
        <View
          style={[
            styles.innerGlow,
            {
              width: boxSize - 10,
              height: boxSize - 10,
              borderRadius: Math.max(4, borderRadius - 4),
              backgroundColor: `${accentColor}14`,
            },
          ]}
        />
      ) : null}
      <Ionicons name={name} size={size} color={effectiveIconColor} />
    </View>
  );
}

/**
 * Pílula de Metadados / Botão em Estilo Apple Dark Glass
 */
export function DarkGlassPill({
  icon,
  label,
  accentColor = '#00ffcc',
  textColor = '#e2e8f0',
  glassBg = 'rgba(10, 22, 38, 0.72)',
  borderColor = 'rgba(148, 163, 184, 0.22)',
  fontSize = 11,
  onPress,
  rightIcon,
  style,
}) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.pillContainer,
        {
          backgroundColor: glassBg,
          borderColor,
        },
        style,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={fontSize + 2}
          color={accentColor}
          style={styles.pillLeftIcon}
        />
      ) : null}
      <Text style={[styles.pillLabel, { color: textColor, fontSize }]}>{label}</Text>
      {rightIcon ? (
        <Ionicons
          name={rightIcon}
          size={fontSize + 1}
          color={accentColor}
          style={styles.pillRightIcon}
        />
      ) : null}
    </Wrapper>
  );
}

/**
 * Card Oficial do Desenvolvedor em Estilo Apple Dark Glass
 * Inclui Rennê Santos e o Instagram @oxe.renne com ícone do Instagram.
 */
export function DeveloperGlassCard({ palette, fs, compact = false }) {
  const abrirInstagramDev = () => {
    Linking.openURL('https://instagram.com/oxe.renne').catch(() => {});
  };

  return (
    <View
      style={[
        styles.devGlassCard,
        {
          backgroundColor: palette.glassCard || 'rgba(8, 18, 32, 0.86)',
          borderColor: palette.glassBorder || 'rgba(0, 255, 204, 0.26)',
          padding: compact ? 14 : 18,
        },
      ]}
    >
      <View style={styles.devSpecularLine} />

      <View style={styles.devTopRow}>
        <DarkGlassIcon
          name="code-slash-outline"
          size={compact ? 18 : 22}
          boxSize={compact ? 38 : 46}
          borderRadius={compact ? 11 : 14}
          accentColor={palette.primary}
          glassBg="rgba(0, 255, 204, 0.10)"
          borderColor="rgba(0, 255, 204, 0.32)"
        />

        <View style={styles.devInfoCol}>
          <View style={styles.devEyebrowRow}>
            <Ionicons name="hardware-chip-outline" size={12} color={palette.primary} />
            <Text style={[styles.devEyebrow, { color: palette.primary, fontSize: fs(10) }]}>
              DESENVOLVEDOR & ARQUITETURA DO APP
            </Text>
          </View>
          <Text style={[styles.devName, { color: palette.text, fontSize: fs(compact ? 15 : 17) }]}>
            Rennê Santos
          </Text>
          <Text
            style={[
              styles.devRole,
              { color: palette.textSecondary, fontSize: fs(11) },
            ]}
          >
            Engenharia de Software • Design System Dark Glass PWA
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.instaGlassButton,
          {
            backgroundColor: 'rgba(15, 28, 46, 0.92)',
            borderColor: 'rgba(0, 255, 204, 0.35)',
          },
        ]}
        onPress={abrirInstagramDev}
        activeOpacity={0.82}
        accessibilityRole="link"
        accessibilityLabel="Abrir Instagram do desenvolvedor Rennê Santos @oxe.renne"
      >
        <View style={styles.instaLeft}>
          <DarkGlassIcon
            name="logo-instagram"
            size={18}
            boxSize={32}
            borderRadius={9}
            accentColor="#00ffcc"
            glassBg="rgba(0, 255, 204, 0.14)"
            borderColor="rgba(0, 255, 204, 0.38)"
          />
          <View style={styles.instaTextCol}>
            <Text style={[styles.instaLabel, { color: palette.textSecondary, fontSize: fs(10) }]}>
              INSTAGRAM DO DESENVOLVEDOR
            </Text>
            <Text style={[styles.instaHandle, { color: palette.text, fontSize: fs(13) }]}>
              @oxe.renne
            </Text>
          </View>
        </View>

        <View style={[styles.instaActionBadge, { backgroundColor: palette.primaryMuted, borderColor: palette.primary }]}>
          <Text style={[styles.instaActionText, { color: palette.primary, fontSize: fs(11) }]}>
            Seguir
          </Text>
          <Ionicons name="open-outline" size={13} color={palette.primary} style={{ marginLeft: 4 }} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  squircleBase: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.14)',
      },
    }),
  },
  specularTop: {
    position: 'absolute',
    top: 0,
    left: 2,
    right: 2,
    height: '42%',
  },
  innerGlow: {
    position: 'absolute',
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  pillLeftIcon: {
    marginRight: 5,
  },
  pillRightIcon: {
    marginLeft: 5,
  },
  pillLabel: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  devGlassCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 14,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.10)',
      },
    }),
  },
  devSpecularLine: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  devTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  devInfoCol: {
    flex: 1,
    marginLeft: 12,
  },
  devEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  devEyebrow: {
    fontWeight: '800',
    letterSpacing: 0.8,
    marginLeft: 5,
  },
  devName: {
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  devRole: {
    marginTop: 2,
    fontWeight: '600',
  },
  instaGlassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  instaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  instaTextCol: {
    marginLeft: 10,
  },
  instaLabel: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  instaHandle: {
    fontWeight: '900',
    marginTop: 1,
  },
  instaActionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
    borderWidth: 1,
  },
  instaActionText: {
    fontWeight: '800',
  },
});

