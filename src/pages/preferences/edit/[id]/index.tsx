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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getPreferenceById, updatePreferenceById } from 'apiSdk/preferences';
import { Error } from 'components/error';
import { preferenceValidationSchema } from 'validationSchema/preferences';
import { PreferenceInterface } from 'interfaces/preference';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ReservationInterface } from 'interfaces/reservation';
import { getReservations } from 'apiSdk/reservations';

function PreferenceEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PreferenceInterface>(
    () => (id ? `/preferences/${id}` : null),
    () => getPreferenceById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PreferenceInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePreferenceById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PreferenceInterface>({
    initialValues: data,
    validationSchema: preferenceValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Preference
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'preference',
  operation: AccessOperationEnum.UPDATE,
})(PreferenceEditPage);
