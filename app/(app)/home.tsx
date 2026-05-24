import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView
} from 'react-native';
import { useBankStore, Transaction } from '../../store/useBankStore';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, LogOut, SlidersHorizontal } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import { ROUTES } from '../../constants/config';

type FilterType = 'ALL' | 'INCOMING' | 'OUTGOING';
type SortType = 'DATE_DESC' | 'DATE_ASC' | 'AMOUNT_DESC' | 'AMOUNT_ASC';

export default function HomeScreen() {
  const { transactions, fetchTransactions, isLoading, logout } = useBankStore();
  const router = useRouter();

  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sort, setSort] = useState<SortType>('DATE_DESC');

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const displayedTransactions = useMemo(() => {
    let result = [...transactions];

    if (filter === 'INCOMING') result = result.filter((t) => t.amount > 0);
    if (filter === 'OUTGOING') result = result.filter((t) => t.amount < 0);

    result.sort((a, b) => {
      switch (sort) {
        case 'DATE_DESC':
          return new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime();
        case 'DATE_ASC':
          return new Date(a.transferDate).getTime() - new Date(b.transferDate).getTime();
        case 'AMOUNT_DESC':
          return b.amount - a.amount;
        case 'AMOUNT_ASC':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return result;
  }, [transactions, filter, sort]);

  const renderItem = ({ item }: { item: Transaction }) => {
    const isIncoming = item.amount > 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`${ROUTES.TRANSACTION_BASE}${item.refId}` as any)}
      >
        <View style={styles.iconCircle}>
          {isIncoming ? (
            <ArrowDownLeft color={COLORS.success} />
          ) : (
            <ArrowUpRight color={COLORS.danger} />
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.transferName}>{item.transferName}</Text>
          <Text style={styles.dateText}>
            {format(new Date(item.transferDate), 'MMM dd, yyyy • HH:mm')}
          </Text>
        </View>
        <Text style={[styles.amount, isIncoming ? styles.amountIncoming : styles.amountOutgoing]}>
          {isIncoming ? '+' : ''}${item.amount.toFixed(2)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPill = (label: string, isActive: boolean, onPress: () => void) => (
    <TouchableOpacity style={[styles.pill, isActive && styles.pillActive]} onPress={onPress}>
      <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{STRINGS.HOME.TITLE}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <LogOut color={COLORS.textMuted} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.controlsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.controlsScroll}
        >
          <View style={styles.controlGroup}>
            <SlidersHorizontal color={COLORS.textMuted} size={16} style={styles.sliderIcon} />
            {renderPill(STRINGS.HOME.FILTERS.ALL, filter === 'ALL', () => setFilter('ALL'))}
            {renderPill(STRINGS.HOME.FILTERS.INCOMING, filter === 'INCOMING', () => setFilter('INCOMING'))}
            {renderPill(STRINGS.HOME.FILTERS.OUTGOING, filter === 'OUTGOING', () => setFilter('OUTGOING'))}
          </View>

          <View style={styles.dividerVertical} />

          <View style={styles.controlGroup}>
            {renderPill(STRINGS.HOME.SORTS.LATEST, sort === 'DATE_DESC', () => setSort('DATE_DESC'))}
            {renderPill(STRINGS.HOME.SORTS.OLDEST, sort === 'DATE_ASC', () => setSort('DATE_ASC'))}
            {renderPill(STRINGS.HOME.SORTS.HIGHEST, sort === 'AMOUNT_DESC', () => setSort('AMOUNT_DESC'))}
            {renderPill(STRINGS.HOME.SORTS.LOWEST, sort === 'AMOUNT_ASC', () => setSort('AMOUNT_ASC'))}
          </View>
        </ScrollView>
      </View>

      {isLoading && transactions.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={displayedTransactions}
          keyExtractor={(item) => item.refId}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchTransactions} />}
          ListEmptyComponent={<Text style={styles.emptyText}>{STRINGS.HOME.EMPTY_LIST}</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textMain
  },
  logoutBtn: {
    padding: 8,
    backgroundColor: COLORS.iconBg,
    borderRadius: 12
  },
  controlsContainer: {
    marginBottom: 16
  },
  controlsScroll: {
    paddingHorizontal: 16,
    alignItems: 'center'
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sliderIcon: {
    marginRight: 8
  },
  dividerVertical: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.borderDark,
    marginHorizontal: 12
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  pillText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted
  },
  pillTextActive: {
    color: COLORS.white
  },
  loader: {
    flex: 1,
    justifyContent: 'center'
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  infoContainer: {
    flex: 1
  },
  transferName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4
  },
  dateText: {
    fontSize: 13,
    color: COLORS.textMuted
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  amountIncoming: {
    color: COLORS.success
  },
  amountOutgoing: {
    color: COLORS.textMain
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: 40
  }
});