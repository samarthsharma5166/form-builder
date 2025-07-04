"use client";

import { useContext } from 'react'
import { DesignerContext } from '../context/DesignerContext';

function useDesigner() {
  const context = useContext(DesignerContext);

  return context
}

export default useDesigner