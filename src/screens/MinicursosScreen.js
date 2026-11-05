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
import { DarkGlassIcon, DarkGlassPill } from '../components/DarkGlassIcon';

const TURNOS = [
  { id: 'Todos', label: 'Todos', icon: 'apps-outline' },
  { id: 'Manhã', label: 'Manhã', icon: 'sunny-outline' },
  { id: 'Tarde', label: 'Tarde', icon: 'partly-sunny-outline' },
  { id: 'Noite', label: 'Noite', icon: 'moon-outline' },
];

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
          <Ionicons name="checkmark-circle" size={14} color="#06101a" />
          <Text style={[styles.statusBadgeText, { color: '#06101a', fontSize: fs(11) }]}>
            Inscrito ({item.vagasDisponiveis} vagas rest.)
          </Text>
        </View>
      );
    }

    if (item.vagasDisponiveis === 0 || item.statusTipo === 'encerrado') {
      return (
        <View style={[styles.statusBadge, { backgroundColor: 'rgba(51, 65, 85, 0.75)', borderColor: '#475569', borderWidth: 1 }]}>
          <Ionicons name="lock-closed-outline" size={13} color="#cbd5e1" />
          <Text style={[styles.statusBadgeText, { color: '#cbd5e1', fontSize: fs(11) }]}>
            Inscrições encerradas
          </Text>
        </View>
      );
    }

    if (item.vagasDisponiveis <= 5 || item.statusTipo === 'poucas') {
      return (
        <View style={[styles.statusBadge, { backgroundColor: 'rgba(245, 158, 11, 0.16)', borderColor: '#f59e0b', borderWidth: 1 }]}>
          <Ionicons name="alert-circle-outline" size={13} color="#fbbf24" />
          <Text style={[styles.statusBadgeText, { color: '#fbbf24', fontSize: fs(11) }]}>
            Apenas {item.vagasDisponiveis} vagas
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: 'rgba(16, 185, 129, 0.16)', borderColor: '#10b981', borderWidth: 1 }]}>
        <Ionicons name="radio-button-on" size={12} color="#34d399" />
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
      {/* Filtro de Turnos: Todos | Manhã | Tarde | Noite com Ícones Estilo Apple Dark Glass */}
      <View style={styles.filterRow}>
        {TURNOS.map((turno) => {
          const ativo = turnoSelecionado === turno.id;
          return (
            <TouchableOpacity
              key={turno.id}
              style={[
                styles.turnoButton,
                {
                  backgroundColor: palette.glassCard || palette.surfaceElevated,
                  borderColor: palette.border,
                },
                ativo && { backgroundColor: palette.primary, borderColor: palette.primary },
              ]}
              onPress={() => setTurnoSelecionado(turno.id)}
              activeOpacity={0.82}
            >
              <Ionicons
                name={turno.icon}
                size={13}
                color={ativo ? '#06101a' : palette.primary}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.turnoText,
                  { color: palette.text, fontSize: fs(12) },
                  ativo && { color: '#06101a' },
                ]}
              >
                {turno.label}
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
                {
                  backgroundColor: palette.glassCard || palette.surfaceElevated,
                  borderColor: palette.border,
                },
              ]}
              activeOpacity={0.85}
              onPress={() => setCursoSelecionado(item)}
            >
              <View style={styles.courseRow}>
                {/* Ícone Squircle Estilo Apple Dark Glass do Software/Tema */}
                <View style={styles.iconStack}>
                  <DarkGlassIcon
                    name={item.iconeNome || 'layers-outline'}
                    size={22}
                    boxSize={48}
                    borderRadius={14}
                    accentColor={palette.primary}
                    glassBg="rgba(8, 20, 36, 0.85)"
                    borderColor="rgba(0, 255, 204, 0.34)"
                  />
                  <View style={[styles.monogramMini, { backgroundColor: item.corIcone }]}>
                    <Text style={styles.monogramMiniText}>{item.icone}</Text>
                  </View>
                </View>

                <View style={styles.courseMainInfo}>
                  <Text style={[styles.courseTitle, { color: palette.text, fontSize: fs(16) }]}>
                    {item.titulo}
                  </Text>
                  <View style={styles.instructorRow}>
                    <Ionicons name="person-outline" size={12} color={palette.primary} />
                    <Text style={[styles.courseInstructor, { color: palette.textSecondary, fontSize: fs(13) }]}>
                      {item.instrutor}
                    </Text>
                  </View>

                  <View style={styles.metaRow}>
                    <DarkGlassPill
                      icon="time-outline"
                      label={item.cargaHoraria}
                      accentColor={palette.primary}
                      textColor={palette.textSecondary}
                      fontSize={fs(11)}
                      style={{ marginRight: 6 }}
                    />
                    <DarkGlassPill
                      icon="location-outline"
                      label={item.local}
                      accentColor={palette.primary}
                      textColor={palette.textSecondary}
                      fontSize={fs(11)}
                    />
                  </View>

                  <View style={styles.bottomRow}>
                    {renderBadgeStatus(item, jaInscrito)}

                    <TouchableOpacity
                      style={styles.arrowAction}
                      onPress={() => setCursoSelecionado(item)}
                    >
                      <DarkGlassIcon
                        name="arrow-forward-outline"
                        size={16}
                        boxSize={32}
                        borderRadius={10}
                        accentColor={palette.primary}
                        borderColor="rgba(0, 255, 204, 0.25)"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Modal de Inscrição, Ementa e Materiais (Sem Emojis — 100% Dark Glass Icons) */}
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
                {
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.glassBorder || palette.border,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleWrap}>
                  <DarkGlassIcon
                    name={cursoModalAtualizado.iconeNome || 'layers-outline'}
                    size={22}
                    boxSize={46}
                    borderRadius={14}
                    accentColor={palette.primary}
                    style={{ marginRight: 12 }}
                  />
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
                  styles.modalMetaBox,
                  { backgroundColor: palette.surface, borderColor: palette.border },
                ]}
              >
                <View style={styles.modalMetaRow}>
                  <DarkGlassIcon
                    name="calendar-outline"
                    size={14}
                    boxSize={28}
                    borderRadius={8}
                    accentColor={palette.primary}
                  />
                  <Text style={[styles.modalMetaLine, { color: palette.text, fontSize: fs(13) }]}>
                    Horário: {cursoModalAtualizado.horario} ({cursoModalAtualizado.turno})
                  </Text>
                </View>

                <View style={[styles.modalMetaRow, { marginTop: 8 }]}>
                  <DarkGlassIcon
                    name="location-outline"
                    size={14}
                    boxSize={28}
                    borderRadius={8}
                    accentColor={palette.primary}
                  />
                  <Text style={[styles.modalMetaLine, { color: palette.text, fontSize: fs(13) }]}>
                    Local: {cursoModalAtualizado.local} • Carga Horária: {cursoModalAtualizado.cargaHoraria}
                  </Text>
                </View>

                <View style={[styles.modalMetaRow, { marginTop: 8 }]}>
                  <DarkGlassIcon
                    name="people-outline"
                    size={14}
                    boxSize={28}
                    borderRadius={8}
                    accentColor={palette.primary}
                  />
                  <Text style={[styles.modalMetaLine, { color: palette.primary, fontSize: fs(13), fontWeight: '800' }]}>
                    Vagas disponíveis: {cursoModalAtualizado.vagasDisponiveis} de {cursoModalAtualizado.vagasTotais}
                  </Text>
                </View>
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
                  <DarkGlassIcon
                    name="document-attach-outline"
                    size={13}
                    boxSize={24}
                    borderRadius={7}
                    accentColor={palette.primary}
                  />
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
                  <Ionicons name="checkmark-done-circle-outline" size={18} color="#06101a" />
                  <Text style={[styles.enrollButtonText, { color: '#06101a', fontSize: fs(14) }]}>
                    Confirmar Inscrição no Minicurso
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.enrollButton, { backgroundColor: '#334155' }]}>
                  <Ionicons name="lock-closed-outline" size={16} color="#94a3b8" />
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
    width: '23.8%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 14,
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
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconStack: {
    position: 'relative',
    marginRight: 14,
    marginTop: 2,
  },
  monogramMini: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  monogramMiniText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  courseMainInfo: {
    flex: 1,
  },
  courseTitle: {
    fontWeight: '800',
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  courseInstructor: {
    marginLeft: 5,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
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
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontWeight: '800',
    marginLeft: 5,
  },
  arrowAction: {
    padding: 2,
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
    marginBottom: 14,
  },
  modalTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
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
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalMetaLine: {
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
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
    marginTop: 6,
  },
  materialText: {
    marginLeft: 8,
    fontWeight: '600',
    flex: 1,
  },
  enrollButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 18,
  },
  enrollButtonText: {
    fontWeight: '800',
    marginLeft: 8,
  },
});
