import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useBankStore } from '../../store/useBankStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import { APP_CONFIG } from '../../constants/config';

export default function LoginScreen() {
  const [pin, setPin] = useState('');
  const { login, isLoading } = useBankStore();

  const handleLogin = async () => {
    if (pin.length < APP_CONFIG.PIN_LENGTH) {
      Alert.alert(STRINGS.COMMON.ERROR, STRINGS.LOGIN.ERR_LENGTH);
      return;
    }
    const success = await login(pin);
    if (!success) {
      Alert.alert(STRINGS.LOGIN.ERR_FAILED_TITLE, STRINGS.LOGIN.ERR_FAILED_MSG);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Lock color={COLORS.white} size={32} />
        </View>
        <Text style={styles.title}>{STRINGS.APP_NAME}</Text>
        <Text style={styles.subtitle}>{STRINGS.LOGIN.SUBTITLE}</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={STRINGS.LOGIN.PLACEHOLDER}
          keyboardType="numeric"
          secureTextEntry
          maxLength={APP_CONFIG.PIN_LENGTH}
          value={pin}
          onChangeText={setPin}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>{STRINGS.LOGIN.BUTTON}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20
  },
  iconContainer: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 24,
    marginBottom: 16
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textMain
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8
  },
  form: {
    paddingHorizontal: 24
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 4
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: COLORS.primaryDisabled
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold'
  }
});