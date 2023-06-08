import * as yup from 'yup';
import { preferenceValidationSchema } from 'validationSchema/preferences';

export const reservationValidationSchema = yup.object().shape({
  date: yup.date().required(),
  time: yup.date().required(),
  number_of_guests: yup.number().integer().required(),
  customer_id: yup.string().nullable().required(),
  table_id: yup.string().nullable().required(),
  preference: yup.array().of(preferenceValidationSchema),
});
