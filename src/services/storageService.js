import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PROGRAMACAO_INICIAL,
  MINICURSOS_INICIAIS,
  PALESTRANTES_INICIAIS,
  OLIMPIADAS_DADOS,
} from '../data/mockData';

const KEYS = {
  PROGRAMACAO: '@programacao_key',
  FAVORITOS: '@favoritos_key',
  MINICURSOS: '@minicursos_key',
  INSCRICOES_MINICURSOS: '@inscricoes_minicursos_key',
  EQUIPES_OLIMPIADAS: '@equipes_olimpiadas_key',
  ACESSIBILIDADE: '@acessibilidade_key',
  LAST_SYNC: '@last_sync_key',
};

// Salvar dados recebidos da API no cache local (Conforme especificação da folha técnica)
export const salvarProgramacaoCache = async (dados) => {
  try {
    await AsyncStorage.setItem(KEYS.PROGRAMACAO, JSON.stringify(dados));
    await AsyncStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
    return true;
  } catch (e) {
    console.error('Erro ao salvar cache', e);
    return false;
  }
};

// Obter dados salvos caso o usuário esteja sem internet (Conforme especificação da folha técnica)
export const obterProgramacaoCache = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.PROGRAMACAO);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Erro ao ler cache', e);
    return null;
  }
};

// Favoritos
export const salvarFavoritosCache = async (favoritosIds) => {
  try {
    await AsyncStorage.setItem(KEYS.FAVORITOS, JSON.stringify(favoritosIds));
  } catch (e) {
    console.error('Erro ao salvar favoritos', e);
  }
};

export const obterFavoritosCache = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.FAVORITOS);
    return jsonValue != null ? JSON.parse(jsonValue) : ['prog-1', 'prog-3'];
  } catch (e) {
    console.error('Erro ao ler favoritos', e);
    return ['prog-1', 'prog-3'];
  }
};

// Minicursos e controle de vagas
export const salvarMinicursosCache = async (minicursos, inscricoesIds) => {
  try {
    await AsyncStorage.setItem(KEYS.MINICURSOS, JSON.stringify(minicursos));
    await AsyncStorage.setItem(KEYS.INSCRICOES_MINICURSOS, JSON.stringify(inscricoesIds));
  } catch (e) {
    console.error('Erro ao salvar minicursos', e);
  }
};

export const obterMinicursosCache = async () => {
  try {
    const [cursosJson, inscJson] = await Promise.all([
      AsyncStorage.getItem(KEYS.MINICURSOS),
      AsyncStorage.getItem(KEYS.INSCRICOES_MINICURSOS),
    ]);
    return {
      minicursos: cursosJson ? JSON.parse(cursosJson) : MINICURSOS_INICIAIS,
      inscricoes: inscJson ? JSON.parse(inscJson) : [],
    };
  } catch (e) {
    console.error('Erro ao ler minicursos', e);
    return { minicursos: MINICURSOS_INICIAIS, inscricoes: [] };
  }
};

// Equipes inscritas nas Olimpíadas
export const salvarEquipesOlimpiadasCache = async (equipes) => {
  try {
    await AsyncStorage.setItem(KEYS.EQUIPES_OLIMPIADAS, JSON.stringify(equipes));
  } catch (e) {
    console.error('Erro ao salvar equipes das olimpíadas', e);
  }
};

export const obterEquipesOlimpiadasCache = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.EQUIPES_OLIMPIADAS);
    return jsonValue != null ? JSON.parse(jsonValue) : OLIMPIADAS_DADOS.rankingInicial;
  } catch (e) {
    console.error('Erro ao ler equipes das olimpíadas', e);
    return OLIMPIADAS_DADOS.rankingInicial;
  }
};

// Configurações de Acessibilidade e Notificações
export const salvarAcessibilidadeCache = async (config) => {
  try {
    await AsyncStorage.setItem(KEYS.ACESSIBILIDADE, JSON.stringify(config));
  } catch (e) {
    console.error('Erro ao salvar configurações de acessibilidade', e);
  }
};

export const obterAcessibilidadeCache = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.ACESSIBILIDADE);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Erro ao ler acessibilidade', e);
    return null;
  }
};

// Simula sincronização REST API + fallback para Cache Local (PWA Ready)
export const sincronizarDadosEvento = async () => {
  try {
    const cachedProgramacao = await obterProgramacaoCache();
    const lastSync = await AsyncStorage.getItem(KEYS.LAST_SYNC);

    if (!cachedProgramacao) {
      await salvarProgramacaoCache(PROGRAMACAO_INICIAL);
    }

    return {
      programacao: cachedProgramacao || PROGRAMACAO_INICIAL,
      palestrantes: PALESTRANTES_INICIAIS,
      lastSync: lastSync || new Date().toISOString(),
      isOfflineCached: true,
    };
  } catch (e) {
    return {
      programacao: PROGRAMACAO_INICIAL,
      palestrantes: PALESTRANTES_INICIAIS,
      lastSync: new Date().toISOString(),
      isOfflineCached: true,
    };
  }
};

export const restaurarCachePadrao = async () => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.PROGRAMACAO,
      KEYS.FAVORITOS,
      KEYS.MINICURSOS,
      KEYS.INSCRICOES_MINICURSOS,
      KEYS.EQUIPES_OLIMPIADAS,
    ]);
    await salvarProgramacaoCache(PROGRAMACAO_INICIAL);
    return true;
  } catch (e) {
    console.error('Erro ao restaurar cache', e);
    return false;
  }
};

