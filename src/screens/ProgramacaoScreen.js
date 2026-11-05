import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { DIAS_EVENTO } from '../data/mockData';
import { DarkGlassIcon, DarkGlassPill } from '../components/DarkGlassIcon';

export default function ProgramacaoScreen({ route }) {
  const { palette, fs, programacao, favoritos, toggleFavorito } = useApp();
  const [diaSelecionado, setDiaSelecionado] = useState('todos');
  const [apenasFavoritos, setApenasFavoritos] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState(null);
  const [eventoDetalhe, setEventoDetalhe] = useState(null);

  useEffect(() => {
    if (route?.params?.filtroCategoria) {
      setCategoriaFiltro(route.params.filtroCategoria);
      setDiaSelecionado('todos');
    }
    if (route?.params?.destaqueId) {
      const encontrado = programacao.find((p) => p.id === route.params.destaqueId);
      if (encontrado) setEventoDetalhe(encontrado);
    }
  }, [route?.params, programacao]);

  const obterCorBadge = (tipo) => {
    if (tipo === 'Palestra') return palette.badgePalestra;
    if (tipo === 'Minicurso') return palette.badgeMinicurso;
    if (tipo === 'Olimpíada') return palette.badgeOlimpiada;
    if (tipo === 'Atividade Cultural') return palette.badgeCultural;
    return palette.secondary;
  };

  const obterIconeTipo = (item) => {
    if (item.icone) return item.icone;
    if (item.tipo === 'Palestra') return 'mic-outline';
    if (item.tipo === 'Minicurso') return 'layers-outline';
    if (item.tipo === 'Olimpíada') return 'trophy-outline';
    if (item.tipo === 'Atividade Cultural') return 'musical-notes-outline';
    return 'calendar-outline';
  };

  const dadosFiltrados = programacao.filter((item) => {
    if (diaSelecionado !== 'todos' && item.dia !== diaSelecionado) return false;
    if (apenasFavoritos && !favoritos.includes(item.id)) return false;
    if (categoriaFiltro && item.tipo !== categoriaFiltro) return false;
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      {/* Filtro de Dias (Todos, 20/10, 21/10, 22/10, 23/10, 24/10) com Ícones Dark Glass */}
      <View style={styles.topFiltersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {DIAS_EVENTO.map((dia) => {
            const ativo = diaSelecionado === dia.id;
            return (
              <TouchableOpacity
                key={dia.id}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: palette.glassCard || palette.surfaceElevated,
                    borderColor: palette.border,
                  },
                  ativo && {
                    backgroundColor: palette.primary,
                    borderColor: palette.primary,
                  },
                ]}
                onPress={() => setDiaSelecionado(dia.id)}
                activeOpacity={0.82}
              >
                <Ionicons
                  name={dia.icone || 'calendar-outline'}
                  size={14}
                  color={ativo ? '#06101a' : palette.primary}
                  style={{ marginRight: 6 }}
                />
                <View>
                  <Text
                    style={[
                      styles.tabText,
                      { color: palette.text, fontSize: fs(12) },
                      ativo && { color: '#06101a' },
                    ]}
                  >
                    {dia.data}
                  </Text>
                  <Text
                    style={[
                      styles.tabSubText,
                      { color: ativo ? '#0e293d' : palette.textSecondary, fontSize: fs(9) },
                    ]}
                  >
                    {dia.diaSemana}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Barra auxiliar: Filtro Favoritos e Limpar Categoria */}
        <View style={styles.secondaryFilterRow}>
          <TouchableOpacity
            style={[
              styles.favFilterPill,
              {
                backgroundColor: apenasFavoritos ? palette.primaryMuted : palette.surface,
                borderColor: apenasFavoritos ? palette.primary : palette.border,
              },
            ]}
            onPress={() => setApenasFavoritos(!apenasFavoritos)}
          >
            <Ionicons
              name={apenasFavoritos ? 'bookmark' : 'bookmark-outline'}
              size={14}
              color={apenasFavoritos ? palette.accentGold : palette.primary}
            />
            <Text
              style={[
                styles.favFilterText,
                {
                  color: apenasFavoritos ? palette.text : palette.textSecondary,
                  fontSize: fs(12),
                },
              ]}
            >
              Agenda Salva ({favoritos.length})
            </Text>
          </TouchableOpacity>

          {categoriaFiltro ? (
            <TouchableOpacity
              style={[
                styles.catClearPill,
                { backgroundColor: obterCorBadge(categoriaFiltro) },
              ]}
              onPress={() => setCategoriaFiltro(null)}
            >
              <Ionicons name="funnel-outline" size={12} color="#ffffff" />
              <Text style={[styles.catClearText, { fontSize: fs(11) }]}>
                {categoriaFiltro}
              </Text>
              <Ionicons name="close-circle" size={14} color="#ffffff" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Lista de Atividades com Cards e Ícones Estilo Apple Dark Glass */}
      <FlatList
        data={dadosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={[styles.emptyBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <DarkGlassIcon
              name="calendar-clear-outline"
              size={24}
              boxSize={48}
              borderRadius={14}
              accentColor={palette.primary}
            />
            <Text style={[styles.emptyText, { color: palette.textSecondary, fontSize: fs(14) }]}>
              Nenhuma atividade encontrada para o filtro selecionado.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isFav = favoritos.includes(item.id);
          const badgeColor = obterCorBadge(item.tipo);

          return (
            <TouchableOpacity
              style={[
                styles.itemCard,
                {
                  backgroundColor: palette.glassCard || palette.surfaceElevated,
                  borderColor: palette.border,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => setEventoDetalhe(item)}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.timeAndBadgeRow}>
                  <DarkGlassIcon
                    name={obterIconeTipo(item)}
                    size={19}
                    boxSize={38}
                    borderRadius={11}
                    accentColor={palette.primary}
                    style={{ marginRight: 10 }}
                  />
                  <View>
                    <View style={styles.badgesInline}>
                      <View style={styles.timeGlassPill}>
                        <Ionicons name="time-outline" size={12} color={palette.primary} />
                        <Text style={[styles.itemHora, { color: palette.text, fontSize: fs(13) }]}>
                          {item.hora}
                        </Text>
                      </View>
                      <View style={[styles.typeBadge, { backgroundColor: badgeColor }]}>
                        <Text style={[styles.typeBadgeText, { fontSize: fs(10) }]}>
                          {item.tipo}
                        </Text>
                      </View>
                      <Text style={[styles.itemDiaTag, { color: palette.primary, fontSize: fs(11) }]}>
                        {item.dia}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => toggleFavorito(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityLabel={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <DarkGlassIcon
                    name={isFav ? 'bookmark' : 'bookmark-outline'}
                    size={17}
                    boxSize={34}
                    borderRadius={10}
                    accentColor={isFav ? palette.accentGold : palette.textSecondary}
                    borderColor={isFav ? 'rgba(234, 179, 8, 0.45)' : 'rgba(148, 163, 184, 0.24)'}
                  />
                </TouchableOpacity>
              </View>

              <Text style={[styles.itemTitulo, { color: palette.text, fontSize: fs(16) }]}>
                {item.titulo}
              </Text>
              <View style={styles.speakerRow}>
                <Ionicons name="person-outline" size={13} color={palette.primary} />
                <Text style={[styles.itemPalestrante, { color: palette.textSecondary, fontSize: fs(13) }]}>
                  {item.palestrante}
                </Text>
              </View>

              <View style={styles.itemFooterRow}>
                <DarkGlassPill
                  icon="location-outline"
                  label={item.local}
                  accentColor={palette.primary}
                  textColor={palette.textSecondary}
                  fontSize={fs(11)}
                />
                <DarkGlassPill
                  label="Detalhes"
                  rightIcon="chevron-forward-outline"
                  accentColor={palette.primary}
                  textColor={palette.primary}
                  borderColor="rgba(0, 255, 204, 0.30)"
                  fontSize={fs(11)}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Modal de Detalhes da Atividade */}
      <Modal
        visible={Boolean(eventoDetalhe)}
        transparent
        animationType="fade"
        onRequestClose={() => setEventoDetalhe(null)}
      >
        <View style={styles.modalOverlay}>
          {eventoDetalhe ? (
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.glassBorder || palette.border,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <DarkGlassIcon
                    name={obterIconeTipo(eventoDetalhe)}
                    size={20}
                    boxSize={40}
                    borderRadius={12}
                    accentColor={palette.primary}
                    style={{ marginRight: 10 }}
                  />
                  <View style={[styles.typeBadge, { backgroundColor: obterCorBadge(eventoDetalhe.tipo) }]}>
                    <Text style={[styles.typeBadgeText, { fontSize: fs(11) }]}>
                      {eventoDetalhe.tipo} • {eventoDetalhe.dia} às {eventoDetalhe.hora}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setEventoDetalhe(null)}>
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

              <Text style={[styles.modalTitle, { color: palette.text, fontSize: fs(19) }]}>
                {eventoDetalhe.titulo}
              </Text>
              <Text style={[styles.modalSpeaker, { color: palette.primary, fontSize: fs(14) }]}>
                {eventoDetalhe.palestrante}
              </Text>

              <View style={[styles.modalInfoBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <View style={styles.modalInfoRow}>
                  <DarkGlassIcon
                    name="location-outline"
                    size={15}
                    boxSize={28}
                    borderRadius={8}
                    accentColor={palette.primary}
                  />
                  <Text style={[styles.modalInfoText, { color: palette.text, fontSize: fs(13) }]}>
                    Local: {eventoDetalhe.local}
                  </Text>
                </View>
                <View style={[styles.modalInfoRow, { marginTop: 8 }]}>
                  <DarkGlassIcon
                    name="time-outline"
                    size={15}
                    boxSize={28}
                    borderRadius={8}
                    accentColor={palette.primary}
                  />
                  <Text style={[styles.modalInfoText, { color: palette.text, fontSize: fs(13) }]}>
                    Data e Horário: {eventoDetalhe.dia}/2025 às {eventoDetalhe.hora}
                  </Text>
                </View>
              </View>

              <Text style={[styles.modalDescLabel, { color: palette.textSecondary, fontSize: fs(11) }]}>
                RESUMO TÉCNICO DA ATIVIDADE
              </Text>
              <Text style={[styles.modalDescription, { color: palette.text, fontSize: fs(14) }]}>
                {eventoDetalhe.descricao}
              </Text>

              <TouchableOpacity
                style={[
                  styles.favActionButton,
                  {
                    backgroundColor: favoritos.includes(eventoDetalhe.id)
                      ? palette.surface
                      : palette.primary,
                    borderColor: palette.primary,
                  },
                ]}
                onPress={() => toggleFavorito(eventoDetalhe.id)}
              >
                <Ionicons
                  name={favoritos.includes(eventoDetalhe.id) ? 'bookmark' : 'bookmark-outline'}
                  size={18}
                  color={favoritos.includes(eventoDetalhe.id) ? palette.accentGold : '#06101a'}
                />
                <Text
                  style={[
                    styles.favActionBtnText,
                    {
                      color: favoritos.includes(eventoDetalhe.id) ? palette.text : '#06101a',
                      fontSize: fs(14),
                    },
                  ]}
                >
                  {favoritos.includes(eventoDetalhe.id)
                    ? 'Salvo na sua Agenda (Toque para remover)'
                    : 'Salvar na Minha Agenda Offline'}
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
  topFiltersContainer: {
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabButton: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontWeight: '800',
  },
  tabSubText: {
    fontWeight: '600',
  },
  secondaryFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  favFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  favFilterText: {
    fontWeight: '700',
    marginLeft: 6,
  },
  catClearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  catClearText: {
    color: '#ffffff',
    fontWeight: '800',
    marginHorizontal: 5,
  },
  listContent: {
    paddingBottom: 28,
  },
  itemCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeAndBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  badgesInline: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  timeGlassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 204, 0.10)',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginRight: 8,
  },
  itemHora: {
    fontWeight: '800',
    marginLeft: 4,
  },
  typeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 9,
    marginRight: 8,
  },
  typeBadgeText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  itemDiaTag: {
    fontWeight: '800',
  },
  itemTitulo: {
    fontWeight: '800',
    lineHeight: 22,
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  itemPalestrante: {
    marginLeft: 6,
    fontWeight: '600',
  },
  itemFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.14)',
  },
  emptyBox: {
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    marginTop: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 10, 18, 0.78)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalTitle: {
    fontWeight: '800',
    lineHeight: 26,
  },
  modalSpeaker: {
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 14,
  },
  modalInfoBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalInfoText: {
    marginLeft: 10,
    fontWeight: '600',
  },
  modalDescLabel: {
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  modalDescription: {
    lineHeight: 21,
    marginBottom: 18,
  },
  favActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  favActionBtnText: {
    fontWeight: '800',
    marginLeft: 8,
  },
});
