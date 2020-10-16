import React from 'react'
import styled from 'styled-components'

import { AlertTriangle } from 'react-feather'

const BetaAlert = styled.div<{ isActive: any }>`
  position: fixed;
  display: flex;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 18px;
  padding: 2px 6px;
  background-color: ${({ theme }) => theme.yellow1};
  color: ${({ theme }) => theme.black};
  font-size: 11px;
  justify-content: space-between;
  align-items: center;
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
`

export default function BetaWarning() {
  return (
    <BetaAlert isActive={true}>
      <div style={{ display: 'flex' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={12} /> The product is in beta phase, please use at your own
        risk!
      </div>
    </BetaAlert>
  )
}
