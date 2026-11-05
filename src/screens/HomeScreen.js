import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { EVENTO_INFO } from '../data/mockData';

export default function HomeScreen({ navigation }) {
  const {
    palette,
    fs,
    programacao,
    favoritos,
    toggleFavorito,
    inscricoesMinicursos,
    minicursos,
  } = useApp();

  const destaques = programacao.filter((item) => item.destaque);
  const eventosFavoritados = programacao.filter((item) => favoritos.includes(item.id));

  const atalhos = [
    {
      id: 'atalho-prog',
      label: 'Programação',
      icon: 'calendar-outline',
      onPress: () => navigation.navigate('Programação'),
    },
    {
      id: 'atalho-mini',
      label: 'Minicursos',
      icon: 'book-outline',
      onPress: () => navigation.navigate('Minicursos'),
    },
    {
      id: 'atalho-pal',
      label: 'Palestrantes',
      icon: 'person-outline',
      onPress: () => navigation.navigate('Palestrantes'),
    },
    {
      id: 'atalho-olimp',
      label: 'Olimpíadas',
      icon: 'trophy-outline',
      onPress: () => navigation.navigate('Olimpíadas'),
    },
    {
      id: 'atalho-cult',
      label: 'Atividades\nCulturais',
      icon: 'musical-notes-outline',
      onPress: () => navigation.navigate('Programação', { filtroCategoria: 'Atividade Cultural' }),
    },
    {
      id: 'atalho-info',
      label: 'Informações',
      icon: 'information-circle-outline',
      onPress: () => navigation.navigate('Mais'),
    },
  ];

  const totalVagasRestantes = minicursos.reduce((acc, c) => acc + c.vagasDisponiveis, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho com Logo do Curso (conforme Guia de Desenvolvimento) */}
      <View style={[styles.headerLogoRow, { borderBottomColor: palette.border }]}>
        <View style={styles.logoBadgeWrapper}>
          <Image
            source={require('../../assets/logo-curso-ifpi.png')}
            style={styles.cursoLogo}
          />
        </View>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.headerSubtitle, { color: palette.textSecondary, fontSize: fs(12) }]}>
            {EVENTO_INFO.instituicao.toUpperCase()}
          </Text>
          <Text style={[styles.headerTitle, { color: palette.text, fontSize: fs(18) }]}>
            {EVENTO_INFO.titulo}
          </Text>
          <View style={styles.pwaBadgeRow}>
            <View style={[styles.offlinePill, { backgroundColor: palette.primaryMuted, borderColor: palette.primary }]}>
              <Ionicons name="flash" size={11} color={palette.primary} />
              <Text style={[styles.offlinePillText, { color: palette.primary, fontSize: fs(10) }]}>
                PWA • Cache Offline Ativo
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Card de Destaque / Hero Banner (Fiel à Tela 1 do Infográfico) */}
      <View style={[styles.bannerCard, { backgroundColor: palette.bannerBg, borderColor: palette.border }]}>
        <View style={styles.bannerTopRow}>
          <View style={styles.dateBadge}>
            <Ionicons name="calendar" size={14} color="#0d1b2a" />
            <Text style={[styles.bannerDate, { fontSize: fs(12) }]}>
              20 a 24 de outubro de 2025
            </Text>
          </View>
          <View style={styles.craneSilhouetteBadge}>
            <Ionicons name="construct" size={18} color={palette.primary} />
          </View>
        </View>

        <Text style={[styles.bannerTitle, { color: '#ffffff', fontSize: fs(21) }]}>
          Engenharia que conecta pessoas, ideias e o futuro.
        </Text>
        <Text style={[styles.bannerSub, { color: '#cbd5e1', fontSize: fs(12) }]}>
          {EVENTO_INFO.lema}
        </Text>

        {/* Indicadores rápidos */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: palette.primary, fontSize: fs(16) }]}>
              {programacao.length}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fs(11) }]}>Atividades</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: palette.primary, fontSize: fs(16) }]}>
              {totalVagasRestantes}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fs(11) }]}>Vagas em Minicursos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: palette.primary, fontSize: fs(16) }]}>
              {favoritos.length}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fs(11) }]}>Favoritos</Text>
          </View>
        </View>
      </View>

      {/* Grid de Acesso Rápido 2x3 (Fiel à Tela 1 do Infográfico) */}
      <View style={styles.quickGrid}>
        {atalhos.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.quickCard,
              { backgroundColor: palette.surfaceElevated, borderColor: palette.border },
            ]}
            onPress={item.onPress}
            activeOpacity={0.78}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <View style={[styles.quickIconCircle, { backgroundColor: palette.primaryMuted }]}>
              <Ionicons name={item.icon} size={22} color={palette.primary} />
            </View>
            <Text
              style={[
                styles.quickLabel,
                { color: palette.text, fontSize: fs(12) },
              ]}
              numberOfLines={2}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Seção Em Destaque */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: palette.text, fontSize: fs(18) }]}>
          Em destaque
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Programação')}>
          <Text style={[styles.seeAllLink, { color: palette.primary, fontSize: fs(13) }]}>
            Ver agenda completa →
          </Text>
        </TouchableOpacity>
      </View>

      {destaques.map((evento) => {
        const isFav = favoritos.includes(evento.id);
        return (
          <TouchableOpacity
            key={evento.id}
            style={[
              styles.eventCard,
              { backgroundColor: palette.surfaceElevated, borderColor: palette.border },
            ]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Programação', { destaqueId: evento.id })}
          >
            <View style={styles.eventCardTop}>
              <View style={styles.eventBadgeWrap}>
                <Text style={[styles.eventTime, { color: palette.primary, fontSize: fs(12) }]}>
                  {evento.dia} • {evento.hora} — {evento.subtituloDestaque || evento.tipo}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorito(evento.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel={isFav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              >
                <Ionicons
                  name={isFav ? 'star' : 'star-outline'}
                  size={20}
                  color={isFav ? palette.accentGold : palette.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <Text style={[styles.eventCardTitle, { color: palette.text, fontSize: fs(16) }]}>
              {evento.titulo}
            </Text>
            <Text style={[styles.eventSpeaker, { color: palette.textSecondary, fontSize: fs(14) }]}>
              {evento.palestrante}
            </Text>

            <View style={styles.eventFooterRow}>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={palette.primary} />
                <Text style={[styles.locationText, { color: palette.textSecondary, fontSize: fs(12) }]}>
                  {evento.local}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={palette.textSecondary} />
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Seção Meus Favoritos & Inscrições */}
      <View style={[styles.sectionHeaderRow, { marginTop: 10 }]}>
        <View style={styles.sectionTitleWithIcon}>
          <Ionicons name="heart" size={18} color={palette.primary} />
          <Text style={[styles.sectionTitle, { color: palette.text, fontSize: fs(17), marginBottom: 0, marginLeft: 6 }]}>
            Sua Agenda Salva ({eventosFavoritados.length})
          </Text>
        </View>
        {inscricoesMinicursos.length > 0 ? (
          <TouchableOpacity onPress={() => navigation.navigate('Minicursos')}>
            <Text style={[styles.seeAllLink, { color: palette.primary, fontSize: fs(12) }]}>
              {inscricoesMinicursos.length} minicurso(s) inscrito(s)
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {eventosFavoritados.length === 0 ? (
        <View style={[styles.emptyFavBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.emptyFavText, { color: palette.textSecondary, fontSize: fs(13) }]}>
            Toque na estrela ⭐ em qualquer atividade da Programação para salvá-la nos seus favoritos offline.
          </Text>
        </View>
      ) : (
        eventosFavoritados.map((favItem) => (
          <View
            key={`fav-${favItem.id}`}
            style={[
              styles.favMiniCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}
          >
            <View style={styles.favTimeColumn}>
              <Text style={[styles.favDayText, { color: palette.primary, fontSize: fs(11) }]}>
                {favItem.dia}
              </Text>
              <Text style={[styles.favHourText, { color: palette.text, fontSize: fs(14) }]}>
                {favItem.hora}
              </Text>
            </View>
            <View style={styles.favInfoColumn}>
              <Text style={[styles.favTitleText, { color: palette.text, fontSize: fs(14) }]}>
                {favItem.titulo}
              </Text>
              <Text style={[styles.favLocalText, { color: palette.textSecondary, fontSize: fs(12) }]}>
                {favItem.local} • {favItem.palestrante}
              </Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorito(favItem.id)}>
              <Ionicons name="star" size={18} color={palette.accentGold} />
            </TouchableOpacity>
          </View>
        ))
      )}
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
  headerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    borderBottomWidth: 1,
    paddingBottom: 14,
  },
  logoBadgeWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    padding: 3,
  },
  cursoLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 25,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerSubtitle: {
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontWeight: '800',
    marginTop: 2,
  },
  pwaBadgeRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  offlinePillText: {
    fontWeight: '700',
    marginLeft: 4,
  },
  bannerCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00ffcc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  bannerDate: {
    color: '#0d1b2a',
    fontWeight: '800',
    marginLeft: 6,
  },
  craneSilhouetteBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 6,
  },
  bannerSub: {
    fontWeight: '500',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(13, 27, 42, 0.45)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: '800',
  },
  statLabel: {
    color: '#cbd5e1',
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickCard: {
    width: '31.5%',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
  },
  quickIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLabel: {
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: '800',
  },
  seeAllLink: {
    fontWeight: '700',
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  eventCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventBadgeWrap: {
    flex: 1,
    paddingRight: 8,
  },
  eventTime: {
    fontWeight: '800',
  },
  eventCardTitle: {
    fontWeight: '800',
    marginTop: 6,
  },
  eventSpeaker: {
    marginTop: 4,
    fontWeight: '500',
  },
  eventFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 5,
    fontWeight: '600',
  },
  emptyFavBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  emptyFavText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  favMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  favTimeColumn: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(148, 163, 184, 0.25)',
    alignItems: 'center',
    minWidth: 62,
  },
  favDayText: {
    fontWeight: '800',
  },
  favHourText: {
    fontWeight: '700',
  },
  favInfoColumn: {
    flex: 1,
    paddingHorizontal: 12,
  },
  favTitleText: {
    fontWeight: '700',
  },
  favLocalText: {
    marginTop: 2,
  },
});

