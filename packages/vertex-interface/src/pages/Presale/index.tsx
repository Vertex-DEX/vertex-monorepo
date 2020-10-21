import React from 'react'
import AppBody from '../AppBody'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { useCurrency } from '../../hooks/Tokens'
import { Wrapper } from '../../components/swap/styleds'

export default function Presale() {
  const ethCurrency = useCurrency('ETH')
  const vertxCurrency = useCurrency('VERTX')

  return (
    <>
      <AppBody>
        <Wrapper id="presale-page">
          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
              label="Invest"
              value="100"
              showMaxButton={true}
              currency={ethCurrency}
              onUserInput={}
              disableCurrencySelect={true}
              otherCurrency={vertxCurrency}
              id="presale-eth-input"
            />
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
