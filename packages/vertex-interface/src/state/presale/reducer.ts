import { createReducer } from '@reduxjs/toolkit'
import { Field, typeInput } from './actions'

export interface PresaleState {
  readonly valueETH: string
  readonly valueVERTX: string
}

const initialState: PresaleState = {
  valueETH: '',
  valueVERTX: ''
}

export default createReducer<PresaleState>(initialState, builder =>
  builder.addCase(typeInput, (state, { payload: { field, typedValue } }) => {
    if (field === Field.ETH) {
      return {
        ...state,
        valueETH: typedValue
      }
    } else {
      return {
        ...state,
        valueVERTX: typedValue
      }
    }
  })
)
