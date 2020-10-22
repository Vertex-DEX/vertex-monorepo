import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowDown } from 'react-feather'
import { ThemeContext } from 'styled-components'
import AppBody from '../AppBody'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { useCurrency } from '../../hooks/Tokens'
import { Wrapper } from '../../components/swap/styleds'
import { useDerivedPresaleInfo, usePresaleActionHandlers } from '../../state/presale/hooks'
import { Field } from '../../state/presale/actions'

export default function Presale() {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const etherCurrency = useCurrency('ETH')
  const vertxCurrency = useCurrency('VERTX')
  const { independentField, dependentField, typedValue, formattedAmounts } = useDerivedPresaleInfo(
    etherCurrency,
    vertxCurrency
  )
  const { onETHInput, onVERTXInput } = usePresaleActionHandlers()

  const values = {
    [independentField]: typedValue,
    [dependentField]: formattedAmounts[dependentField]
  }

  return (
    <>
      <AppBody>
        <Wrapper id="presale-page">
          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
              label={t('youAreSending')}
              value={values[Field.ETHER]}
              showMaxButton={true}
              currency={etherCurrency}
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
              value={values[Field.VERTX]}
              hideBalance={true}
              showMaxButton={false}
              currency={vertxCurrency}
              onUserInput={onVERTXInput}
              disableCurrencySelect={true}
              otherCurrency={etherCurrency}
              id="presale-eth-input"
            />
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
