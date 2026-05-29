import type { Crop, Expense, Income } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
    type ReactNode,
} from 'react';

const STORAGE_KEY = '@CropTracker:appState';

export type AppState = {
  crops: Crop[];
  expenses: Expense[];
  incomes: Income[];
};

export type AppAction =
  | { type: 'ADD_CROP'; payload: Crop }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'ADD_INCOME'; payload: Income }
  | { type: 'CLOSE_CROP'; payload: { id: string; endDate?: string } }
  | { type: 'DELETE_EXPENSE'; payload: { id: string } }
  | { type: 'DELETE_INCOME'; payload: { id: string } }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  crops: [],
  expenses: [],
  incomes: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_CROP':
      return {
        ...state,
        crops: [...state.crops, action.payload],
      };
    case 'ADD_EXPENSE': {
      const crop = state.crops.find((c) => c.id === action.payload.cropId);
      if (crop?.status === 'closed') {
        return state;
      }

      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    }
    case 'ADD_INCOME': {
      const crop = state.crops.find((c) => c.id === action.payload.cropId);
      if (crop?.status === 'closed') {
        return state;
      }

      return {
        ...state,
        incomes: [...state.incomes, action.payload],
      };
    }
    case 'CLOSE_CROP':
      return {
        ...state,
        crops: state.crops.map((crop) =>
          crop.id === action.payload.id
            ? {
                ...crop,
                status: 'closed',
                endDate: action.payload.endDate ?? crop.endDate,
              }
            : crop
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.payload.id),
      };
    case 'DELETE_INCOME':
      return {
        ...state,
        incomes: state.incomes.filter((i) => i.id !== action.payload.id),
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

type AppContextValue = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  isLoading: boolean;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadState() {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedValue) {
          const parsed = JSON.parse(storedValue) as AppState;
          dispatch({ type: 'LOAD_STATE', payload: parsed });
        }
      } catch {
        // Ignore invalid or missing persisted state.
      } finally {
        setIsLoading(false);
      }
    }

    loadState();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
      // Ignore write failures.
    });
  }, [isLoading, state]);

  return (
    <AppContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
}
