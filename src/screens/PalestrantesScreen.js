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

const CATEGORIAS = ['Todos', 'Palestras', 'Minicursos'];

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
      {/* Abas de Filtro: Todos | Palestras | Minicursos (Fiel à Tela 3 do Infográfico) */}
      <View style={styles.filterRow}>
        {CATEGORIAS.map((cat) => {
          const ativo = filtro === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterTab,
                { backgroundColor: palette.surfaceElevated, borderColor: palette.border },
                ativo && { backgroundColor: palette.primary, borderColor: palette.primary },
              ]}
              onPress={() => setFiltro(cat)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  { color: palette.text, fontSize: fs(13) },
                  ativo && { color: '#0d1b2a' },
                ]}
              >
                {cat}
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
              { backgroundColor: palette.surfaceElevated, borderColor: palette.border },
            ]}
            activeOpacity={0.85}
            onPress={() => setPalestranteSelecionado(item)}
          >
            <View style={[styles.avatarContainer, { backgroundColor: item.corAvatar }]}>
              {item.fotoUrl ? (
                <Image source={{ uri: item.fotoUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={[styles.avatarInitials, { fontSize: fs(18) }]}>
                  {item.iniciais}
                </Text>
              )}
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
                <View style={[styles.roleBadge, { backgroundColor: palette.primaryMuted }]}>
                  <Text style={[styles.roleText, { color: palette.primary, fontSize: fs(11) }]}>
                    {item.papel}
                  </Text>
                </View>
                <Text style={[styles.scheduleMini, { color: palette.textSecondary, fontSize: fs(11) }]}>
                  {item.horario}
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color={palette.textSecondary} />
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
                { backgroundColor: palette.surfaceElevated, borderColor: palette.border },
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
                  <Ionicons name="close-circle" size={28} color={palette.textSecondary} />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.topicBox,
                  { backgroundColor: palette.surface, borderColor: palette.border },
                ]}
              >
                <Text style={[styles.topicLabel, { color: palette.primary, fontSize: fs(11) }]}>
                  {palestranteSelecionado.papel.toUpperCase()}
                </Text>
                <Text style={[styles.topicTitle, { color: palette.text, fontSize: fs(15) }]}>
                  {palestranteSelecionado.tema}
                </Text>
                <View style={styles.topicMetaRow}>
                  <Ionicons name="time-outline" size={14} color={palette.textSecondary} />
                  <Text style={[styles.topicMetaText, { color: palette.textSecondary, fontSize: fs(12) }]}>
                    {palestranteSelecionado.horario} • {palestranteSelecionado.local}
                  </Text>
                </View>
              </View>

              <Text style={[styles.bioLabel, { color: palette.textSecondary, fontSize: fs(12) }]}>
                BIOGRAFIA E ATUAÇÃO PROFISSIONAL
              </Text>
              <Text style={[styles.bioText, { color: palette.text, fontSize: fs(14) }]}>
                {palestranteSelecionado.biografia}
              </Text>

              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: palette.primary }]}
                onPress={() => setPalestranteSelecionado(null)}
              >
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
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 20,
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
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  avatarContainer: {
    width: 62,
    height: 62,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 14,
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
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  roleText: {
    fontWeight: '800',
  },
  scheduleMini: {
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 16,
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
    borderRadius: 14,
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
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  topicLabel: {
    fontWeight: '800',
    marginBottom: 4,
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
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#0d1b2a',
    fontWeight: '800',
  },
});

