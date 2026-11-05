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

export default function OlimpiadasScreen() {
  const { palette, fs, equipesOlimpiadas, inscreverEquipeOlimpiada } = useApp();

  // Controla qual seção interativa está expandida ('modalidades' | 'regulamento' | 'inscricoes' | 'resultados')
  const [secaoAtiva, setSecaoAtiva] = useState('modalidades');

  // Estado do formulário de inscrição de equipe
  const [nomeEquipe, setNomeEquipe] = useState('');
  const [modalidadeEscolhida, setModalidadeEscolhida] = useState('Estruturas (Ponte Treliçada)');
  const [integrantes, setIntegrantes] = useState('');
  const [massaEstimada, setMassaEstimada] = useState('550');
  const [cargaEstimada, setCargaEstimada] = useState('50');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // Estado do Simulador de Eficiência Estrutural (Seção 7 do Guia .md)
  const [simMassaG, setSimMassaG] = useState('520');
  const [simCargaKgf, setSimCargaKgf] = useState('54');

  const calcularEficiencia = () => {
    const mKg = ( parseFloat(simMassaG) || 500 ) / 1000;
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
      {/* Hero Banner com Troféu (Fiel à Tela 5 do Infográfico) */}
      <View style={[styles.heroCard, { backgroundColor: palette.bannerBg, borderColor: palette.border }]}>
        <View style={styles.heroRow}>
          <View style={styles.trophyContainer}>
            <Ionicons name="trophy" size={50} color="#fbbf24" />
          </View>
          <View style={styles.heroTextContent}>
            <Text style={[styles.heroTitle, { fontSize: fs(18) }]}>
              {OLIMPIADAS_DADOS.titulo}
            </Text>
            <Text style={[styles.heroSubtitle, { fontSize: fs(12) }]}>
              {OLIMPIADAS_DADOS.subtitulo}
            </Text>
          </View>
        </View>
      </View>

      {/* Os 4 Cards Principais da Tela 5 do Infográfico */}
      {/* 1. Modalidades */}
      <TouchableOpacity
        style={[
          styles.menuCard,
          {
            backgroundColor: palette.surfaceElevated,
            borderColor: secaoAtiva === 'modalidades' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => setSecaoAtiva(secaoAtiva === 'modalidades' ? '' : 'modalidades')}
        activeOpacity={0.85}
      >
        <View style={[styles.menuIconWrap, { backgroundColor: palette.primaryMuted }]}>
          <Ionicons name="layers-outline" size={22} color={palette.primary} />
        </View>
        <View style={styles.menuInfo}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Modalidades
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Estruturas • Topografia • Orçamento
          </Text>
        </View>
        <Ionicons
          name={secaoAtiva === 'modalidades' ? 'chevron-down' : 'chevron-forward'}
          size={20}
          color={palette.textSecondary}
        />
      </TouchableOpacity>

      {secaoAtiva === 'modalidades' ? (
        <View style={[styles.expandedPanel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          {OLIMPIADAS_DADOS.modalidades.map((mod) => (
            <View key={mod.id} style={[styles.modItem, { borderBottomColor: palette.border }]}>
              <View style={styles.modHeader}>
                <Ionicons name={mod.icone} size={18} color={palette.primary} />
                <Text style={[styles.modTitle, { color: palette.text, fontSize: fs(14) }]}>
                  {mod.nome}
                </Text>
              </View>
              <Text style={[styles.modDesc, { color: palette.textSecondary, fontSize: fs(13) }]}>
                {mod.detalhes}
              </Text>
              <Text style={[styles.modPrize, { color: palette.accentGold, fontSize: fs(12) }]}>
                🏆 {mod.premio}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* 2. Regulamento e Regras de Pontuação */}
      <TouchableOpacity
        style={[
          styles.menuCard,
          {
            backgroundColor: palette.surfaceElevated,
            borderColor: secaoAtiva === 'regulamento' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => setSecaoAtiva(secaoAtiva === 'regulamento' ? '' : 'regulamento')}
        activeOpacity={0.85}
      >
        <View style={[styles.menuIconWrap, { backgroundColor: palette.primaryMuted }]}>
          <Ionicons name="document-text-outline" size={22} color={palette.primary} />
        </View>
        <View style={styles.menuInfo}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Regulamento
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Regras e critérios de avaliação
          </Text>
        </View>
        <Ionicons
          name={secaoAtiva === 'regulamento' ? 'chevron-down' : 'chevron-forward'}
          size={20}
          color={palette.textSecondary}
        />
      </TouchableOpacity>

      {secaoAtiva === 'regulamento' ? (
        <View style={[styles.expandedPanel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.panelSectionHeading, { color: palette.primary, fontSize: fs(12) }]}>
            CRITÉRIOS DE PONTUAÇÃO OFICIAIS
          </Text>
          {OLIMPIADAS_DADOS.regrasPontuacao.map((regra, idx) => (
            <View key={idx} style={[styles.ruleBox, { borderColor: palette.border }]}>
              <View style={styles.ruleTopRow}>
                <Text style={[styles.ruleTitle, { color: palette.text, fontSize: fs(14) }]}>
                  {regra.criterio}
                </Text>
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

          {/* Simulador Interativo de Eficiência Estrutural */}
          <View style={[styles.calcCard, { backgroundColor: palette.surfaceElevated, borderColor: palette.primary }]}>
            <Text style={[styles.calcTitle, { color: palette.primary, fontSize: fs(13) }]}>
              ⚡ Simulador de Eficiência Estrutural (Ponte Treliçada)
            </Text>
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
            <Text style={[styles.calcResultText, { color: palette.text, fontSize: fs(14) }]}>
              Eficiência Calculada (EE):{' '}
              <Text style={{ color: palette.primary, fontWeight: '900' }}>
                {resultadoSimulacao.ee} kgf/kg
              </Text>
              {resultadoSimulacao.penalidade ? ' (Com redutor por excesso > 750g)' : ''}
            </Text>
          </View>
        </View>
      ) : null}

      {/* 3. Inscrições (Com badge verde "Aberto" igual ao Infográfico) */}
      <TouchableOpacity
        style={[
          styles.menuCard,
          {
            backgroundColor: palette.surfaceElevated,
            borderColor: secaoAtiva === 'inscricoes' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => setSecaoAtiva(secaoAtiva === 'inscricoes' ? '' : 'inscricoes')}
        activeOpacity={0.85}
      >
        <View style={[styles.menuIconWrap, { backgroundColor: palette.primaryMuted }]}>
          <Ionicons name="create-outline" size={22} color={palette.primary} />
        </View>
        <View style={styles.menuInfo}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Inscrições
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            {OLIMPIADAS_DADOS.prazoInscricao}
          </Text>
        </View>
        <View style={styles.openBadge}>
          <Text style={[styles.openBadgeText, { fontSize: fs(11) }]}>
            {OLIMPIADAS_DADOS.statusInscricao}
          </Text>
        </View>
        <Ionicons
          name={secaoAtiva === 'inscricoes' ? 'chevron-down' : 'chevron-forward'}
          size={20}
          color={palette.textSecondary}
        />
      </TouchableOpacity>

      {secaoAtiva === 'inscricoes' ? (
        <View style={[styles.expandedPanel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.panelSectionHeading, { color: palette.primary, fontSize: fs(12) }]}>
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
                    { borderColor: sel ? palette.primary : palette.border, backgroundColor: sel ? palette.primaryMuted : palette.surfaceElevated },
                  ]}
                  onPress={() => setModalidadeEscolhida(m.nome)}
                >
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
            <Ionicons name="checkmark-circle" size={18} color="#0d1b2a" />
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
            backgroundColor: palette.surfaceElevated,
            borderColor: secaoAtiva === 'resultados' ? palette.primary : palette.border,
          },
        ]}
        onPress={() => setSecaoAtiva(secaoAtiva === 'resultados' ? '' : 'resultados')}
        activeOpacity={0.85}
      >
        <View style={[styles.menuIconWrap, { backgroundColor: palette.primaryMuted }]}>
          <Ionicons name="podium-outline" size={22} color={palette.primary} />
        </View>
        <View style={styles.menuInfo}>
          <Text style={[styles.menuTitle, { color: palette.text, fontSize: fs(15) }]}>
            Resultados
          </Text>
          <Text style={[styles.menuSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            Em breve • {equipesOlimpiadas.length} equipes homologadas
          </Text>
        </View>
        <Ionicons
          name={secaoAtiva === 'resultados' ? 'chevron-down' : 'chevron-forward'}
          size={20}
          color={palette.textSecondary}
        />
      </TouchableOpacity>

      {secaoAtiva === 'resultados' ? (
        <View style={[styles.expandedPanel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.panelSectionHeading, { color: palette.primary, fontSize: fs(12) }]}>
            QUADRO DE EQUIPES E CLASSIFICAÇÃO PRELIMINAR
          </Text>
          {equipesOlimpiadas.map((eq, index) => (
            <View key={eq.id} style={[styles.teamRow, { borderColor: palette.border }]}>
              <View style={[styles.rankCircle, { backgroundColor: index === 0 ? '#eab308' : palette.primaryMuted }]}>
                <Text style={[styles.rankText, { color: index === 0 ? '#0d1b2a' : palette.primary, fontSize: fs(13) }]}>
                  {index + 1}º
                </Text>
              </View>
              <View style={styles.teamInfo}>
                <Text style={[styles.teamName, { color: palette.text, fontSize: fs(14) }]}>
                  {eq.nomeEquipe}
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: 'rgba(251, 191, 36, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroTextContent: {
    flex: 1,
  },
  heroTitle: {
    color: '#ffffff',
    fontWeight: '900',
    lineHeight: 24,
  },
  heroSubtitle: {
    color: '#cbd5e1',
    marginTop: 6,
    fontWeight: '600',
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  menuIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
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
    backgroundColor: '#16a34a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  openBadgeText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  expandedPanel: {
    padding: 16,
    borderRadius: 12,
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
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  modHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  modTitle: {
    fontWeight: '800',
    marginLeft: 8,
  },
  modDesc: {
    lineHeight: 19,
    marginBottom: 6,
  },
  modPrize: {
    fontWeight: '700',
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
  ruleTitle: {
    fontWeight: '800',
    flex: 1,
  },
  weightBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  weightText: {
    fontWeight: '800',
  },
  ruleFormula: {
    fontWeight: '700',
    marginTop: 4,
  },
  ruleDesc: {
    marginTop: 3,
    lineHeight: 18,
  },
  calcCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  calcTitle: {
    fontWeight: '800',
    marginBottom: 10,
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
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontWeight: '700',
  },
  calcResultText: {
    marginTop: 10,
    fontWeight: '700',
  },
  inputLabel: {
    fontWeight: '700',
    marginBottom: 5,
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontWeight: '600',
  },
  modalityChoicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
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
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  submitTeamBtnText: {
    color: '#0d1b2a',
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
  rankCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontWeight: '900',
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

