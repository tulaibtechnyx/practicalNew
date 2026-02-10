import { configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./reducers";
import thunkMiddleware from "redux-thunk";

const masterReducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    // preserve state on client side navigation
    if (state.count) nextState.count = state.count;
    return nextState;
  } else {
    return rootReducer(state, action);
  }
};

const makeStore = () => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    // On server, always create a fresh store
    return configureStore({
      reducer: masterReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });
  } else {
    // On client, handle persistence
    const persistConfig = {
      key: "root",
      storage,
    };

    const persistedReducer = persistReducer(persistConfig, masterReducer);

    const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
          thunk: true,
        }),
    });

    store.__persistor = persistStore(store); // expose persistor for App

    return store;
  }
};

// Legacy compatibility: some components call configureStores() manually
let clientStore;
export const configureStores = () => {
  if (typeof window === "undefined") return { store: makeStore() };
  if (!clientStore) clientStore = makeStore();
  return { store: clientStore, persistor: clientStore.__persistor };
};

export const wrapper = createWrapper(makeStore);
export default configureStores;