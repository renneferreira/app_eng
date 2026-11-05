import React, { createContext, useContext, useState, useEffect } from 'react';
import { PALETTES, FONT_SCALES, TYPOGRAPHY } from '../styles/theme';
import {
  PROGRAMACAO_INICIAL,
  PALESTRANTES_INICIAIS,
  MINICURSOS_INICIAIS,
  OLIMPIADAS_DADOS,
} from '../data/mockData';
import {
  sincronizarDadosEvento,
  obterFavoritosCache,
  salvarFavoritosCache,
  obterMinicursosCache,
  salvarMinicursosCache,
  obterEquipesOlimpiadasCache,
  salvarEquipesOlimpiadasCache,
  obterAcessibilidadeCache,
  salvarAcessibilidadeCache,
  salvarProgramacaoCache,
  restaurarCachePadrao,
} from '../services/storageService';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [themeMode, setThemeModeState] = useState('dark');
  const [fontScaleId, setFontScaleIdState] = useState('normal');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [programacao, setProgramacao] = useState(PROGRAMACAO_INICIAL);
  const [palestrantes, setPalestrantes] = useState(PALESTRANTES_INICIAIS);
  const [minicursos, setMinicursos] = useState(MINICURSOS_INICIAIS);
  const [inscricoesMinicursos, setInscricoesMinicursos] = useState([]);
  const [favoritos, setFavoritos] = useState(['prog-1', 'prog-3']);
  const [equipesOlimpiadas, setEquipesOlimpiadas] = useState(OLIMPIADAS_DADOS.rankingInicial);
  const [lastSync, setLastSync] = useState(new Date().toISOString());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const carregarEstadoInicial = async () => {
      const [syncData, favs, minicursosData, equipes, acessConfig] = await Promise.all([
        sincronizarDadosEvento(),
        obterFavoritosCache(),
        obterMinicursosCache(),
        obterEquipesOlimpiadasCache(),
        obterAcessibilidadeCache(),
      ]);

      if (syncData?.programacao) setProgramacao(syncData.programacao);
      if (syncData?.palestrantes) setPalestrantes(syncData.palestrantes);
      if (syncData?.lastSync) setLastSync(syncData.lastSync);
      if (favs) setFavoritos(favs);
      if (minicursosData?.minicursos) setMinicursos(minicursosData.minicursos);
      if (minicursosData?.inscricoes) setInscricoesMinicursos(minicursosData.inscricoes);
      if (equipes) setEquipesOlimpiadas(equipes);

      if (acessConfig) {
        if (acessConfig.themeMode && PALETTES[acessConfig.themeMode]) {
          setThemeModeState(acessConfig.themeMode);
        }
        if (acessConfig.fontScaleId && FONT_SCALES[acessConfig.fontScaleId]) {
          setFontScaleIdState(acessConfig.fontScaleId);
        }
        if (typeof acessConfig.notificationsEnabled === 'boolean') {
          setNotificationsEnabled(acessConfig.notificationsEnabled);
        }
      }
    };

    carregarEstadoInicial();
  }, []);

  const persistirAcessibilidade = (novoTheme, novoFontScale, novasNotifs) => {
    salvarAcessibilidadeCache({
      themeMode: novoTheme,
      fontScaleId: novoFontScale,
      notificationsEnabled: novasNotifs,
    });
  };

  const setThemeMode = (novoTheme) => {
    if (PALETTES[novoTheme]) {
      setThemeModeState(novoTheme);
      persistirAcessibilidade(novoTheme, fontScaleId, notificationsEnabled);
    }
  };

  const setFontScale = (novoScaleId) => {
    if (FONT_SCALES[novoScaleId]) {
      setFontScaleIdState(novoScaleId);
      persistirAcessibilidade(themeMode, novoScaleId, notificationsEnabled);
    }
  };

  const toggleNotifications = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    persistirAcessibilidade(themeMode, fontScaleId, next);
  };

  const toggleFavorito = async (eventoId) => {
    const jaFavorito = favoritos.includes(eventoId);
    const novosFavoritos = jaFavorito
      ? favoritos.filter((id) => id !== eventoId)
      : [...favoritos, eventoId];
    setFavoritos(novosFavoritos);
    await salvarFavoritosCache(novosFavoritos);
  };

  const alternarInscricaoMinicurso = async (cursoId) => {
    const jaInscrito = inscricoesMinicursos.includes(cursoId);
    let novasInscricoes = [...inscricoesMinicursos];

    const novosCursos = minicursos.map((curso) => {
      if (curso.id !== cursoId) return curso;
      if (jaInscrito) {
        novasInscricoes = novasInscricoes.filter((id) => id !== cursoId);
        const novasVagas = curso.vagasDisponiveis + 1;
        return {
          ...curso,
          vagasDisponiveis: novasVagas,
          statusTipo: novasVagas === 0 ? 'encerrado' : novasVagas <= 5 ? 'poucas' : 'disponivel',
        };
      } else {
        if (curso.vagasDisponiveis <= 0) return curso;
        novasInscricoes.push(cursoId);
        const novasVagas = curso.vagasDisponiveis - 1;
        return {
          ...curso,
          vagasDisponiveis: novasVagas,
          statusTipo: novasVagas === 0 ? 'encerrado' : novasVagas <= 5 ? 'poucas' : 'disponivel',
        };
      }
    });

    setMinicursos(novosCursos);
    setInscricoesMinicursos(novasInscricoes);
    await salvarMinicursosCache(novosCursos, novasInscricoes);
  };

  const inscreverEquipeOlimpiada = async ({ nomeEquipe, modalidade, integrantes, massaG, cargaPrevistaKgf }) => {
    const massaNum = Number(massaG) || 550;
    const cargaPrevNum = Number(cargaPrevistaKgf) || 45;
    const novaEquipe = {
      id: `eq-${Date.now()}`,
      nomeEquipe: nomeEquipe.trim(),
      modalidade,
      integrantes: integrantes.trim(),
      massaG: massaNum,
      cargaPrevistaKgf: cargaPrevNum,
      cargaRealKgf: cargaPrevNum,
      pontuacaoTotal: Number((85 + Math.min(14, (cargaPrevNum / (massaNum / 1000)) * 0.12)).toFixed(1)),
      status: 'Inscrita (Pendente Ensaio)',
    };
    const novasEquipes = [novaEquipe, ...equipesOlimpiadas];
    setEquipesOlimpiadas(novasEquipes);
    await salvarEquipesOlimpiadasCache(novasEquipes);
    return novaEquipe;
  };

  const forcarSincronizacao = async () => {
    setIsSyncing(true);
    await salvarProgramacaoCache(programacao);
    const agora = new Date().toISOString();
    setLastSync(agora);
    setTimeout(() => {
      setIsSyncing(false);
    }, 500);
  };

  const resetarCache = async () => {
    setIsSyncing(true);
    await restaurarCachePadrao();
    setProgramacao(PROGRAMACAO_INICIAL);
    setMinicursos(MINICURSOS_INICIAIS);
    setInscricoesMinicursos([]);
    setFavoritos(['prog-1', 'prog-3']);
    setEquipesOlimpiadas(OLIMPIADAS_DADOS.rankingInicial);
    setLastSync(new Date().toISOString());
    setIsSyncing(false);
  };

  const palette = PALETTES[themeMode] || PALETTES.dark;
  const fontScaleObj = FONT_SCALES[fontScaleId] || FONT_SCALES.normal;
  const fs = (size) => TYPOGRAPHY.scaleSize(size, fontScaleObj.multiplier);

  return (
    <AppContext.Provider
      value={{
        palette,
        themeMode,
        setThemeMode,
        fontScaleId,
        fontScaleObj,
        setFontScale,
        fs,
        notificationsEnabled,
        toggleNotifications,
        programacao,
        palestrantes,
        minicursos,
        inscricoesMinicursos,
        favoritos,
        equipesOlimpiadas,
        lastSync,
        isSyncing,
        toggleFavorito,
        alternarInscricaoMinicurso,
        inscreverEquipeOlimpiada,
        forcarSincronizacao,
        resetarCache,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return ctx;
};

