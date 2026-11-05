import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { PALETTES, FONT_SCALES } from '../styles/theme';
import { EVENTO_INFO, MAPA_CAMPUS_ESPACOS } from '../data/mockData';
import { DarkGlassIcon, DarkGlassPill, DeveloperGlassCard } from '../components/DarkGlassIcon';

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
      {/* 1. Mapa do Campus com Ícones Estilo Apple Dark Glass */}
      <TouchableOpacity
        style={[
          styles.menuItem,
          {
            backgroundColor: palette.glassCard || palette.surfaceElevated,
            borderColor: painelAberto === 'mapa' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => alternarPainel('mapa')}
        activeOpacity={0.85}
      >
        <DarkGlassIcon
          name="map-outline"
          size={21}
          boxSize={44}
          borderRadius={13}
          accentColor={palette.primary}
          active={painelAberto === 'mapa'}
          style={{ marginRight: 14 }}
        />
        <View style={styles.menuTextCol}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Mapa do Campus
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Localização dos blocos, auditório e laboratórios
          </Text>
        </View>
        <DarkGlassIcon
          name={painelAberto === 'mapa' ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={16}
          boxSize={32}
          borderRadius={10}
          accentColor={painelAberto === 'mapa' ? palette.primary : palette.textSecondary}
          borderColor="rgba(148, 163, 184, 0.25)"
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
                <DarkGlassIcon
                  name={espaco.icone || 'navigate-outline'}
                  size={16}
                  boxSize={32}
                  borderRadius={9}
                  accentColor={palette.primary}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.mapSpaceName, { color: palette.text, fontSize: fs(14) }]}>
                    {espaco.nome}
                  </Text>
                  <Text style={[styles.mapBlockText, { color: palette.primary, fontSize: fs(11) }]}>
                    {espaco.bloco} • {espaco.coordenadaRef}
                  </Text>
                </View>
              </View>
              <Text style={[styles.mapActivityText, { color: palette.textSecondary, fontSize: fs(12) }]}>
                Atividades: {espaco.atividades}
              </Text>
              <View style={styles.mapCapRow}>
                <Ionicons name="accessibility-outline" size={14} color={palette.primary} />
                <Text style={[styles.mapCapText, { color: palette.textMuted, fontSize: fs(11) }]}>
                  {espaco.capacidade}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {/* 2. Informações Gerais */}
      <TouchableOpacity
        style={[
          styles.menuItem,
          {
            backgroundColor: palette.glassCard || palette.surfaceElevated,
            borderColor: painelAberto === 'info' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => alternarPainel('info')}
        activeOpacity={0.85}
      >
        <DarkGlassIcon
          name="information-circle-outline"
          size={21}
          boxSize={44}
          borderRadius={13}
          accentColor="#38bdf8"
          borderColor="rgba(56, 189, 248, 0.35)"
          active={painelAberto === 'info'}
          style={{ marginRight: 14 }}
        />
        <View style={styles.menuTextCol}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Informações Gerais
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Sobre o evento, certificação SUAP e o IFPI
          </Text>
        </View>
        <DarkGlassIcon
          name={painelAberto === 'info' ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={16}
          boxSize={32}
          borderRadius={10}
          accentColor={painelAberto === 'info' ? palette.primary : palette.textSecondary}
          borderColor="rgba(148, 163, 184, 0.25)"
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
            <DarkGlassIcon
              name="ribbon-outline"
              size={18}
              boxSize={36}
              borderRadius={10}
              accentColor={palette.accentGold}
              borderColor="rgba(234, 179, 8, 0.40)"
            />
            <Text style={[styles.certText, { color: palette.text, fontSize: fs(12) }]}>
              Certificação Oficial de <Text style={{ fontWeight: '800' }}>{EVENTO_INFO.cargaHorariaCertificado}</Text> emitida pelo SUAP/IFPI para participantes com frequência mínima de 75%.
            </Text>
          </View>
        </View>
      ) : null}

      {/* 3. Contato e Redes Oficiais */}
      <TouchableOpacity
        style={[
          styles.menuItem,
          {
            backgroundColor: palette.glassCard || palette.surfaceElevated,
            borderColor: painelAberto === 'contato' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => alternarPainel('contato')}
        activeOpacity={0.85}
      >
        <DarkGlassIcon
          name="call-outline"
          size={21}
          boxSize={44}
          borderRadius={13}
          accentColor="#34d399"
          borderColor="rgba(52, 211, 153, 0.35)"
          active={painelAberto === 'contato'}
          style={{ marginRight: 14 }}
        />
        <View style={styles.menuTextCol}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Contato
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Organização, suporte e desenvolvedor
          </Text>
        </View>
        <DarkGlassIcon
          name={painelAberto === 'contato' ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={16}
          boxSize={32}
          borderRadius={10}
          accentColor={painelAberto === 'contato' ? palette.primary : palette.textSecondary}
          borderColor="rgba(148, 163, 184, 0.25)"
        />
      </TouchableOpacity>

      {painelAberto === 'contato' ? (
        <View style={[styles.panelBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View style={styles.contactRow}>
            <DarkGlassIcon name="mail-outline" size={15} boxSize={30} borderRadius={9} accentColor={palette.primary} />
            <Text style={[styles.contactText, { color: palette.text, fontSize: fs(13) }]}>
              {EVENTO_INFO.emailContato}
            </Text>
          </View>
          <View style={styles.contactRow}>
            <DarkGlassIcon name="call-outline" size={15} boxSize={30} borderRadius={9} accentColor={palette.primary} />
            <Text style={[styles.contactText, { color: palette.text, fontSize: fs(13) }]}>
              {EVENTO_INFO.telefoneContato} (Coordenação de Engenharia Civil)
            </Text>
          </View>
          <View style={styles.contactRow}>
            <DarkGlassIcon name="logo-instagram" size={15} boxSize={30} borderRadius={9} accentColor={palette.primary} />
            <Text style={[styles.contactText, { color: palette.text, fontSize: fs(13) }]}>
              Evento: {EVENTO_INFO.instagram}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL('https://instagram.com/oxe.renne').catch(() => {})}
            activeOpacity={0.8}
          >
            <DarkGlassIcon name="logo-instagram" size={15} boxSize={30} borderRadius={9} accentColor="#00ffcc" />
            <Text style={[styles.contactText, { color: palette.primary, fontSize: fs(13), fontWeight: '800' }]}>
              Desenvolvedor: Rennê Santos ({EVENTO_INFO.desenvolvedor.instagram})
            </Text>
          </TouchableOpacity>
          <View style={styles.contactRow}>
            <DarkGlassIcon name="business-outline" size={15} boxSize={30} borderRadius={9} accentColor={palette.primary} />
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
          {
            backgroundColor: palette.glassCard || palette.surfaceElevated,
            borderColor: palette.border,
          },
        ]}
      >
        <DarkGlassIcon
          name="notifications-outline"
          size={21}
          boxSize={44}
          borderRadius={13}
          accentColor="#fbbf24"
          borderColor="rgba(251, 191, 36, 0.35)"
          style={{ marginRight: 14 }}
        />
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
          thumbColor={notificationsEnabled ? '#06101a' : '#cbd5e1'}
        />
      </View>

      {/* 5. Configurações (Tema, Idioma, Acessibilidade e Cache PWA) */}
      <TouchableOpacity
        style={[
          styles.menuItem,
          {
            backgroundColor: palette.glassCard || palette.surfaceElevated,
            borderColor: painelAberto === 'configuracoes' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => alternarPainel('configuracoes')}
        activeOpacity={0.85}
      >
        <DarkGlassIcon
          name="options-outline"
          size={21}
          boxSize={44}
          borderRadius={13}
          accentColor={palette.primary}
          active={painelAberto === 'configuracoes'}
          style={{ marginRight: 14 }}
        />
        <View style={styles.menuTextCol}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Configurações
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Tema Dark Glass, contraste e escala tipográfica
          </Text>
        </View>
        <DarkGlassIcon
          name={painelAberto === 'configuracoes' ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={16}
          boxSize={32}
          borderRadius={10}
          accentColor={painelAberto === 'configuracoes' ? palette.primary : palette.textSecondary}
          borderColor="rgba(148, 163, 184, 0.25)"
        />
      </TouchableOpacity>

      {painelAberto === 'configuracoes' ? (
        <View style={[styles.panelBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
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
                    name={ativo ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={ativo ? '#06101a' : palette.primary}
                  />
                  <Text
                    style={[
                      styles.optionPillText,
                      { color: ativo ? '#06101a' : palette.text, fontSize: fs(13) },
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
                  <Ionicons
                    name="text-outline"
                    size={13}
                    color={ativo ? '#06101a' : palette.primary}
                    style={{ marginBottom: 3 }}
                  />
                  <Text
                    style={[
                      styles.fontScaleBtnText,
                      { color: ativo ? '#06101a' : palette.text, fontSize: fs(11) },
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
              <Ionicons name="sync-outline" size={16} color="#06101a" />
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

      {/* Card Inspiracional Final */}
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
        <DarkGlassIcon
          name="construct-outline"
          size={36}
          boxSize={74}
          borderRadius={22}
          accentColor={palette.primary}
          glassBg="rgba(0, 255, 204, 0.10)"
          borderColor="rgba(0, 255, 204, 0.35)"
        />
      </View>

      {/* Card Oficial do Desenvolvedor: Rennê Santos (@oxe.renne) */}
      <DeveloperGlassCard palette={palette} fs={fs} />
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
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
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
    borderRadius: 16,
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
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  mapTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapSpaceName: {
    fontWeight: '800',
  },
  mapBlockText: {
    fontWeight: '700',
    marginTop: 2,
  },
  mapActivityText: {
    marginTop: 6,
    lineHeight: 18,
  },
  mapCapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  mapCapText: {
    marginLeft: 6,
    fontWeight: '600',
    flex: 1,
  },
  infoParagraph: {
    lineHeight: 21,
    marginBottom: 12,
  },
  certBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  certText: {
    flex: 1,
    marginLeft: 12,
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
    borderRadius: 12,
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
    borderRadius: 12,
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
    paddingVertical: 11,
    borderRadius: 12,
    marginRight: 8,
  },
  syncBtnText: {
    color: '#06101a',
    fontWeight: '800',
    marginLeft: 6,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
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
    borderRadius: 18,
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
});
