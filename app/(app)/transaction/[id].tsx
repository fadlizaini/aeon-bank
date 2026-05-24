import React from 'react';
import { View, Text, StyleSheet, Share, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useBankStore } from '../../../store/useBankStore';
import { format } from 'date-fns';
import { Share as ShareIcon } from 'lucide-react-native';
import { COLORS } from '../../../constants/theme';
import { STRINGS } from '../../../constants/strings';

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams();
  const transactions = useBankStore((state) => state.transactions);

  const transaction = transactions.find((t) => t.refId === id);

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text>{STRINGS.TRANSACTION.NOT_FOUND}</Text>
      </View>
    );
  }

  const isIncoming = transaction.amount > 0;

  const handleShare = async () => {
    try {
      const shareMessage = `
${STRINGS.TRANSACTION.RECEIPT_HEADER}
${STRINGS.TRANSACTION.REF_ID}: ${transaction.refId}
${STRINGS.TRANSACTION.DATE}: ${format(new Date(transaction.transferDate), 'PPpp')}
${STRINGS.TRANSACTION.RECIPIENT}: ${transaction.recipientName}
${STRINGS.TRANSACTION.TRANSFER_TYPE}: ${transaction.transferName}
Amount: $${Math.abs(transaction.amount).toFixed(2)}
${STRINGS.TRANSACTION.RECEIPT_FOOTER}
      `;
      await Share.share({
        message: shareMessage.trim(),
        title: STRINGS.TRANSACTION.RECEIPT_TITLE
      });
    } catch (error: any) {
      Alert.alert(STRINGS.COMMON.ERROR, error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>{STRINGS.TRANSACTION.TOTAL_AMOUNT}</Text>
          <Text style={[styles.amount, isIncoming ? styles.amountIncoming : styles.amountOutgoing]}>
            {isIncoming ? '+' : ''}${transaction.amount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.divider} />

        <DetailRow label={STRINGS.TRANSACTION.REF_ID} value={transaction.refId} />
        <DetailRow
          label={STRINGS.TRANSACTION.DATE}
          value={format(new Date(transaction.transferDate), 'MMMM dd, yyyy • HH:mm:ss')}
        />
        <DetailRow label={STRINGS.TRANSACTION.RECIPIENT} value={transaction.recipientName} />
        <DetailRow label={STRINGS.TRANSACTION.TRANSFER_TYPE} value={transaction.transferName} />
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <ShareIcon color={COLORS.white} size={20} style={styles.shareIcon} />
        <Text style={styles.shareButtonText}>{STRINGS.TRANSACTION.SHARE_BTN}</Text>
      </TouchableOpacity>
    </View>
  );
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  amountLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 8
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold'
  },
  amountIncoming: {
    color: COLORS.success
  },
  amountOutgoing: {
    color: COLORS.textMain
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.iconBg,
    marginBottom: 24
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  rowLabel: {
    fontSize: 15,
    color: COLORS.textMuted,
    flex: 1
  },
  rowValue: {
    fontSize: 15,
    color: COLORS.textMain,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right'
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24
  },
  shareIcon: {
    marginRight: 8
  },
  shareButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold'
  }
});