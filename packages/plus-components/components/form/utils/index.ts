import { FieldValueType } from '../../field'
import { PlusFormItem } from '../inferface'

export const genPlusFormItem = <T extends FieldValueType>(
  formItem: PlusFormItem<T>
) => formItem
