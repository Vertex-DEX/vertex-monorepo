import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { CurrencyAmount } from '@vertex/sdk'
import { useCallback } from 'react'
import { useTransactionAdder } from '../state/transactions/hooks'
import { usePresaleContribution, usePresaleMaximumContribution, usePresaleMinimumContribution } from '../data/Presale'
import { useActiveWeb3React } from './index'
import useENS from './useENS'
import { usePresaleContract } from './useContract'
import { calculateGasMargin } from '../utils'
import { BigNumber } from '@ethersproject/bignumber'

export enum PresaleState {
  INVALID,
  LOADING,
  VALID
}

function toHex(currencyAmount: CurrencyAmount) {
  return `0x${currencyAmount.raw.toString(16)}`
}

export function usePresaleCallback(
  recipientAddressOrName: string | null | undefined,
  amount: CurrencyAmount | undefined
): { state: PresaleState; callback: null | (() => Promise<void>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const beneficiary: string | undefined = recipient === null ? undefined : recipient
  const contract: Contract | null = usePresaleContract()
  const contribution = usePresaleContribution(beneficiary)
  const maxContribution = usePresaleMaximumContribution()
  const minContribution = usePresaleMinimumContribution()

  const addTransaction = useTransactionAdder()

  const presaleCallback = useCallback(async (): Promise<void> => {
    if (!contract) {
      console.error('no contract')
      return
    }

    if (!amount) {
      console.error('missing amount to approve')
      return
    }

    if (!beneficiary) {
      console.error('no beneficiary')
      return
    }

    const value: string = toHex(amount)

    const gasEstimate = await contract.estimateGas
      .buyTokens(beneficiary, { value })
      .then(estimate => estimate)
      .catch(gasError => {
        console.error('Gas estimate failed', gasError)
        return BigNumber.from(200000)
      })

    return contract
      .buyTokens(beneficiary, {
        gasLimit: calculateGasMargin(gasEstimate),
        value,
        from: account
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Contributed ${amount.toSignificant(4)} ${amount.currency.symbol}`
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to buy tokens using ETH', error)
        throw error
      })
  }, [contract, account, amount, beneficiary, addTransaction])

  if (!library || !account || !chainId || !contract) {
    return { state: PresaleState.INVALID, callback: null, error: 'Missing dependencies' }
  }

  if (!recipient) {
    if (recipientAddressOrName !== null) {
      return { state: PresaleState.INVALID, callback: null, error: 'Invalid recipient' }
    } else {
      return { state: PresaleState.LOADING, callback: null, error: 'Loading...' }
    }
  }

  if (!amount) {
    return { state: PresaleState.INVALID, callback: null, error: 'Enter an amount' }
  }

  if (!contribution || !minContribution || !maxContribution) {
    return { state: PresaleState.LOADING, callback: null, error: null }
  }

  if (amount.lessThan(minContribution)) {
    return { state: PresaleState.INVALID, callback: null, error: 'Min. contribution = 0.2 ETH' }
  }

  if (contribution.add(amount).greaterThan(maxContribution)) {
    return { state: PresaleState.INVALID, callback: null, error: 'Max. contribution = 20 ETH' }
  }

  return { state: PresaleState.VALID, callback: presaleCallback, error: null }
}
