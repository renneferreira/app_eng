import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { OLIMPIADAS_DADOS } from '../data/mockData';
import { DarkGlassIcon, DarkGlassPill } from '../components/DarkGlassIcon';

export default function OlimpiadasScreen() {
  const { palette, fs, equipesOlimpiadas, inscreverEquipeOlimpiada } = useApp();

  const [secaoAtiva, setSecaoAtiva] = useState('modalidades');

  const [nomeEquipe, setNomeEquipe] = useState('');
  const [modalidadeEscolhida, setModalidadeEscolhida] = useState('Estruturas (Ponte Treliçada)');
  const [integrantes, setIntegrantes] = useState('');
  const [massaEstimada, setMassaEstimada] = useState('550');
  const [cargaEstimada, setCargaEstimada] = useState('50');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const [simMassaG, setSimMassaG] = useState('520');
  const [simCargaKgf, setSimCargaKgf] = useState('54');

  const calcularEficiencia = () => {
    const mKg = (parseFloat(simMassaG) || 500) / 1000;
    const cKgf = parseFloat(simCargaKgf) || 0;
    if (mKg <= 0) return { ee: 0, penalidade: false };
    const eeBruta = cKgf / mKg;
    const excessoG = Math.max(0, (parseFloat(simMassaG) || 0) - 750);
    const blocosPenalidade = Math.ceil(excessoG / 50);
    const fator = Math.max(0.2, 1 - blocosPenalidade * 0.15);
    return {
      ee: (eeBruta * fator).toFixed(1),
      penalidade: excessoG > 0,
    };
  };

  const resultadoSimulacao = calcularEficiencia();

  const handleInscreverEquipe = async () => {
    if (!nomeEquipe.trim() || !integrantes.trim()) {
      setMensagemSucesso('Preencha o nome da equipe e os integrantes.');
      return;
    }
    await inscreverEquipeOlimpiada({
      nomeEquipe,
      modalidade: modalidadeEscolhida,
      integrantes,
      massaG: massaEstimada,
      cargaPrevistaKgf: cargaEstimada,
    });
    setNomeEquipe('');
    setIntegrantes('');
    setMensagemSucesso('Equipe inscrita com sucesso! Confira na aba Resultados / Ranking.');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Banner com Troféu em Estilo Apple Dark Glass */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: palette.bannerBg,
            borderColor: palette.glassBorder || palette.border,
          },
        ]}
      >
        <View style={styles.heroSpecularLine} />
        <View style={styles.heroRow}>
          <DarkGlassIcon
            name="trophy-outline"
            size={34}
            boxSize={68}
            borderRadius={18}
            accentColor="#fbbf24"
            glassBg="rgba(251, 191, 36, 0.14)"
            borderColor="rgba(251, 191, 36, 0.42)"
            style={{ marginRight: 16 }}
          />
          <View style={styles.heroTextContent}>
            <View style={styles.heroTagRow}>
              <Ionicons name="shield-checkmark-outline" size={12} color="#00ffcc" />
              <Text style={styles.heroTagText}>OLIMPÍADA TÉCNICA IFPI</Text>
            </View>
            <Text style={[styles.heroTitle, { fontSize: fs(17) }]}>
              {OLIMPIADAS_DADOS.titulo}
            </Text>
            <Text style={[styles.heroSubtitle, { fontSize: fs(12) }]}>
              {OLIMPIADAS_DADOS.subtitulo}
            </Text>
          </View>
        </View>
      </View>

      {/* 1. Modalidades */}
      <TouchableOpacity
        style={[
          styles.menuCard,
          {
            backgroundColor: palette.glassCard || palette.surfaceElevated,
            borderColor: secaoAtiva === 'modalidades' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => setSecaoAtiva(secaoAtiva === 'modalidades' ? '' : 'modalidades')}
        activeOpacity={0.85}
      >
        <DarkGlassIcon
          name="layers-outline"
          size={21}
          boxSize={44}
          borderRadius={13}
          accentColor={palette.primary}
          active={secaoAtiva === 'modalidades'}
          style={{ marginRight: 14 }}
        />
        <View style={styles.menuInfo}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Modalidades
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Estruturas • Topografia • Orçamento
          </Text>
        </View>
        <DarkGlassIcon
          name={secaoAtiva === 'modalidades' ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={16}
          boxSize={32}
          borderRadius={10}
          accentColor={secaoAtiva === 'modalidades' ? palette.primary : palette.textSecondary}
          borderColor="rgba(148, 163, 184, 0.25)"
        />
      </TouchableOpacity>

      {secaoAtiva === 'modalidades' ? (
        <View style={[styles.expandedPanel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          {OLIMPIADAS_DADOS.modalidades.map((mod) => (
            <View key={mod.id} style={[styles.modItem, { borderBottomColor: palette.border }]}>
              <View style={styles.modHeader}>
                <DarkGlassIcon
                  name={mod.icone}
                  size={17}
                  boxSize={34}
                  borderRadius={10}
                  accentColor={palette.primary}
                />
                <Text style={[styles.modTitle, { color: palette.text, fontSize: fs(14) }]}>
                  {mod.nome}
                </Text>
              </View>
              <Text style={[styles.modDesc, { color: palette.textSecondary, fontSize: fs(13) }]}>
                {mod.detalhes}
              </Text>
              <View style={styles.prizeBadgeRow}>
                <DarkGlassPill
                  icon="trophy-outline"
                  label={mod.premio}
                  accentColor={palette.accentGold}
                  textColor={palette.accentGold}
                  glassBg="rgba(234, 179, 8, 0.12)"
                  borderColor="rgba(234, 179, 8, 0.35)"
                  fontSize={fs(11)}
                />
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {/* 2. Regulamento e Regras de Pontuação */}
      <TouchableOpacity
        style={[
          styles.menuCard,
          {
            backgroundColor: palette.glassCard || palette.surfaceElevated,
            borderColor: secaoAtiva === 'regulamento' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => setSecaoAtiva(secaoAtiva === 'regulamento' ? '' : 'regulamento')}
        activeOpacity={0.85}
      >
        <DarkGlassIcon
          name="document-text-outline"
          size={21}
          boxSize={44}
          borderRadius={13}
          accentColor="#38bdf8"
          borderColor="rgba(56, 189, 248, 0.35)"
          active={secaoAtiva === 'regulamento'}
          style={{ marginRight: 14 }}
        />
        <View style={styles.menuInfo}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Regulamento
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Regras e critérios de avaliação
          </Text>
        </View>
        <DarkGlassIcon
          name={secaoAtiva === 'regulamento' ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={16}
          boxSize={32}
          borderRadius={10}
          accentColor={secaoAtiva === 'regulamento' ? palette.primary : palette.textSecondary}
          borderColor="rgba(148, 163, 184, 0.25)"
        />
      </TouchableOpacity>

      {secaoAtiva === 'regulamento' ? (
        <View style={[styles.expandedPanel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.panelSectionHeading, { color: palette.primary, fontSize: fs(11) }]}>
            CRITÉRIOS DE PONTUAÇÃO OFICIAIS
          </Text>
          {OLIMPIADAS_DADOS.regrasPontuacao.map((regra, idx) => (
            <View key={idx} style={[styles.ruleBox, { borderColor: palette.border }]}>
              <View style={styles.ruleTopRow}>
                <View style={styles.ruleTitleWithIcon}>
                  <DarkGlassIcon
                    name={regra.icone || 'analytics-outline'}
                    size={15}
                    boxSize={30}
                    borderRadius={9}
                    accentColor={palette.primary}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[styles.ruleTitle, { color: palette.text, fontSize: fs(14) }]}>
                    {regra.criterio}
                  </Text>
                </View>
                <View style={[styles.weightBadge, { backgroundColor: palette.primaryMuted }]}>
                  <Text style={[styles.weightText, { color: palette.primary, fontSize: fs(11) }]}>
                    Peso: {regra.peso}
                  </Text>
                </View>
              </View>
              <Text style={[styles.ruleFormula, { color: palette.accentGold, fontSize: fs(12) }]}>
                {regra.formula}
              </Text>
              <Text style={[styles.ruleDesc, { color: palette.textSecondary, fontSize: fs(12) }]}>
                {regra.descricao}
              </Text>
            </View>
          ))}

          {/* Simulador Interativo de Eficiência Estrutural (Sem Emojis — Com DarkGlassIcon) */}
          <View style={[styles.calcCard, { backgroundColor: palette.surfaceElevated, borderColor: palette.primary }]}>
            <View style={styles.calcHeaderRow}>
              <DarkGlassIcon
                name="speedometer-outline"
                size={17}
                boxSize={34}
                borderRadius={10}
                accentColor={palette.primary}
              />
              <Text style={[styles.calcTitle, { color: palette.primary, fontSize: fs(13) }]}>
                Simulador de Eficiência Estrutural (Ponte Treliçada)
              </Text>
            </View>
            <View style={styles.calcInputsRow}>
              <View style={styles.calcField}>
                <Text style={[styles.calcLabel, { color: palette.textSecondary, fontSize: fs(11) }]}>
                  Massa da Ponte (g)
                </Text>
                <TextInput
                  style={[styles.calcInput, { color: palette.text, borderColor: palette.border, backgroundColor: palette.surface }]}
                  keyboardType="numeric"
                  value={simMassaG}
                  onChangeText={setSimMassaG}
                />
              </View>
              <View style={styles.calcField}>
                <Text style={[styles.calcLabel, { color: palette.textSecondary, fontSize: fs(11) }]}>
                  Carga de Ruptura (kgf)
                </Text>
                <TextInput
                  style={[styles.calcInput, { color: palette.text, borderColor: palette.border, backgroundColor: palette.surface }]}
                  keyboardType="numeric"
                  value={simCargaKgf}
                  onChangeText={setSimCargaKgf}
                />
              </View>
            </View>
            <View style={styles.calcResultRow}>
              <Ionicons name="analytics-outline" size={16} color={palette.primary} />
              <Text style={[styles.calcResultText, { color: palette.text, fontSize: fs(13) }]}>
                Eficiência Calculada (EE):{' '}
                <Text style={{ color: palette.primary, fontWeight: '900' }}>
                  {resultadoSimulacao.ee} kgf/kg
                </Text>
                {resultadoSimulacao.penalidade ? ' (Redutor ativo > 750g)' : ''}
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* 3. Inscrições */}
      <TouchableOpacity
        style={[
          styles.menuCard,
          {
            backgroundColor: palette.glassCard || palette.surfaceElevated,
            borderColor: secaoAtiva === 'inscricoes' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => setSecaoAtiva(secaoAtiva === 'inscricoes' ? '' : 'inscricoes')}
        activeOpacity={0.85}
      >
        <DarkGlassIcon
          name="create-outline"
          size={21}
          boxSize={44}
          borderRadius={13}
          accentColor="#34d399"
          borderColor="rgba(52, 211, 153, 0.35)"
          active={secaoAtiva === 'inscricoes'}
          style={{ marginRight: 14 }}
        />
        <View style={styles.menuInfo}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Inscrições
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            {OLIMPIADAS_DADOS.prazoInscricao}
          </Text>
        </View>
        <View style={styles.openBadge}>
          <Ionicons name="radio-button-on" size={10} color="#ffffff" style={{ marginRight: 4 }} />
          <Text style={[styles.openBadgeText, { fontSize: fs(11) }]}>
            {OLIMPIADAS_DADOS.statusInscricao}
          </Text>
        </View>
        <DarkGlassIcon
          name={secaoAtiva === 'inscricoes' ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={16}
          boxSize={32}
          borderRadius={10}
          accentColor={secaoAtiva === 'inscricoes' ? palette.primary : palette.textSecondary}
          borderColor="rgba(148, 163, 184, 0.25)"
        />
      </TouchableOpacity>

      {secaoAtiva === 'inscricoes' ? (
        <View style={[styles.expandedPanel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.panelSectionHeading, { color: palette.primary, fontSize: fs(11) }]}>
            CADASTRO DE EQUIPE — OLIMPÍADAS IFPI
          </Text>

          <Text style={[styles.inputLabel, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Nome da Equipe
          </Text>
          <TextInput
            style={[styles.textInput, { color: palette.text, borderColor: palette.border, backgroundColor: palette.surfaceElevated }]}
            placeholder="Ex: Treliça de Titânio IFPI"
            placeholderTextColor={palette.textMuted}
            value={nomeEquipe}
            onChangeText={setNomeEquipe}
          />

          <Text style={[styles.inputLabel, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Modalidade
          </Text>
          <View style={styles.modalityChoicesRow}>
            {OLIMPIADAS_DADOS.modalidades.map((m) => {
              const sel = modalidadeEscolhida === m.nome;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.modPill,
                    {
                      borderColor: sel ? palette.primary : palette.border,
                      backgroundColor: sel ? palette.primaryMuted : palette.surfaceElevated,
                    },
                  ]}
                  onPress={() => setModalidadeEscolhida(m.nome)}
                >
                  <Ionicons
                    name={m.icone}
                    size={12}
                    color={sel ? palette.primary : palette.textSecondary}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[styles.modPillText, { color: sel ? palette.primary : palette.textSecondary, fontSize: fs(11) }]}>
                    {m.nome}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.inputLabel, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Integrantes e Período
          </Text>
          <TextInput
            style={[styles.textInput, { color: palette.text, borderColor: palette.border, backgroundColor: palette.surfaceElevated }]}
            placeholder="Ex: João Silva, Maria Souza (6º Período)"
            placeholderTextColor={palette.textMuted}
            value={integrantes}
            onChangeText={setIntegrantes}
          />

          <View style={styles.calcInputsRow}>
            <View style={styles.calcField}>
              <Text style={[styles.inputLabel, { color: palette.textSecondary, fontSize: fs(11) }]}>
                Massa Estimada (g)
              </Text>
              <TextInput
                style={[styles.textInput, { color: palette.text, borderColor: palette.border, backgroundColor: palette.surfaceElevated }]}
                keyboardType="numeric"
                value={massaEstimada}
                onChangeText={setMassaEstimada}
              />
            </View>
            <View style={styles.calcField}>
              <Text style={[styles.inputLabel, { color: palette.textSecondary, fontSize: fs(11) }]}>
                Carga Prevista (kgf)
              </Text>
              <TextInput
                style={[styles.textInput, { color: palette.text, borderColor: palette.border, backgroundColor: palette.surfaceElevated }]}
                keyboardType="numeric"
                value={cargaEstimada}
                onChangeText={setCargaEstimada}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitTeamButton, { backgroundColor: palette.primary }]}
            onPress={handleInscreverEquipe}
          >
            <Ionicons name="checkmark-done-circle-outline" size={18} color="#06101a" />
            <Text style={[styles.submitTeamBtnText, { fontSize: fs(14) }]}>
              Registrar Equipe na Competição
            </Text>
          </TouchableOpacity>

          {mensagemSucesso ? (
            <Text style={[styles.feedbackText, { color: palette.primary, fontSize: fs(12) }]}>
              {mensagemSucesso}
            </Text>
          ) : null}
        </View>
      ) : null}

      {/* 4. Resultados */}
      <TouchableOpacity
        style={[
          styles.menuCard,
          {
            backgroundColor: palette.glassCard || palette.surfaceElevated,
            borderColor: secaoAtiva === 'resultados' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => setSecaoAtiva(secaoAtiva === 'resultados' ? '' : 'resultados')}
        activeOpacity={0.85}
      >
        <DarkGlassIcon
          name="podium-outline"
          size={21}
          boxSize={44}
          borderRadius={13}
          accentColor="#fbbf24"
          borderColor="rgba(251, 191, 36, 0.35)"
          active={secaoAtiva === 'resultados'}
          style={{ marginRight: 14 }}
        />
        <View style={styles.menuInfo}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Resultados
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Ranking oficial • {equipesOlimpiadas.length} equipes homologadas
          </Text>
        </View>
        <DarkGlassIcon
          name={secaoAtiva === 'resultados' ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={16}
          boxSize={32}
          borderRadius={10}
          accentColor={secaoAtiva === 'resultados' ? palette.primary : palette.textSecondary}
          borderColor="rgba(148, 163, 184, 0.25)"
        />
      </TouchableOpacity>

      {secaoAtiva === 'resultados' ? (
        <View style={[styles.expandedPanel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.panelSectionHeading, { color: palette.primary, fontSize: fs(11) }]}>
            QUADRO DE EQUIPES E CLASSIFICAÇÃO PRELIMINAR
          </Text>
          {equipesOlimpiadas.map((eq, index) => (
            <View key={eq.id} style={[styles.teamRow, { borderColor: palette.border }]}>
              <DarkGlassIcon
                name={index === 0 ? 'trophy' : 'medal-outline'}
                size={16}
                boxSize={36}
                borderRadius={11}
                accentColor={index === 0 ? '#fbbf24' : palette.primary}
                borderColor={index === 0 ? 'rgba(251, 191, 36, 0.48)' : 'rgba(0, 255, 204, 0.28)'}
                style={{ marginRight: 12 }}
              />
              <View style={styles.teamInfo}>
                <Text style={[styles.teamName, { color: palette.text, fontSize: fs(14) }]}>
                  {index + 1}º • {eq.nomeEquipe}
                </Text>
                <Text style={[styles.teamMod, { color: palette.primary, fontSize: fs(11) }]}>
                  {eq.modalidade} • {eq.status}
                </Text>
                <Text style={[styles.teamMembers, { color: palette.textSecondary, fontSize: fs(11) }]}>
                  {eq.integrantes}
                </Text>
              </View>
              <View style={styles.scoreCol}>
                <Text style={[styles.scoreVal, { color: palette.accentGold, fontSize: fs(15) }]}>
                  {eq.pontuacaoTotal}
                </Text>
                <Text style={[styles.scoreUnit, { color: palette.textSecondary, fontSize: fs(10) }]}>
                  pts
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}
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
  heroCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  heroSpecularLine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTextContent: {
    flex: 1,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  heroTagText: {
    color: '#00ffcc',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginLeft: 5,
  },
  heroTitle: {
    color: '#ffffff',
    fontWeight: '900',
    lineHeight: 23,
  },
  heroSubtitle: {
    color: '#cbd5e1',
    marginTop: 5,
    fontWeight: '600',
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontWeight: '800',
  },
  menuSubtitle: {
    marginTop: 2,
    fontWeight: '500',
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 10,
  },
  openBadgeText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  expandedPanel: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    marginTop: -4,
  },
  panelSectionHeading: {
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 12,
  },
  modItem: {
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
  },
  modHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  modTitle: {
    fontWeight: '800',
    marginLeft: 10,
    flex: 1,
  },
  modDesc: {
    lineHeight: 19,
    marginBottom: 8,
  },
  prizeBadgeRow: {
    flexDirection: 'row',
  },
  ruleBox: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  ruleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  ruleTitle: {
    fontWeight: '800',
    flex: 1,
  },
  weightBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  weightText: {
    fontWeight: '800',
  },
  ruleFormula: {
    fontWeight: '700',
    marginTop: 6,
  },
  ruleDesc: {
    marginTop: 3,
    lineHeight: 18,
  },
  calcCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  calcHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  calcTitle: {
    fontWeight: '800',
    marginLeft: 10,
    flex: 1,
  },
  calcInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calcField: {
    width: '48%',
  },
  calcLabel: {
    fontWeight: '700',
    marginBottom: 4,
  },
  calcInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontWeight: '700',
  },
  calcResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  calcResultText: {
    marginLeft: 6,
    fontWeight: '700',
    flex: 1,
  },
  inputLabel: {
    fontWeight: '700',
    marginBottom: 5,
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontWeight: '600',
  },
  modalityChoicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 6,
  },
  modPillText: {
    fontWeight: '700',
  },
  submitTeamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 14,
  },
  submitTeamBtnText: {
    color: '#06101a',
    fontWeight: '800',
    marginLeft: 8,
  },
  feedbackText: {
    marginTop: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  teamInfo: {
    flex: 1,
    paddingRight: 8,
  },
  teamName: {
    fontWeight: '800',
  },
  teamMod: {
    fontWeight: '700',
    marginTop: 2,
  },
  teamMembers: {
    marginTop: 2,
  },
  scoreCol: {
    alignItems: 'flex-end',
  },
  scoreVal: {
    fontWeight: '900',
  },
  scoreUnit: {
    fontWeight: '700',
  },
});
