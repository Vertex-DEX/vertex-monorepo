import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Field, typeInput } from './actions'
import { AppDispatch, AppState } from '../index'

export function usePresaleState(): AppState['presale'] {
  return useSelector<AppState, AppState['presale']>(state => state.presale)
}

export function usePresaleActionHandlers(): {
  onETHInput: (typedValue: string) => void
  onVERTXInput: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onETHInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.ETH, typedValue }))
    },
    [dispatch]
  )
  const onVERTXInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.VERTX, typedValue }))
    },
    [dispatch]
  )

  return {
    onETHInput,
    onVERTXInput
  }
}
