import * as yup from 'yup';
import { tableValidationSchema } from 'validationSchema/tables';

export const restaurantValidationSchema = yup.object().shape({
  name: yup.string().required(),
  organization_id: yup.string().nullable().required(),
  table: yup.array().of(tableValidationSchema),
});
