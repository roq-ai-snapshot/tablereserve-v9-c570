import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createPreference } from 'apiSdk/preferences';
import { Error } from 'components/error';
import { preferenceValidationSchema } from 'validationSchema/preferences';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ReservationInterface } from 'interfaces/reservation';
import { getReservations } from 'apiSdk/reservations';
import { PreferenceInterface } from 'interfaces/preference';

function PreferenceCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PreferenceInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPreference(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PreferenceInterface>({
    initialValues: {
      dietary_restriction: '',
      favorite_dish: '',
      reservation_id: (router.query.reservation_id as string) ?? null,
    },
    validationSchema: preferenceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Preference
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="dietary_restriction" mb="4" isInvalid={!!formik.errors?.dietary_restriction}>
            <FormLabel>Dietary Restriction</FormLabel>
            <Input
              type="text"
              name="dietary_restriction"
              value={formik.values?.dietary_restriction}
              onChange={formik.handleChange}
            />
            {formik.errors.dietary_restriction && (
              <FormErrorMessage>{formik.errors?.dietary_restriction}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="favorite_dish" mb="4" isInvalid={!!formik.errors?.favorite_dish}>
            <FormLabel>Favorite Dish</FormLabel>
            <Input
              type="text"
              name="favorite_dish"
              value={formik.values?.favorite_dish}
              onChange={formik.handleChange}
            />
            {formik.errors.favorite_dish && <FormErrorMessage>{formik.errors?.favorite_dish}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ReservationInterface>
            formik={formik}
            name={'reservation_id'}
            label={'Select Reservation'}
            placeholder={'Select Reservation'}
            fetcher={getReservations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.customer_id}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'preference',
  operation: AccessOperationEnum.CREATE,
})(PreferenceCreatePage);
