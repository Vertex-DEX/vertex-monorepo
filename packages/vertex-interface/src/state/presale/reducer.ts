import { createReducer } from '@reduxjs/toolkit'
import { Field, typeInput } from './actions'

export interface PresaleState {
  readonly independentField: Field
  readonly typedValue: string
  readonly otherTypedValue: string
}

const initialState: PresaleState = {
  independentField: Field.ETHER,
  typedValue: '',
  otherTypedValue: ''
}

export default createReducer<PresaleState>(initialState, builder =>
  builder.addCase(typeInput, (state, { payload: { field, typedValue } }) => {
    if (field === state.independentField) {
      return {
        ...state,
        independentField: field,
        typedValue
      }
    } else {
      return {
        ...state,
        independentField: field,
        typedValue,
        otherTypedValue: state.typedValue
      }
    }
  })
)
