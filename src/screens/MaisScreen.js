import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { PALETTES, FONT_SCALES } from '../styles/theme';
import { EVENTO_INFO, MAPA_CAMPUS_ESPACOS } from '../data/mockData';

export default function MaisScreen() {
  const {
    palette,
    themeMode,
    setThemeMode,
    fontScaleId,
    setFontScale,
    fs,
    notificationsEnabled,
    toggleNotifications,
    lastSync,
    isSyncing,
    forcarSincronizacao,
    resetarCache,
  } = useApp();

  const [painelAberto, setPainelAberto] = useState('configuracoes');

  const alternarPainel = (chave) => {
    setPainelAberto(painelAberto === chave ? '' : chave);
  };

  const dataSyncFormatada = lastSync
    ? new Date(lastSync).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : 'Agora';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Mapa do Campus (Fiel à Tela 6 do Infográfico) */}
      <TouchableOpacity
        style={[
          styles.menuItem,
          {
            backgroundColor: palette.surfaceElevated,
            borderColor: painelAberto === 'mapa' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => alternarPainel('mapa')}
        activeOpacity={0.85}
      >
        <View style={[styles.iconBox, { backgroundColor: palette.primaryMuted }]}>
          <Ionicons name="location-outline" size={22} color={palette.primary} />
        </View>
        <View style={styles.menuTextCol}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Mapa do Campus
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Localização dos espaços
          </Text>
        </View>
        <Ionicons
          name={painelAberto === 'mapa' ? 'chevron-down' : 'chevron-forward'}
          size={20}
          color={palette.textSecondary}
        />
      </TouchableOpacity>

      {painelAberto === 'mapa' ? (
        <View style={[styles.panelBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.panelHeaderLabel, { color: palette.primary, fontSize: fs(11) }]}>
            GUIA DE LOCALIZAÇÃO — IFPI CAMPUS FLORIANO
          </Text>
          {MAPA_CAMPUS_ESPACOS.map((espaco) => (
            <View key={espaco.id} style={[styles.mapCard, { borderColor: palette.border }]}>
              <View style={styles.mapTitleRow}>
                <Ionicons name="navigate-circle" size={18} color={palette.primary} />
                <Text style={[styles.mapSpaceName, { color: palette.text, fontSize: fs(14) }]}>
                  {espaco.nome}
                </Text>
              </View>
              <Text style={[styles.mapBlockText, { color: palette.primary, fontSize: fs(12) }]}>
                {espaco.bloco} • {espaco.coordenadaRef}
              </Text>
              <Text style={[styles.mapActivityText, { color: palette.textSecondary, fontSize: fs(12) }]}>
                Atividades: {espaco.atividades}
              </Text>
              <Text style={[styles.mapCapText, { color: palette.textMuted, fontSize: fs(11) }]}>
                ♿ {espaco.capacidade}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* 2. Informações Gerais */}
      <TouchableOpacity
        style={[
          styles.menuItem,
          {
            backgroundColor: palette.surfaceElevated,
            borderColor: painelAberto === 'info' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => alternarPainel('info')}
        activeOpacity={0.85}
      >
        <View style={[styles.iconBox, { backgroundColor: palette.primaryMuted }]}>
          <Ionicons name="information-circle-outline" size={22} color={palette.primary} />
        </View>
        <View style={styles.menuTextCol}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Informações Gerais
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Sobre o evento e o IFPI
          </Text>
        </View>
        <Ionicons
          name={painelAberto === 'info' ? 'chevron-down' : 'chevron-forward'}
          size={20}
          color={palette.textSecondary}
        />
      </TouchableOpacity>

      {painelAberto === 'info' ? (
        <View style={[styles.panelBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.infoParagraph, { color: palette.text, fontSize: fs(13) }]}>
            A <Text style={{ fontWeight: '800' }}>{EVENTO_INFO.titulo}</Text> do{' '}
            <Text style={{ fontWeight: '800' }}>{EVENTO_INFO.instituicao}</Text> acontece de{' '}
            <Text style={{ color: palette.primary, fontWeight: '800' }}>{EVENTO_INFO.periodo}</Text>,
            reunindo estudantes, professores, pesquisadores e profissionais da construção civil.
          </Text>
          <View style={[styles.certBox, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}>
            <Ionicons name="ribbon-outline" size={20} color={palette.accentGold} />
            <Text style={[styles.certText, { color: palette.text, fontSize: fs(12) }]}>
              Certificação Oficial de <Text style={{ fontWeight: '800' }}>{EVENTO_INFO.cargaHorariaCertificado}</Text> emitida pelo SUAP/IFPI para participantes com frequência mínima de 75%.
            </Text>
          </View>
        </View>
      ) : null}

      {/* 3. Contato */}
      <TouchableOpacity
        style={[
          styles.menuItem,
          {
            backgroundColor: palette.surfaceElevated,
            borderColor: painelAberto === 'contato' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => alternarPainel('contato')}
        activeOpacity={0.85}
      >
        <View style={[styles.iconBox, { backgroundColor: palette.primaryMuted }]}>
          <Ionicons name="call-outline" size={22} color={palette.primary} />
        </View>
        <View style={styles.menuTextCol}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Contato
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Organização e suporte
          </Text>
        </View>
        <Ionicons
          name={painelAberto === 'contato' ? 'chevron-down' : 'chevron-forward'}
          size={20}
          color={palette.textSecondary}
        />
      </TouchableOpacity>

      {painelAberto === 'contato' ? (
        <View style={[styles.panelBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={18} color={palette.primary} />
            <Text style={[styles.contactText, { color: palette.text, fontSize: fs(13) }]}>
              {EVENTO_INFO.emailContato}
            </Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={18} color={palette.primary} />
            <Text style={[styles.contactText, { color: palette.text, fontSize: fs(13) }]}>
              {EVENTO_INFO.telefoneContato} (Coordenação de Engenharia Civil)
            </Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="logo-instagram" size={18} color={palette.primary} />
            <Text style={[styles.contactText, { color: palette.text, fontSize: fs(13) }]}>
              {EVENTO_INFO.instagram}
            </Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="business-outline" size={18} color={palette.primary} />
            <Text style={[styles.contactText, { color: palette.textSecondary, fontSize: fs(12) }]}>
              {EVENTO_INFO.localGeral}
            </Text>
          </View>
        </View>
      ) : null}

      {/* 4. Notificações */}
      <View
        style={[
          styles.menuItem,
          { backgroundColor: palette.surfaceElevated, borderColor: palette.border },
        ]}
      >
        <View style={[styles.iconBox, { backgroundColor: palette.primaryMuted }]}>
          <Ionicons name="notifications-outline" size={22} color={palette.primary} />
        </View>
        <View style={styles.menuTextCol}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Notificações
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            {notificationsEnabled
              ? 'Ativo para não perder nada (lembretes 15 min antes)'
              : 'Lembretes desativados'}
          </Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: '#334155', true: palette.primary }}
          thumbColor={notificationsEnabled ? '#0d1b2a' : '#cbd5e1'}
        />
      </View>

      {/* 5. Configurações (Tema, Idioma, Acessibilidade e Cache PWA) */}
      <TouchableOpacity
        style={[
          styles.menuItem,
          {
            backgroundColor: palette.surfaceElevated,
            borderColor: painelAberto === 'configuracoes' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => alternarPainel('configuracoes')}
        activeOpacity={0.85}
      >
        <View style={[styles.iconBox, { backgroundColor: palette.primaryMuted }]}>
          <Ionicons name="settings-outline" size={22} color={palette.primary} />
        </View>
        <View style={styles.menuTextCol}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Configurações
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Tema, idioma, acessibilidade
          </Text>
        </View>
        <Ionicons
          name={painelAberto === 'configuracoes' ? 'chevron-down' : 'chevron-forward'}
          size={20}
          color={palette.textSecondary}
        />
      </TouchableOpacity>

      {painelAberto === 'configuracoes' ? (
        <View style={[styles.panelBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          {/* Seletor de Contraste e Tema (Requisito de Acessibilidade da Seção 7) */}
          <Text style={[styles.panelHeaderLabel, { color: palette.primary, fontSize: fs(11) }]}>
            ACESSIBILIDADE VISUAL: TEMA E CONTRASTE DINÂMICO
          </Text>
          <View style={styles.optionsGroup}>
            {Object.values(PALETTES).map((pal) => {
              const ativo = themeMode === pal.id;
              return (
                <TouchableOpacity
                  key={pal.id}
                  style={[
                    styles.optionPill,
                    {
                      backgroundColor: ativo ? palette.primary : palette.surfaceElevated,
                      borderColor: ativo ? palette.primary : palette.border,
                    },
                  ]}
                  onPress={() => setThemeMode(pal.id)}
                >
                  <Ionicons
                    name={ativo ? 'radio-button-on' : 'radio-button-off'}
                    size={16}
                    color={ativo ? '#0d1b2a' : palette.textSecondary}
                  />
                  <Text
                    style={[
                      styles.optionPillText,
                      { color: ativo ? '#0d1b2a' : palette.text, fontSize: fs(13) },
                    ]}
                  >
                    {pal.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Seletor de Escala de Fonte */}
          <Text
            style={[
              styles.panelHeaderLabel,
              { color: palette.primary, fontSize: fs(11), marginTop: 14 },
            ]}
          >
            TAMANHO DA FONTE AJUSTÁVEL
          </Text>
          <View style={styles.fontScaleRow}>
            {Object.values(FONT_SCALES).map((scale) => {
              const ativo = fontScaleId === scale.id;
              return (
                <TouchableOpacity
                  key={scale.id}
                  style={[
                    styles.fontScaleBtn,
                    {
                      backgroundColor: ativo ? palette.primary : palette.surfaceElevated,
                      borderColor: ativo ? palette.primary : palette.border,
                    },
                  ]}
                  onPress={() => setFontScale(scale.id)}
                >
                  <Text
                    style={[
                      styles.fontScaleBtnText,
                      { color: ativo ? '#0d1b2a' : palette.text, fontSize: fs(12) },
                    ]}
                  >
                    {scale.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Sincronização Offline / Cache AsyncStorage */}
          <Text
            style={[
              styles.panelHeaderLabel,
              { color: palette.primary, fontSize: fs(11), marginTop: 14 },
            ]}
          >
            CACHE OFFLINE (ASYNCSTORAGE / PWA)
          </Text>
          <Text style={[styles.syncStatusText, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Última sincronização local: {dataSyncFormatada} • Funciona sem internet.
          </Text>

          <View style={styles.cacheBtnRow}>
            <TouchableOpacity
              style={[styles.syncBtn, { backgroundColor: palette.primary }]}
              onPress={forcarSincronizacao}
            >
              <Ionicons name="sync" size={16} color="#0d1b2a" />
              <Text style={[styles.syncBtnText, { fontSize: fs(12) }]}>
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Cache'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resetBtn, { borderColor: palette.border, backgroundColor: palette.surfaceElevated }]}
              onPress={resetarCache}
            >
              <Ionicons name="refresh-outline" size={16} color={palette.textSecondary} />
              <Text style={[styles.resetBtnText, { color: palette.textSecondary, fontSize: fs(12) }]}>
                Restaurar Padrão
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* Card Inspiracional Final (Fiel à Tela 6 do Infográfico) */}
      <View style={[styles.quoteBanner, { backgroundColor: '#06101a', borderColor: palette.border }]}>
        <View style={styles.quoteTextWrap}>
          <Text style={[styles.quoteText, { fontSize: fs(16) }]}>
            “Engenharia Civil{'\n'}
            <Text style={{ color: palette.primary }}>é sobre pessoas,</Text>{'\n'}
            projetos e impacto{'\n'}na sociedade.”
          </Text>
          <Text style={[styles.quoteFooter, { fontSize: fs(11) }]}>
            IFPI Campus Floriano • Juntos construímos o futuro
          </Text>
        </View>
        <View style={styles.helmetIllustration}>
          <Ionicons name="construct-outline" size={56} color={palette.primary} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontWeight: '800',
  },
  menuSubtitle: {
    marginTop: 2,
    fontWeight: '500',
  },
  panelBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
    marginTop: -4,
  },
  panelHeaderLabel: {
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 10,
  },
  mapCard: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  mapTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapSpaceName: {
    fontWeight: '800',
    marginLeft: 6,
  },
  mapBlockText: {
    fontWeight: '700',
    marginTop: 3,
  },
  mapActivityText: {
    marginTop: 3,
    lineHeight: 18,
  },
  mapCapText: {
    marginTop: 3,
    fontWeight: '600',
  },
  infoParagraph: {
    lineHeight: 21,
    marginBottom: 12,
  },
  certBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  certText: {
    flex: 1,
    marginLeft: 10,
    lineHeight: 18,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    marginLeft: 10,
    fontWeight: '600',
    flex: 1,
  },
  optionsGroup: {
    marginBottom: 4,
  },
  optionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  optionPillText: {
    fontWeight: '800',
    marginLeft: 8,
  },
  fontScaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fontScaleBtn: {
    width: '32%',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  fontScaleBtnText: {
    fontWeight: '800',
    textAlign: 'center',
  },
  syncStatusText: {
    marginBottom: 10,
  },
  cacheBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  syncBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  syncBtnText: {
    color: '#0d1b2a',
    fontWeight: '800',
    marginLeft: 6,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  resetBtnText: {
    fontWeight: '700',
    marginLeft: 6,
  },
  quoteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  quoteTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  quoteText: {
    color: '#ffffff',
    fontWeight: '800',
    lineHeight: 24,
  },
  quoteFooter: {
    color: '#94a3b8',
    marginTop: 10,
    fontWeight: '600',
  },
  helmetIllustration: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 255, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

