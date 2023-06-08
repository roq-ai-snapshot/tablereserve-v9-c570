import * as yup from 'yup';
import { restaurantValidationSchema } from 'validationSchema/restaurants';

export const organizationValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  restaurant: yup.array().of(restaurantValidationSchema),
});
