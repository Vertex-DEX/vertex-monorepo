import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Currency, CurrencyAmount } from '@vertex/sdk'
import { Field, typeInput } from './actions'
import { AppDispatch, AppState } from '../index'
import { tryParseAmount } from '../swap/hooks'
import { useActiveWeb3React } from '../../hooks'

export function usePresaleState(): AppState['presale'] {
  return useSelector<AppState, AppState['presale']>(state => state.presale)
}

export function useDerivedPresaleInfo(
  etherCurrency: Currency | undefined | null,
  vertxCurrency: Currency | undefined | null
): {
  independentField: Field
  dependentField: Field
  typedValue: string
  formattedAmounts: { [field in Field]: string }
} {
  const { chainId } = useActiveWeb3React()

  const { independentField, typedValue, otherTypedValue } = usePresaleState()

  const dependentField = independentField === Field.ETHER ? Field.VERTX : Field.ETHER

  // currencies
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.ETHER]: etherCurrency ?? undefined,
      [Field.VERTX]: vertxCurrency ?? undefined
    }),
    [etherCurrency, vertxCurrency]
  )

  const independentAmount: CurrencyAmount | undefined = tryParseAmount(typedValue, currencies[independentField])
  const dependentAmount: CurrencyAmount | undefined = useMemo(() => {
    if (independentAmount) {
      const fraction =
        dependentField === Field.VERTX ? independentAmount.multiply('200000') : independentAmount.divide('200000')
      return CurrencyAmount.ether(fraction.multiply('1000000000000000000').quotient)
    } else {
      return undefined
    }
  }, [otherTypedValue, currencies, dependentField, independentAmount, etherCurrency, chainId, vertxCurrency])

  const independentFormattedAmount: string = independentAmount?.toSignificant(6) ?? ''
  const dependentFormattedAmount: string = dependentAmount?.toSignificant(6) ?? ''

  const formattedAmounts: { [field in Field]: string } = {
    [Field.ETHER]: independentField === Field.ETHER ? independentFormattedAmount : dependentFormattedAmount,
    [Field.VERTX]: independentField === Field.ETHER ? dependentFormattedAmount : independentFormattedAmount
  }

  return {
    independentField,
    dependentField,
    typedValue,
    formattedAmounts
  }
}

export function usePresaleActionHandlers(): {
  onETHInput: (typedValue: string) => void
  onVERTXInput: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onETHInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.ETHER, typedValue }))
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
