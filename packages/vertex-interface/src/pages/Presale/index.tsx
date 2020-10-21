import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowDown } from 'react-feather'
import { ThemeContext } from 'styled-components'
import AppBody from '../AppBody'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { useCurrency } from '../../hooks/Tokens'
import { Wrapper } from '../../components/swap/styleds'
import { usePresaleState, usePresaleActionHandlers } from '../../state/presale/hooks'

export default function Presale() {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const ethCurrency = useCurrency('ETH')
  const vertxCurrency = useCurrency('VERTX')
  const { valueETH, valueVERTX } = usePresaleState()
  const { onETHInput, onVERTXInput } = usePresaleActionHandlers()

  return (
    <>
      <AppBody>
        <Wrapper id="presale-page">
          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
              label={t('youAreSending')}
              value={valueETH}
              showMaxButton={true}
              currency={ethCurrency}
              onUserInput={onETHInput}
              disableCurrencySelect={true}
              otherCurrency={vertxCurrency}
              id="presale-eth-input"
            />
            <ColumnCenter>
              <ArrowDown size="16" color={theme.text2} />
            </ColumnCenter>
            <CurrencyInputPanel
              label={t('youAreBuying')}
              value={valueVERTX}
              showMaxButton={true}
              currency={vertxCurrency}
              onUserInput={onVERTXInput}
              disableCurrencySelect={true}
              otherCurrency={ethCurrency}
              id="presale-eth-input"
            />
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
