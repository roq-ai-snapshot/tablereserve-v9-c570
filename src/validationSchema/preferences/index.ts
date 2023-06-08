import * as yup from 'yup';

export const preferenceValidationSchema = yup.object().shape({
  dietary_restriction: yup.string(),
  favorite_dish: yup.string(),
  reservation_id: yup.string().nullable().required(),
});
