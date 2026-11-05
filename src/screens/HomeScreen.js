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
import { DarkGlassIcon, DarkGlassPill, DeveloperGlassCard } from '../components/DarkGlassIcon';

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
      sub: 'Agenda diária',
      icon: 'calendar-outline',
      accent: '#00ffcc',
      onPress: () => navigation.navigate('Programação'),
    },
    {
      id: 'atalho-mini',
      label: 'Minicursos',
      sub: 'CAD, BIM & RPA',
      icon: 'layers-outline',
      accent: '#38bdf8',
      onPress: () => navigation.navigate('Minicursos'),
    },
    {
      id: 'atalho-pal',
      label: 'Palestrantes',
      sub: 'Corpo técnico',
      icon: 'people-outline',
      accent: '#a78bfa',
      onPress: () => navigation.navigate('Palestrantes'),
    },
    {
      id: 'atalho-olimp',
      label: 'Olimpíadas',
      sub: 'Pontes & Ensaio',
      icon: 'trophy-outline',
      accent: '#fbbf24',
      onPress: () => navigation.navigate('Olimpíadas'),
    },
    {
      id: 'atalho-cult',
      label: 'Atividades\nCulturais',
      sub: 'Integração',
      icon: 'musical-notes-outline',
      accent: '#fb7185',
      onPress: () => navigation.navigate('Programação', { filtroCategoria: 'Atividade Cultural' }),
    },
    {
      id: 'atalho-info',
      label: 'Informações',
      sub: 'Mapa & Suporte',
      icon: 'compass-outline',
      accent: '#34d399',
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
      {/* Cabeçalho com Logo do Curso + Badge Dark Glass */}
      <View
        style={[
          styles.headerLogoRow,
          {
            backgroundColor: palette.glassCard || palette.surfaceElevated,
            borderColor: palette.glassBorder || palette.border,
          },
        ]}
      >
        <View style={styles.logoBadgeWrapper}>
          <Image
            source={require('../../assets/logo-curso-ifpi.png')}
            style={styles.cursoLogo}
          />
        </View>
        <View style={styles.headerTextWrap}>
          <View style={styles.instRow}>
            <Ionicons name="school-outline" size={12} color={palette.primary} />
            <Text style={[styles.headerSubtitle, { color: palette.textSecondary, fontSize: fs(11) }]}>
              {EVENTO_INFO.instituicao.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.headerTitle, { color: palette.text, fontSize: fs(18) }]}>
            {EVENTO_INFO.titulo}
          </Text>
          <View style={styles.pwaBadgeRow}>
            <View style={[styles.offlinePill, { backgroundColor: palette.primaryMuted, borderColor: palette.primary }]}>
              <Ionicons name="shield-checkmark-outline" size={11} color={palette.primary} />
              <Text style={[styles.offlinePillText, { color: palette.primary, fontSize: fs(10) }]}>
                PWA • Cache Offline Ativo
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Card de Destaque / Hero Banner em Estilo Apple Dark Glass */}
      <View
        style={[
          styles.bannerCard,
          {
            backgroundColor: palette.bannerBg,
            borderColor: palette.glassBorder || palette.border,
          },
        ]}
      >
        <View style={styles.bannerSpecularTop} />

        <View style={styles.bannerTopRow}>
          <View style={styles.dateBadge}>
            <Ionicons name="calendar-outline" size={14} color="#06101a" />
            <Text style={[styles.bannerDate, { fontSize: fs(12) }]}>
              20 a 24 de outubro de 2025
            </Text>
          </View>
          <DarkGlassIcon
            name="construct-outline"
            size={18}
            boxSize={38}
            borderRadius={11}
            accentColor={palette.primary}
            glassBg="rgba(6, 16, 28, 0.65)"
            borderColor="rgba(0, 255, 204, 0.35)"
          />
        </View>

        <Text style={[styles.bannerTitle, { color: '#ffffff', fontSize: fs(21) }]}>
          Engenharia que conecta pessoas, ideias e o futuro.
        </Text>

        <View style={styles.lemaRow}>
          <Ionicons name="sparkles-outline" size={13} color={palette.primary} />
          <Text style={[styles.bannerSub, { color: '#cbd5e1', fontSize: fs(12) }]}>
            {EVENTO_INFO.lema}
          </Text>
        </View>

        {/* Indicadores rápidos em cápsulas Dark Glass */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <DarkGlassIcon
              name="calendar-clear-outline"
              size={15}
              boxSize={30}
              borderRadius={9}
              accentColor={palette.primary}
              style={{ marginBottom: 5 }}
            />
            <Text style={[styles.statNumber, { color: palette.primary, fontSize: fs(16) }]}>
              {programacao.length}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fs(11) }]}>Atividades</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <DarkGlassIcon
              name="layers-outline"
              size={15}
              boxSize={30}
              borderRadius={9}
              accentColor="#38bdf8"
              borderColor="rgba(56, 189, 248, 0.32)"
              style={{ marginBottom: 5 }}
            />
            <Text style={[styles.statNumber, { color: '#38bdf8', fontSize: fs(16) }]}>
              {totalVagasRestantes}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fs(11) }]}>Vagas Minicursos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <DarkGlassIcon
              name="bookmark-outline"
              size={15}
              boxSize={30}
              borderRadius={9}
              accentColor={palette.accentGold}
              borderColor="rgba(234, 179, 8, 0.35)"
              style={{ marginBottom: 5 }}
            />
            <Text style={[styles.statNumber, { color: palette.accentGold, fontSize: fs(16) }]}>
              {favoritos.length}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fs(11) }]}>Na Agenda</Text>
          </View>
        </View>
      </View>

      {/* Grid de Acesso Rápido 2x3 com Ícones Squircle Apple Dark Glass */}
      <View style={styles.quickGrid}>
        {atalhos.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.quickCard,
              {
                backgroundColor: palette.glassCard || palette.surfaceElevated,
                borderColor: palette.border,
              },
            ]}
            onPress={item.onPress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <View style={styles.quickCardSpecular} />
            <DarkGlassIcon
              name={item.icon}
              size={22}
              boxSize={44}
              borderRadius={13}
              accentColor={item.accent}
              glassBg="rgba(8, 18, 32, 0.82)"
              borderColor={`${item.accent}48`}
              style={{ marginBottom: 8 }}
            />
            <Text
              style={[
                styles.quickLabel,
                { color: palette.text, fontSize: fs(12) },
              ]}
              numberOfLines={2}
            >
              {item.label}
            </Text>
            <Text
              style={[
                styles.quickSubLabel,
                { color: palette.textSecondary, fontSize: fs(10) },
              ]}
              numberOfLines={1}
            >
              {item.sub}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Seção Em Destaque */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          <DarkGlassIcon
            name="sparkles-outline"
            size={15}
            boxSize={28}
            borderRadius={8}
            accentColor={palette.primary}
          />
          <Text style={[styles.sectionTitle, { color: palette.text, fontSize: fs(17), marginLeft: 8 }]}>
            Em destaque
          </Text>
        </View>
        <DarkGlassPill
          label="Ver agenda"
          rightIcon="arrow-forward-outline"
          accentColor={palette.primary}
          textColor={palette.primary}
          glassBg={palette.primaryMuted}
          borderColor={palette.primary}
          fontSize={fs(11)}
          onPress={() => navigation.navigate('Programação')}
        />
      </View>

      {destaques.map((evento) => {
        const isFav = favoritos.includes(evento.id);
        return (
          <TouchableOpacity
            key={evento.id}
            style={[
              styles.eventCard,
              {
                backgroundColor: palette.glassCard || palette.surfaceElevated,
                borderColor: palette.border,
              },
            ]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Programação', { destaqueId: evento.id })}
          >
            <View style={styles.eventCardTop}>
              <View style={styles.eventBadgeWrap}>
                <DarkGlassIcon
                  name={evento.icone || 'mic-outline'}
                  size={18}
                  boxSize={36}
                  borderRadius={10}
                  accentColor={palette.primary}
                  style={{ marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.eventTime, { color: palette.primary, fontSize: fs(11) }]}>
                    {evento.dia} • {evento.hora} — {evento.subtituloDestaque || evento.tipo}
                  </Text>
                  <Text style={[styles.eventCardTitle, { color: palette.text, fontSize: fs(15) }]}>
                    {evento.titulo}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => toggleFavorito(evento.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel={isFav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              >
                <DarkGlassIcon
                  name={isFav ? 'bookmark' : 'bookmark-outline'}
                  size={17}
                  boxSize={34}
                  borderRadius={10}
                  accentColor={isFav ? palette.accentGold : palette.textSecondary}
                  borderColor={isFav ? 'rgba(234, 179, 8, 0.45)' : 'rgba(148, 163, 184, 0.25)'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.speakerMetaRow}>
              <Ionicons name="person-circle-outline" size={15} color={palette.textSecondary} />
              <Text style={[styles.eventSpeaker, { color: palette.textSecondary, fontSize: fs(13) }]}>
                {evento.palestrante}
              </Text>
            </View>

            <View style={styles.eventFooterRow}>
              <DarkGlassPill
                icon="location-outline"
                label={evento.local}
                accentColor={palette.primary}
                textColor={palette.textSecondary}
                fontSize={fs(11)}
              />
              <DarkGlassPill
                label="Inspecionar"
                rightIcon="chevron-forward-outline"
                accentColor={palette.primary}
                textColor={palette.primary}
                borderColor="rgba(0, 255, 204, 0.28)"
                fontSize={fs(11)}
              />
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Seção Meus Favoritos & Inscrições */}
      <View style={[styles.sectionHeaderRow, { marginTop: 10 }]}>
        <View style={styles.sectionTitleWithIcon}>
          <DarkGlassIcon
            name="bookmarks-outline"
            size={15}
            boxSize={28}
            borderRadius={8}
            accentColor={palette.accentGold}
            borderColor="rgba(234, 179, 8, 0.35)"
          />
          <Text style={[styles.sectionTitle, { color: palette.text, fontSize: fs(16), marginLeft: 8 }]}>
            Sua Agenda Salva ({eventosFavoritados.length})
          </Text>
        </View>
        {inscricoesMinicursos.length > 0 ? (
          <DarkGlassPill
            icon="checkmark-circle-outline"
            label={`${inscricoesMinicursos.length} minicurso(s)`}
            accentColor={palette.primary}
            textColor={palette.primary}
            onPress={() => navigation.navigate('Minicursos')}
          />
        ) : null}
      </View>

      {eventosFavoritados.length === 0 ? (
        <View style={[styles.emptyFavBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <DarkGlassIcon
            name="bookmark-outline"
            size={20}
            boxSize={40}
            borderRadius={12}
            accentColor={palette.primary}
            style={{ marginBottom: 8 }}
          />
          <Text style={[styles.emptyFavText, { color: palette.textSecondary, fontSize: fs(13) }]}>
            Toque no ícone de marcador em qualquer atividade da Programação para salvá-la nos seus favoritos offline.
          </Text>
        </View>
      ) : (
        eventosFavoritados.map((favItem) => (
          <View
            key={`fav-${favItem.id}`}
            style={[
              styles.favMiniCard,
              {
                backgroundColor: palette.glassCard || palette.surface,
                borderColor: palette.border,
              },
            ]}
          >
            <DarkGlassIcon
              name={favItem.icone || 'calendar-outline'}
              size={17}
              boxSize={36}
              borderRadius={10}
              accentColor={palette.primary}
              style={{ marginRight: 10 }}
            />
            <View style={styles.favTimeColumn}>
              <Text style={[styles.favDayText, { color: palette.primary, fontSize: fs(11) }]}>
                {favItem.dia}
              </Text>
              <Text style={[styles.favHourText, { color: palette.text, fontSize: fs(13) }]}>
                {favItem.hora}
              </Text>
            </View>
            <View style={styles.favInfoColumn}>
              <Text style={[styles.favTitleText, { color: palette.text, fontSize: fs(13) }]}>
                {favItem.titulo}
              </Text>
              <Text style={[styles.favLocalText, { color: palette.textSecondary, fontSize: fs(11) }]}>
                {favItem.local} • {favItem.palestrante}
              </Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorito(favItem.id)}>
              <DarkGlassIcon
                name="bookmark"
                size={16}
                boxSize={32}
                borderRadius={9}
                accentColor={palette.accentGold}
                borderColor="rgba(234, 179, 8, 0.42)"
              />
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Card Oficial do Desenvolvedor: Rennê Santos (@oxe.renne) */}
      <DeveloperGlassCard palette={palette} fs={fs} compact />
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
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  logoBadgeWrapper: {
    width: 58,
    height: 58,
    borderRadius: 16,
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
    borderRadius: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  instRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontWeight: '800',
    letterSpacing: 0.8,
    marginLeft: 5,
  },
  headerTitle: {
    fontWeight: '900',
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
    borderRadius: 10,
    borderWidth: 1,
  },
  offlinePillText: {
    fontWeight: '700',
    marginLeft: 4,
  },
  bannerCard: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 18,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerSpecularTop: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
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
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bannerDate: {
    color: '#06101a',
    fontWeight: '800',
    marginLeft: 6,
  },
  bannerTitle: {
    fontWeight: '900',
    lineHeight: 28,
    marginBottom: 8,
  },
  lemaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerSub: {
    fontWeight: '600',
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(6, 14, 24, 0.62)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: '900',
  },
  statLabel: {
    color: '#cbd5e1',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickCard: {
    width: '31.5%',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  quickCardSpecular: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  quickLabel: {
    fontWeight: '800',
    textAlign: 'center',
  },
  quickSubLabel: {
    marginTop: 2,
    fontWeight: '600',
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
  eventCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  eventCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventBadgeWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  eventTime: {
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  eventCardTitle: {
    fontWeight: '800',
    marginTop: 3,
    lineHeight: 20,
  },
  speakerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  eventSpeaker: {
    marginLeft: 6,
    fontWeight: '600',
  },
  eventFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  emptyFavBox: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyFavText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  favMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  favTimeColumn: {
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: 'rgba(148, 163, 184, 0.22)',
    alignItems: 'center',
    minWidth: 54,
  },
  favDayText: {
    fontWeight: '800',
  },
  favHourText: {
    fontWeight: '700',
  },
  favInfoColumn: {
    flex: 1,
    paddingHorizontal: 10,
  },
  favTitleText: {
    fontWeight: '800',
  },
  favLocalText: {
    marginTop: 2,
  },
});
