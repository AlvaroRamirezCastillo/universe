import {
  demoAccounts,
  InMemoryAccountRepository,
  ListAccounts,
  type Account,
} from '@universe/accounts';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const listAccounts = new ListAccounts(new InMemoryAccountRepository(demoAccounts));

export function AccountScreen() {
  const [accounts, setAccounts] = useState<readonly Account[] | null>(null);
  const [accountsError, setAccountsError] = useState(false);

  useEffect(() => {
    let active = true;

    listAccounts.execute().then(
      (items) => {
        if (active) setAccounts(items);
      },
      () => {
        if (active) setAccountsError(true);
      },
    );

    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Universe · React Native</Text>
      <Text accessibilityRole="header" style={styles.heading}>
        Cuentas
      </Text>
      {accountsError ? (
        <Text accessibilityRole="alert">No se pudieron cargar las cuentas.</Text>
      ) : accounts === null ? (
        <Text>Cargando cuentas…</Text>
      ) : accounts.length === 0 ? (
        <Text>No hay cuentas disponibles.</Text>
      ) : (
        accounts.map((account) => (
          <View key={account.id} style={styles.account}>
            <Text>{account.name}</Text>
            <Text>{account.email}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
  },
  account: {
    alignItems: 'center',
    gap: 4,
  },
});
