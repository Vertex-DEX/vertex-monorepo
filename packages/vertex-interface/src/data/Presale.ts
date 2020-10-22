import { CurrencyAmount } from '@vertex/sdk'
import { useMemo } from 'react'

import { usePresaleContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

export function usePresaleContribution(beneficiary?: string): CurrencyAmount | undefined {
  const contract = usePresaleContract()

  const inputs = useMemo(() => [beneficiary], [beneficiary])
  const contribution = useSingleCallResult(contract, 'getContribution', inputs).result

  return useMemo(() => (contribution ? CurrencyAmount.ether(contribution.toString()) : undefined), [contribution])
}

export function usePresaleMaximumContribution(): CurrencyAmount | undefined {
  const contract = usePresaleContract()

  const contribution = useSingleCallResult(contract, 'getMaximumContribution').result

  return useMemo(() => (contribution ? CurrencyAmount.ether(contribution.toString()) : undefined), [contribution])
}

export function usePresaleMinimumContribution(): CurrencyAmount | undefined {
  const contract = usePresaleContract()

  const contribution = useSingleCallResult(contract, 'getMinimumContribution').result

  return useMemo(() => (contribution ? CurrencyAmount.ether(contribution.toString()) : undefined), [contribution])
}
