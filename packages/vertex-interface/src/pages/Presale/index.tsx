import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowDown } from 'react-feather'
import { ThemeContext } from 'styled-components'
import AppBody from '../AppBody'
import { Text } from 'rebass'
import { ButtonError, ButtonLight } from '../../components/Button'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { useCurrency } from '../../hooks/Tokens'
import { BottomGrouping, Wrapper } from '../../components/swap/styleds'
import { useDerivedPresaleInfo, usePresaleActionHandlers } from '../../state/presale/hooks'
import { Field } from '../../state/presale/actions'
import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { usePresaleCallback } from '../../hooks/usePresaleCallback'

export default function Presale() {
  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  const { t } = useTranslation()
  const etherCurrency = useCurrency('ETH')
  const vertxCurrency = useCurrency('VERTX')
  const { independentField, dependentField, typedValue, parsedAmounts } = useDerivedPresaleInfo(
    etherCurrency,
    vertxCurrency
  )
  const { onETHInput, onVERTXInput } = usePresaleActionHandlers()

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const { callback } = usePresaleCallback(account, parsedAmounts[Field.ETHER])

  return (
    <>
      <AppBody>
        <Wrapper id="presale-page">
          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
              label={t('youAreSending')}
              value={formattedAmounts[Field.ETHER]}
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
              value={formattedAmounts[Field.VERTX]}
              hideBalance={true}
              showMaxButton={false}
              currency={vertxCurrency}
              onUserInput={onVERTXInput}
              disableCurrencySelect={true}
              otherCurrency={etherCurrency}
              id="presale-eth-input"
            />
          </AutoColumn>
          <BottomGrouping>
            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
            ) : (
              <ButtonError
                onClick={() => {
                  if (callback) {
                    callback()
                  }
                }}
                id="presale-button"
                // disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                // error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
              >
                <Text fontSize={20} fontWeight={500}>
                  Invest
                </Text>
              </ButtonError>
            )}
          </BottomGrouping>
        </Wrapper>
      </AppBody>
    </>
  )
}
