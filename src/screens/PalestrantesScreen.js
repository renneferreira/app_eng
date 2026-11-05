import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { DarkGlassIcon, DarkGlassPill } from '../components/DarkGlassIcon';

const CATEGORIAS = [
  { id: 'Todos', label: 'Todos', icon: 'apps-outline' },
  { id: 'Palestras', label: 'Palestras', icon: 'mic-outline' },
  { id: 'Minicursos', label: 'Minicursos', icon: 'layers-outline' },
];

export default function PalestrantesScreen() {
  const { palette, fs, palestrantes } = useApp();
  const [filtro, setFiltro] = useState('Todos');
  const [palestranteSelecionado, setPalestranteSelecionado] = useState(null);

  const listaFiltrada = palestrantes.filter((p) => {
    if (filtro === 'Todos') return true;
    return p.categoria === filtro;
  });

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      {/* Abas de Filtro: Todos | Palestras | Minicursos com Ícones Estilo Apple Dark Glass */}
      <View style={styles.filterRow}>
        {CATEGORIAS.map((cat) => {
          const ativo = filtro === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterTab,
                {
                  backgroundColor: palette.glassCard || palette.surfaceElevated,
                  borderColor: palette.border,
                },
                ativo && { backgroundColor: palette.primary, borderColor: palette.primary },
              ]}
              onPress={() => setFiltro(cat.id)}
              activeOpacity={0.82}
            >
              <Ionicons
                name={cat.icon}
                size={14}
                color={ativo ? '#06101a' : palette.primary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.filterTabText,
                  { color: palette.text, fontSize: fs(12) },
                  ativo && { color: '#06101a' },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lista de Palestrantes */}
      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.speakerCard,
              {
                backgroundColor: palette.glassCard || palette.surfaceElevated,
                borderColor: palette.border,
              },
            ]}
            activeOpacity={0.85}
            onPress={() => setPalestranteSelecionado(item)}
          >
            <View style={styles.avatarWrap}>
              <View style={[styles.avatarContainer, { backgroundColor: item.corAvatar, borderColor: palette.glassBorder || palette.border }]}>
                {item.fotoUrl ? (
                  <Image source={{ uri: item.fotoUrl }} style={styles.avatarImage} />
                ) : (
                  <Text style={[styles.avatarInitials, { fontSize: fs(18) }]}>
                    {item.iniciais}
                  </Text>
                )}
              </View>
              <View style={styles.avatarBadgeCorner}>
                <DarkGlassIcon
                  name={item.iconeEspecialidade || 'ribbon-outline'}
                  size={12}
                  boxSize={24}
                  borderRadius={7}
                  accentColor={palette.primary}
                  glassBg="#081322"
                />
              </View>
            </View>

            <View style={styles.speakerInfo}>
              <Text style={[styles.speakerName, { color: palette.text, fontSize: fs(16) }]}>
                {item.nome}
              </Text>
              <Text
                style={[styles.speakerTopic, { color: palette.textSecondary, fontSize: fs(13) }]}
                numberOfLines={2}
              >
                {item.tema}
              </Text>
              <View style={styles.roleRow}>
                <DarkGlassPill
                  icon={item.categoria === 'Palestras' ? 'mic-outline' : 'layers-outline'}
                  label={item.papel}
                  accentColor={palette.primary}
                  textColor={palette.primary}
                  glassBg={palette.primaryMuted}
                  borderColor="rgba(0, 255, 204, 0.30)"
                  fontSize={fs(10)}
                  style={{ marginRight: 8, marginBottom: 4 }}
                />
                <View style={styles.schedulePill}>
                  <Ionicons name="time-outline" size={12} color={palette.textSecondary} />
                  <Text style={[styles.scheduleMini, { color: palette.textSecondary, fontSize: fs(11) }]}>
                    {item.horario}
                  </Text>
                </View>
              </View>
            </View>

            <DarkGlassIcon
              name="chevron-forward-outline"
              size={16}
              boxSize={32}
              borderRadius={10}
              accentColor={palette.primary}
              borderColor="rgba(0, 255, 204, 0.24)"
            />
          </TouchableOpacity>
        )}
      />

      {/* Modal de Biografia e Detalhes do Palestrante */}
      <Modal
        visible={Boolean(palestranteSelecionado)}
        transparent
        animationType="fade"
        onRequestClose={() => setPalestranteSelecionado(null)}
      >
        <View style={styles.modalOverlay}>
          {palestranteSelecionado ? (
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.glassBorder || palette.border,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalSpeakerTop}>
                  <View
                    style={[
                      styles.modalAvatar,
                      { backgroundColor: palestranteSelecionado.corAvatar },
                    ]}
                  >
                    {palestranteSelecionado.fotoUrl ? (
                      <Image
                        source={{ uri: palestranteSelecionado.fotoUrl }}
                        style={styles.modalAvatarImg}
                      />
                    ) : (
                      <Text style={styles.avatarInitials}>
                        {palestranteSelecionado.iniciais}
                      </Text>
                    )}
                  </View>
                  <View style={styles.modalNameBlock}>
                    <Text style={[styles.modalName, { color: palette.text, fontSize: fs(18) }]}>
                      {palestranteSelecionado.nome}
                    </Text>
                    <Text
                      style={[
                        styles.modalInstitution,
                        { color: palette.primary, fontSize: fs(12) },
                      ]}
                    >
                      {palestranteSelecionado.instituicao}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setPalestranteSelecionado(null)}>
                  <DarkGlassIcon
                    name="close-outline"
                    size={20}
                    boxSize={34}
                    borderRadius={10}
                    accentColor={palette.textSecondary}
                    borderColor="rgba(148, 163, 184, 0.28)"
                  />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.topicBox,
                  { backgroundColor: palette.surface, borderColor: palette.border },
                ]}
              >
                <View style={styles.topicHeaderRow}>
                  <DarkGlassIcon
                    name={palestranteSelecionado.iconeEspecialidade || 'mic-outline'}
                    size={15}
                    boxSize={28}
                    borderRadius={8}
                    accentColor={palette.primary}
                  />
                  <Text style={[styles.topicLabel, { color: palette.primary, fontSize: fs(11) }]}>
                    {palestranteSelecionado.papel.toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.topicTitle, { color: palette.text, fontSize: fs(15) }]}>
                  {palestranteSelecionado.tema}
                </Text>
                <View style={styles.topicMetaRow}>
                  <Ionicons name="time-outline" size={14} color={palette.primary} />
                  <Text style={[styles.topicMetaText, { color: palette.textSecondary, fontSize: fs(12) }]}>
                    {palestranteSelecionado.horario} • {palestranteSelecionado.local}
                  </Text>
                </View>
              </View>

              <Text style={[styles.bioLabel, { color: palette.textSecondary, fontSize: fs(11) }]}>
                BIOGRAFIA E ATUAÇÃO PROFISSIONAL
              </Text>
              <Text style={[styles.bioText, { color: palette.text, fontSize: fs(14) }]}>
                {palestranteSelecionado.biografia}
              </Text>

              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: palette.primary }]}
                onPress={() => setPalestranteSelecionado(null)}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#06101a" />
                <Text style={[styles.closeButtonText, { fontSize: fs(14) }]}>
                  Fechar Biografia
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterTabText: {
    fontWeight: '800',
  },
  listContent: {
    paddingBottom: 28,
  },
  speakerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 14,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarBadgeCorner: {
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarInitials: {
    color: '#ffffff',
    fontWeight: '800',
  },
  speakerInfo: {
    flex: 1,
    paddingRight: 8,
  },
  speakerName: {
    fontWeight: '800',
  },
  speakerTopic: {
    marginTop: 3,
    lineHeight: 18,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  schedulePill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleMini: {
    fontWeight: '600',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 10, 18, 0.78)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalSpeakerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  modalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalAvatarImg: {
    width: '100%',
    height: '100%',
  },
  modalNameBlock: {
    flex: 1,
  },
  modalName: {
    fontWeight: '800',
  },
  modalInstitution: {
    marginTop: 3,
    fontWeight: '700',
  },
  topicBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  topicHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  topicLabel: {
    fontWeight: '800',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  topicTitle: {
    fontWeight: '800',
    marginBottom: 6,
  },
  topicMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicMetaText: {
    marginLeft: 6,
    fontWeight: '600',
  },
  bioLabel: {
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  bioText: {
    lineHeight: 21,
    marginBottom: 18,
  },
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#06101a',
    fontWeight: '800',
    marginLeft: 6,
  },
});
