import React, { useEffect } from 'react';
import store from '@/modules/redux-store';

export default function useDataInit() {
  const {} = store.getState();
}
