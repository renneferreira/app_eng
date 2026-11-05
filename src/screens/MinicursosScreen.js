import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const TURNOS = ['Todos', 'Manhã', 'Tarde', 'Noite'];

export default function MinicursosScreen() {
  const {
    palette,
    fs,
    minicursos,
    inscricoesMinicursos,
    alternarInscricaoMinicurso,
  } = useApp();

  const [turnoSelecionado, setTurnoSelecionado] = useState('Todos');
  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  const listaFiltrada = minicursos.filter((c) => {
    if (turnoSelecionado === 'Todos') return true;
    return c.turno === turnoSelecionado;
  });

  const renderBadgeStatus = (item, jaInscrito) => {
    if (jaInscrito) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: palette.primary }]}>
          <Ionicons name="checkmark-circle" size={14} color="#0d1b2a" />
          <Text style={[styles.statusBadgeText, { color: '#0d1b2a', fontSize: fs(11) }]}>
            Inscrito ({item.vagasDisponiveis} vagas rest.)
          </Text>
        </View>
      );
    }

    if (item.vagasDisponiveis === 0 || item.statusTipo === 'encerrado') {
      return (
        <View style={[styles.statusBadge, { backgroundColor: '#334155' }]}>
          <Text style={[styles.statusBadgeText, { color: '#cbd5e1', fontSize: fs(11) }]}>
            Inscrições encerradas
          </Text>
        </View>
      );
    }

    if (item.vagasDisponiveis <= 5 || item.statusTipo === 'poucas') {
      return (
        <View style={[styles.statusBadge, { backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: '#f59e0b', borderWidth: 1 }]}>
          <Ionicons name="warning" size={13} color="#f59e0b" />
          <Text style={[styles.statusBadgeText, { color: '#fbbf24', fontSize: fs(11) }]}>
            Apenas {item.vagasDisponiveis} vagas
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: 'rgba(16, 185, 129, 0.18)', borderColor: '#10b981', borderWidth: 1 }]}>
        <Text style={[styles.statusBadgeText, { color: '#34d399', fontSize: fs(11) }]}>
          Vagas disponíveis ({item.vagasDisponiveis})
        </Text>
      </View>
    );
  };

  const cursoModalAtualizado = cursoSelecionado
    ? minicursos.find((c) => c.id === cursoSelecionado.id) || cursoSelecionado
    : null;

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      {/* Filtro de Turnos: Todos | Manhã | Tarde | Noite (Fiel à Tela 4 do Infográfico) */}
      <View style={styles.filterRow}>
        {TURNOS.map((turno) => {
          const ativo = turnoSelecionado === turno;
          return (
            <TouchableOpacity
              key={turno}
              style={[
                styles.turnoButton,
                { backgroundColor: palette.surfaceElevated, borderColor: palette.border },
                ativo && { backgroundColor: palette.primary, borderColor: palette.primary },
              ]}
              onPress={() => setTurnoSelecionado(turno)}
            >
              <Text
                style={[
                  styles.turnoText,
                  { color: palette.text, fontSize: fs(13) },
                  ativo && { color: '#0d1b2a' },
                ]}
              >
                {turno}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lista de Minicursos */}
      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const jaInscrito = inscricoesMinicursos.includes(item.id);
          return (
            <TouchableOpacity
              style={[
                styles.courseCard,
                { backgroundColor: palette.surfaceElevated, borderColor: palette.border },
              ]}
              activeOpacity={0.85}
              onPress={() => setCursoSelecionado(item)}
            >
              <View style={styles.courseRow}>
                {/* Ícone estilizado do Software/Tema */}
                <View style={[styles.courseIconBox, { backgroundColor: item.corIcone }]}>
                  <Text style={[styles.courseIconLetter, { fontSize: fs(20) }]}>
                    {item.icone}
                  </Text>
                </View>

                <View style={styles.courseMainInfo}>
                  <Text style={[styles.courseTitle, { color: palette.text, fontSize: fs(16) }]}>
                    {item.titulo}
                  </Text>
                  <Text style={[styles.courseInstructor, { color: palette.textSecondary, fontSize: fs(13) }]}>
                    {item.instrutor}
                  </Text>

                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color={palette.primary} />
                    <Text style={[styles.metaText, { color: palette.textSecondary, fontSize: fs(12) }]}>
                      {item.cargaHoraria} • {item.local}
                    </Text>
                  </View>

                  <View style={styles.bottomRow}>
                    {renderBadgeStatus(item, jaInscrito)}

                    <TouchableOpacity
                      style={styles.arrowAction}
                      onPress={() => setCursoSelecionado(item)}
                    >
                      <Ionicons name="arrow-forward" size={18} color={palette.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Modal de Inscrição, Ementa e Materiais */}
      <Modal
        visible={Boolean(cursoModalAtualizado)}
        transparent
        animationType="fade"
        onRequestClose={() => setCursoSelecionado(null)}
      >
        <View style={styles.modalOverlay}>
          {cursoModalAtualizado ? (
            <View
              style={[
                styles.modalCard,
                { backgroundColor: palette.surfaceElevated, borderColor: palette.border },
              ]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleWrap}>
                  <View
                    style={[
                      styles.modalBadgeIcon,
                      { backgroundColor: cursoModalAtualizado.corIcone },
                    ]}
                  >
                    <Text style={styles.courseIconLetter}>{cursoModalAtualizado.icone}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalTitle, { color: palette.text, fontSize: fs(18) }]}>
                      {cursoModalAtualizado.titulo}
                    </Text>
                    <Text style={[styles.modalInstructor, { color: palette.primary, fontSize: fs(13) }]}>
                      {cursoModalAtualizado.instrutor}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setCursoSelecionado(null)}>
                  <Ionicons name="close-circle" size={28} color={palette.textSecondary} />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.modalMetaBox,
                  { backgroundColor: palette.surface, borderColor: palette.border },
                ]}
              >
                <Text style={[styles.modalMetaLine, { color: palette.text, fontSize: fs(13) }]}>
                  📅 Horário: {cursoModalAtualizado.horario} ({cursoModalAtualizado.turno})
                </Text>
                <Text style={[styles.modalMetaLine, { color: palette.text, fontSize: fs(13), marginTop: 4 }]}>
                  📍 Local: {cursoModalAtualizado.local} • Carga Horária: {cursoModalAtualizado.cargaHoraria}
                </Text>
                <Text style={[styles.modalMetaLine, { color: palette.primary, fontSize: fs(13), marginTop: 4, fontWeight: '700' }]}>
                  🎟️ Vagas disponíveis: {cursoModalAtualizado.vagasDisponiveis} de {cursoModalAtualizado.vagasTotais}
                </Text>
              </View>

              <Text style={[styles.sectionSubLabel, { color: palette.textSecondary, fontSize: fs(11) }]}>
                EMENTA PRÁTICA
              </Text>
              <Text style={[styles.ementaText, { color: palette.text, fontSize: fs(13) }]}>
                {cursoModalAtualizado.ementa}
              </Text>

              <Text style={[styles.sectionSubLabel, { color: palette.textSecondary, fontSize: fs(11), marginTop: 12 }]}>
                MATERIAIS DE APOIO DISPONÍVEIS
              </Text>
              {cursoModalAtualizado.materiais.map((mat, idx) => (
                <View key={idx} style={styles.materialRow}>
                  <Ionicons name="document-attach-outline" size={16} color={palette.primary} />
                  <Text style={[styles.materialText, { color: palette.text, fontSize: fs(12) }]}>
                    {mat}
                  </Text>
                </View>
              ))}

              {/* Botão de Inscrição / Cancelamento */}
              {inscricoesMinicursos.includes(cursoModalAtualizado.id) ? (
                <TouchableOpacity
                  style={[styles.enrollButton, { backgroundColor: palette.danger }]}
                  onPress={() => alternarInscricaoMinicurso(cursoModalAtualizado.id)}
                >
                  <Ionicons name="close-circle-outline" size={18} color="#ffffff" />
                  <Text style={[styles.enrollButtonText, { color: '#ffffff', fontSize: fs(14) }]}>
                    Cancelar Minha Inscrição
                  </Text>
                </TouchableOpacity>
              ) : cursoModalAtualizado.vagasDisponiveis > 0 ? (
                <TouchableOpacity
                  style={[styles.enrollButton, { backgroundColor: palette.primary }]}
                  onPress={() => alternarInscricaoMinicurso(cursoModalAtualizado.id)}
                >
                  <Ionicons name="checkmark-done-circle-outline" size={18} color="#0d1b2a" />
                  <Text style={[styles.enrollButtonText, { color: '#0d1b2a', fontSize: fs(14) }]}>
                    Confirmar Inscrição no Minicurso
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.enrollButton, { backgroundColor: '#334155' }]}>
                  <Text style={[styles.enrollButtonText, { color: '#94a3b8', fontSize: fs(14) }]}>
                    Vagas Esgotadas
                  </Text>
                </View>
              )}
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
  turnoButton: {
    width: '23.5%',
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  turnoText: {
    fontWeight: '800',
  },
  listContent: {
    paddingBottom: 28,
  },
  courseCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  courseIconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  courseIconLetter: {
    color: '#ffffff',
    fontWeight: '900',
  },
  courseMainInfo: {
    flex: 1,
  },
  courseTitle: {
    fontWeight: '800',
  },
  courseInstructor: {
    marginTop: 2,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaText: {
    marginLeft: 5,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontWeight: '800',
    marginLeft: 4,
  },
  arrowAction: {
    padding: 4,
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
    marginBottom: 14,
  },
  modalTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  modalBadgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontWeight: '800',
  },
  modalInstructor: {
    fontWeight: '700',
    marginTop: 2,
  },
  modalMetaBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  modalMetaLine: {
    fontWeight: '500',
  },
  sectionSubLabel: {
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  ementaText: {
    lineHeight: 20,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  materialText: {
    marginLeft: 7,
    fontWeight: '600',
  },
  enrollButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 18,
  },
  enrollButtonText: {
    fontWeight: '800',
    marginLeft: 8,
  },
});

