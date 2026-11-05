import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Linking } from 'react-native';
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

  const abrirInstagramDev = () => {
    Linking.openURL('https://instagram.com/oxe.renne').catch(() => { });
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
            fontSize: fs(16),
            letterSpacing: 0.2,
          },
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[
                  styles.devHeaderPill,
                  {
                    backgroundColor: 'rgba(0, 255, 204, 0.10)',
                    borderColor: 'rgba(0, 255, 204, 0.32)',
                  },
                ]}
                onPress={abrirInstagramDev}
                accessibilityLabel="Desenvolvedor Rennê Santos no Instagram @oxe.renne"
                activeOpacity={0.8}
              >
                <Ionicons name="logo-instagram" size={13} color="#00ffcc" />
                <Text style={styles.devHeaderText}>@oxe.renne</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.a11yButton,
                  {
                    backgroundColor: 'rgba(15, 31, 52, 0.85)',
                    borderColor: 'rgba(0, 255, 204, 0.35)',
                  },
                ]}
                onPress={ciclarFonte}
                accessibilityLabel="Alternar tamanho da fonte"
              >
                <Ionicons name="text-outline" size={13} color="#00ffcc" />
                <Text style={styles.a11yBtnText}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.a11yButton,
                  {
                    backgroundColor: 'rgba(15, 31, 52, 0.85)',
                    borderColor: 'rgba(0, 255, 204, 0.35)',
                  },
                ]}
                onPress={ciclarContraste}
                accessibilityLabel="Alternar alto contraste e tema"
              >
                <Ionicons name="contrast-outline" size={15} color="#00ffcc" />
              </TouchableOpacity>
            </View>
          ),
          tabBarStyle: {
            backgroundColor: palette.headerBg,
            paddingBottom: 6,
            paddingTop: 6,
            height: 66,
            borderTopColor: palette.border,
          },
          tabBarActiveTintColor: '#00ffcc',
          tabBarInactiveTintColor: '#88a8c8',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
          },
          tabBarIcon: ({ focused, color }) => {
            let iconName = 'ellipse-outline';
            if (route.name === 'Início') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Programação') iconName = focused ? 'calendar' : 'calendar-outline';
            else if (route.name === 'Palestrantes') iconName = focused ? 'people' : 'people-outline';
            else if (route.name === 'Minicursos') iconName = focused ? 'layers' : 'layers-outline';
            else if (route.name === 'Olimpíadas') iconName = focused ? 'trophy' : 'trophy-outline';
            else if (route.name === 'Mais') iconName = focused ? 'grid' : 'grid-outline';

            return (
              <View
                style={[
                  styles.tabIconGlass,
                  focused && {
                    backgroundColor: 'rgba(0, 255, 204, 0.14)',
                    borderColor: 'rgba(0, 255, 204, 0.36)',
                  },
                ]}
              >
                <Ionicons name={iconName} size={19} color={color} />
              </View>
            );
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
  devHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginRight: 2,
  },
  devHeaderText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 11,
    marginLeft: 5,
  },
  a11yButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  a11yBtnText: {
    color: '#00ffcc',
    fontWeight: '900',
    fontSize: 11,
    marginLeft: 1,
  },
  tabIconGlass: {
    width: 38,
    height: 28,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
