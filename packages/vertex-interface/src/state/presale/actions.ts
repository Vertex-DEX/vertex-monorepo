import { createAction } from '@reduxjs/toolkit'

export enum Field {
  ETH = 'ETH',
  VERTX = 'VERTX'
}

export const typeInput = createAction<{ field: Field; typedValue: string }>('presale/typeInput')
