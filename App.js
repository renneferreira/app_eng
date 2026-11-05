import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { AppProvider, useApp } from './src/context/AppContext';

// Importação das 6 Telas Principais (Guia .md + Infográfico Oficial)
import HomeScreen from './src/screens/HomeScreen';
import ProgramacaoScreen from './src/screens/ProgramacaoScreen';
import PalestrantesScreen from './src/screens/PalestrantesScreen';
import MinicursosScreen from './src/screens/MinicursosScreen';
import OlimpiadasScreen from './src/screens/OlimpiadasScreen';
import MaisScreen from './src/screens/MaisScreen';

const Tab = createBottomTabNavigator();

function MainNavigator() {
  const { palette, themeMode, setThemeMode, fontScaleId, setFontScale, fs } = useApp();

  const ciclarFonte = () => {
    if (fontScaleId === 'normal') setFontScale('large');
    else if (fontScaleId === 'large') setFontScale('xlarge');
    else setFontScale('normal');
  };

  const ciclarContraste = () => {
    if (themeMode === 'dark') setThemeMode('highContrast');
    else if (themeMode === 'highContrast') setThemeMode('light');
    else setThemeMode('dark');
  };

  return (
    <NavigationContainer>
      <StatusBar style={themeMode === 'light' ? 'dark' : 'light'} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: palette.headerBg,
            borderBottomWidth: 1,
            borderBottomColor: palette.border,
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: fs(17),
          },
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[styles.a11yButton, { borderColor: palette.primary }]}
                onPress={ciclarFonte}
                accessibilityLabel="Alternar tamanho da fonte"
              >
                <Text style={[styles.a11yBtnText, { color: palette.primary }]}>
                  A+
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.a11yButton, { borderColor: palette.primary }]}
                onPress={ciclarContraste}
                accessibilityLabel="Alternar alto contraste e tema"
              >
                <Ionicons name="contrast" size={16} color={palette.primary} />
              </TouchableOpacity>
            </View>
          ),
          tabBarStyle: {
            backgroundColor: palette.headerBg,
            paddingBottom: 6,
            paddingTop: 6,
            height: 64,
            borderTopColor: palette.border,
          },
          tabBarActiveTintColor: '#00ffcc',
          tabBarInactiveTintColor: '#88a8c8',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'ellipse';
            if (route.name === 'Início') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Programação') iconName = focused ? 'calendar' : 'calendar-outline';
            else if (route.name === 'Palestrantes') iconName = focused ? 'people' : 'people-outline';
            else if (route.name === 'Minicursos') iconName = focused ? 'book' : 'book-outline';
            else if (route.name === 'Olimpíadas') iconName = focused ? 'trophy' : 'trophy-outline';
            else if (route.name === 'Mais') iconName = focused ? 'menu' : 'menu-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Início"
          component={HomeScreen}
          options={{ title: 'Início' }}
        />
        <Tab.Screen
          name="Programação"
          component={ProgramacaoScreen}
          options={{ title: 'Programação' }}
        />
        <Tab.Screen
          name="Palestrantes"
          component={PalestrantesScreen}
          options={{ title: 'Palestrantes' }}
        />
        <Tab.Screen
          name="Minicursos"
          component={MinicursosScreen}
          options={{ title: 'Minicursos' }}
        />
        <Tab.Screen
          name="Olimpíadas"
          component={OlimpiadasScreen}
          options={{ title: 'Olimpíadas' }}
        />
        <Tab.Screen
          name="Mais"
          component={MaisScreen}
          options={{ title: 'Mais' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  a11yButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  a11yBtnText: {
    fontWeight: '900',
    fontSize: 12,
  },
});

