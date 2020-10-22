import { createAction } from '@reduxjs/toolkit'

export enum Field {
  ETHER = 'ETHER',
  VERTX = 'VERTX'
}

export const typeInput = createAction<{ field: Field; typedValue: string }>('presale/typeInput')
