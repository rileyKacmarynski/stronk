import { Combobox, ComboboxProps } from '@/components/ui/combobox'
import React from 'react'

export type LoadingComboboxProps = ComboboxProps

export default function LoadingCombobox(props: LoadingComboboxProps) {
  return <Combobox {...props} />
}
