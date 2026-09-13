import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type CasesStackParamList = {
  MyCases: undefined;
  CaseDetail: { id: number };
};

export type TabParamList = {
  Cases: NavigatorScreenParams<CasesStackParamList>;
  Submit: undefined;
  Evidence: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TabParamList {}
  }
}
