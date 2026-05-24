import { Redirect } from 'expo-router';
import { useBankStore } from '../store/useBankStore';
import { ROUTES } from '../constants/config';

export default function Index() {
  const { isAuthenticated } = useBankStore();

  if (isAuthenticated) {
    return <Redirect href={ROUTES.HOME as any} />;
  }

  return <Redirect href={ROUTES.LOGIN as any} />;
}