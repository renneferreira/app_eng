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

  const dadosFiltrados = programacao.filter((item) => {
    if (diaSelecionado !== 'todos' && item.dia !== diaSelecionado) return false;
    if (apenasFavoritos && !favoritos.includes(item.id)) return false;
    if (categoriaFiltro && item.tipo !== categoriaFiltro) return false;
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      {/* Filtro de Dias (Todos, 20/10, 21/10, 22/10, 23/10, 24/10) */}
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
                  { backgroundColor: palette.surfaceElevated, borderColor: palette.border },
                  ativo && { backgroundColor: palette.primary, borderColor: palette.primary },
                ]}
                onPress={() => setDiaSelecionado(dia.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: palette.text, fontSize: fs(13) },
                    ativo && { color: '#0d1b2a' },
                  ]}
                >
                  {dia.data}
                </Text>
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
              name={apenasFavoritos ? 'star' : 'star-outline'}
              size={15}
              color={apenasFavoritos ? palette.accentGold : palette.textSecondary}
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
              Apenas Favoritos ({favoritos.length})
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
              <Text style={[styles.catClearText, { fontSize: fs(11) }]}>
                {categoriaFiltro} ✕
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Lista de Atividades (Fiel à Tela 2 do Infográfico) */}
      <FlatList
        data={dadosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={[styles.emptyBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <Ionicons name="calendar-clear-outline" size={32} color={palette.textSecondary} />
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
                { backgroundColor: palette.surfaceElevated, borderColor: palette.border },
              ]}
              activeOpacity={0.85}
              onPress={() => setEventoDetalhe(item)}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.timeAndBadgeRow}>
                  <Text style={[styles.itemHora, { color: palette.text, fontSize: fs(15) }]}>
                    {item.hora}
                  </Text>
                  <View style={[styles.typeBadge, { backgroundColor: badgeColor }]}>
                    <Text style={[styles.typeBadgeText, { fontSize: fs(11) }]}>
                      {item.tipo}
                    </Text>
                  </View>
                  <Text style={[styles.itemDiaTag, { color: palette.primary, fontSize: fs(11) }]}>
                    {item.dia}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => toggleFavorito(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityLabel={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Ionicons
                    name={isFav ? 'star' : 'star-outline'}
                    size={22}
                    color={isFav ? palette.accentGold : palette.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <Text style={[styles.itemTitulo, { color: palette.text, fontSize: fs(16) }]}>
                {item.titulo}
              </Text>
              <Text style={[styles.itemPalestrante, { color: palette.textSecondary, fontSize: fs(13) }]}>
                {item.palestrante}
              </Text>

              <View style={styles.itemFooterRow}>
                <View style={styles.localWrap}>
                  <Ionicons name="location-outline" size={15} color={palette.primary} />
                  <Text style={[styles.itemLocal, { color: palette.textSecondary, fontSize: fs(12) }]}>
                    {item.local}
                  </Text>
                </View>
                <Text style={[styles.verMaisLink, { color: palette.primary, fontSize: fs(12) }]}>
                  Detalhes →
                </Text>
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
            <View style={[styles.modalContent, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}>
              <View style={styles.modalHeader}>
                <View style={[styles.typeBadge, { backgroundColor: obterCorBadge(eventoDetalhe.tipo) }]}>
                  <Text style={[styles.typeBadgeText, { fontSize: fs(11) }]}>
                    {eventoDetalhe.tipo} • {eventoDetalhe.dia} às {eventoDetalhe.hora}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setEventoDetalhe(null)}>
                  <Ionicons name="close-circle" size={28} color={palette.textSecondary} />
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
                  <Ionicons name="location" size={16} color={palette.primary} />
                  <Text style={[styles.modalInfoText, { color: palette.text, fontSize: fs(13) }]}>
                    Local: {eventoDetalhe.local}
                  </Text>
                </View>
                <View style={[styles.modalInfoRow, { marginTop: 6 }]}>
                  <Ionicons name="time" size={16} color={palette.primary} />
                  <Text style={[styles.modalInfoText, { color: palette.text, fontSize: fs(13) }]}>
                    Data e Horário: {eventoDetalhe.dia}/2025 às {eventoDetalhe.hora}
                  </Text>
                </View>
              </View>

              <Text style={[styles.modalDescLabel, { color: palette.textSecondary, fontSize: fs(12) }]}>
                RESUMO DA ATIVIDADE
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
                  name={favoritos.includes(eventoDetalhe.id) ? 'star' : 'star-outline'}
                  size={18}
                  color={favoritos.includes(eventoDetalhe.id) ? palette.accentGold : '#0d1b2a'}
                />
                <Text
                  style={[
                    styles.favActionBtnText,
                    {
                      color: favoritos.includes(eventoDetalhe.id) ? palette.text : '#0d1b2a',
                      fontSize: fs(14),
                    },
                  ]}
                >
                  {favoritos.includes(eventoDetalhe.id)
                    ? 'Salvo na sua Agenda (Toque para remover)'
                    : 'Salvar nos Meus Favoritos'}
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
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontWeight: '800',
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
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  favFilterText: {
    fontWeight: '700',
    marginLeft: 6,
  },
  catClearPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  catClearText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  listContent: {
    paddingBottom: 28,
  },
  itemCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeAndBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  itemHora: {
    fontWeight: '800',
    marginRight: 10,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },
  typeBadgeText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  itemDiaTag: {
    fontWeight: '700',
  },
  itemTitulo: {
    fontWeight: '800',
    lineHeight: 22,
  },
  itemPalestrante: {
    marginTop: 4,
    fontWeight: '500',
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
  localWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLocal: {
    marginLeft: 5,
    fontWeight: '600',
  },
  verMaisLink: {
    fontWeight: '700',
  },
  emptyBox: {
    padding: 28,
    borderRadius: 12,
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
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalInfoText: {
    marginLeft: 8,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  favActionBtnText: {
    fontWeight: '800',
    marginLeft: 8,
  },
});

