import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import styles from './style.module.scss';
import { Checkbox, Typography } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import OutlinedInput from '@mui/material/OutlinedInput';
import { ExecutiveRequest, AllergiesRequest } from "../../store/reducers/executiveReducer"
import { useDispatch, useSelector } from "react-redux"

import Stack from '@mui/material/Stack';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const FormExecutive = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [allergiesLocal, setAllergiesLocal] = useState([])
  const { allergies } = useSelector((state) => state.executive)
  useEffect(() => {
    const cleanedAllergies = allergies.filter((allergy) => allergy.parent !== 0)
    setAllergiesLocal(cleanedAllergies);
  }, [allergies]);

  useEffect(() => {
    AllergiesRequestHandler();
  }, []);

  const ExecutiveRequestHandler = (executiveFormData) => {
    setLoading(true)
    dispatch(ExecutiveRequest({ executiveFormData }))
      .then((res) => {
        setLoading(false)

      })
      .catch((err) => {
        setLoading(false)

      })
  }


  const AllergiesRequestHandler = () => {
    setLoading(true)
    dispatch(AllergiesRequest())
      .then((res) => {
        setLoading(false)

      })
      .catch((err) => {
        setLoading(false)

      })
  }

  const validationSchema = Yup.object({
    company_name: Yup
      .string("Company name is required")
      .min(2, "Company Name should be of minimum 2 characters length")
      .max(30, "Company Name should be of max 20 characters length")
      .required("Company Name is required"),

    first_name: Yup
      .string("First name is required")
      .matches(/^[^\s][a-zA-Z\s]+$/, "Enter your correct first name")
      .min(2, "First Name should be of minimum 2 characters length")
      .max(20, "First Name should be of max 20 characters length")
      .required('First name is required'),

    last_name: Yup
      .string("Last name is required")
      .matches(/^[^\s][a-zA-Z\s]+$/, "Enter your correct Last name")
      .min(2, "Last Name should be of minimum 2 characters length")
      .max(20, "Last Name should be of max 20 characters length")
      .required('Last name is required'),
    email: Yup
      .string("Enter your email")
      .email("Enter a valid email")
      .matches(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        "Enter a valid email"
      )
      .required("Email is required"),
    phone: Yup
      .string("Enter your Phone number")
      .required("Phone number is required")
      .matches(/^[0-9+]{10,14}$/, "Enter a valid Phone number"),

    vegetarian: Yup.boolean().required('Please select if you are vegetarian'),
    dislikes: Yup.string()
      .transform(value => value || "I don't have any dislikes")
      .test('is-valid', 'Please enter up to 3 dislikes only', value => {
        if (!value) return true;
        const dislikesArray = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
        return dislikesArray.length;
      }),

      allergies: Yup.array()
      .min(1, 'Please select at least one allergy')
      .required('Please select your allergies'),
    calorie_size_of_meal: Yup.string().required('Please select meal size'),
    number_of_meals: Yup.number().required('Please select number of meals per day'),
    number_of_snacks: Yup.number().required('Please select number of snacks per day'),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const splitValues = values.dislikes.split(',').map(value => value.trim());
    const allData = {
      ...values, dislikes: splitValues, allergies: values.allergies,
      number_of_meals: parseInt(values.number_of_meals),
      vegetarian: values.vegetarian === 'true' ? true : false,
      number_of_snacks: parseInt(values.number_of_snacks)
    };
    ExecutiveRequestHandler(allData, 'Submitted Data');
    setSubmitting(false);
    resetForm()
  };


  return (

    <Formik
      initialValues={{
        company_name: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        vegetarian: '',
        dislikes: '',
        allergies: '',
        calorie_size_of_meal: '',
        number_of_meals: '',
        number_of_snacks: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >

      {({ values, isSubmitting }) => (

        <Form className={`${styles.mainWrapper} customStyles`}>
          <div className={`${styles.formImages}`}>
            <div className={`${styles.image1}`}>
              <img 
              loading="lazy"
              src='https://practical0001.blob.core.windows.net/public/executiveForm/Picture03.png' alt="" />
            </div>
            <div className={`${styles.image2}`}>
              <img 
              loading="lazy"
              src="https://practical0001.blob.core.windows.net/public/executiveForm/Picture04.png" alt="" />
            </div>
            <div className={`${styles.image3}`}>
              <img 
              loading="lazy"
              src="https://practical0001.blob.core.windows.net/public/executiveForm/Picture02.png" alt="" />
            </div>
            <div className={`${styles.image4}`}>
              <img 
              loading="lazy"
              src="https://practical0001.blob.core.windows.net/public/executiveForm/Picture01.png" alt="" />
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.personalInformationContainer}>
              <div className={styles.personalInformationHeadingContainer}>
                <Typography className={styles.personalInformationHeading}>Personal Information</Typography>
              </div>
              <div className={styles.personalInformationFormContainer}>
                <Field
                  as={OutlinedInput}
                  id="outlined-multiline-flexible"
                  // type='text'
                  placeholder="Complete Company Name *"
                  Complete Company Name
                  className={styles.personalInformationForm}
                  maxRows={4}
                  name="company_name"
                  sx={{
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: 'black',
                      opacity: 1,
                    },
                  }}
                />
                <ErrorMessage name="company_name" component="div" className={styles.ErrorMessage} />

                <Field
                  as={OutlinedInput}
                  id="outlined-multiline-flexible"
                  placeholder="First Name *"
                  First Name
                  className={styles.personalInformationForm}
                  maxRows={4}
                  name="first_name"
                  sx={{
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: 'black',
                      opacity: 1,
                    },
                  }}
                />
                <ErrorMessage name="first_name" component="div" className={styles.ErrorMessage} />

                <Field
                  as={OutlinedInput}
                  id="outlined-multiline-flexible"
                  placeholder="Last Name *"
                  Last Name
                  className={styles.personalInformationForm}
                  maxRows={4}
                  name="last_name"
                  sx={{
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: 'black',
                      opacity: 1,
                    },
                  }}
                />
                <ErrorMessage name="last_name" component="div" className={styles.ErrorMessage} />

                <Field
                  as={OutlinedInput}
                  id="outlined-multiline-flexible"
                  placeholder="Email *"
                  Email
                  className={styles.personalInformationForm}
                  maxRows={4}
                  name="email"
                  sx={{
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: 'black',
                      opacity: 1,
                    },
                  }}
                />
                <ErrorMessage name="email" component="div" className={styles.ErrorMessage} />

                <Field
                  as={OutlinedInput}
                  id="outlined-multiline-flexible"
                  placeholder="Mobile Number *"
                  Mobile Number
                  className={styles.personalInformationForm}
                  maxRows={4}
                  name="phone"
                  sx={{
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: 'black',
                      opacity: 1,
                    },
                  }}
                />
                <ErrorMessage name="phone" component="div" className={styles.ErrorMessage} />

              </div>
            </div>
            <div className={styles.dietryInformationContainer}>
              <div className={styles.dietryInformationHeadingContainer}>
                <Typography className={styles.dietryInformationHeading}>Dietry Information</Typography>
              </div>


              <div className={styles.dietryInformationCardContainer}>
                <div className={styles.dietryInformationCardHeadingContainer}>
                  <Typography className={styles.dietryInformationCardHeading}>Are You Vegetarian? *</Typography>
                </div>
                <div className={styles.dietryInformationCardRadioBtnContainer}>
                  <FormControl>

                    <Field as={RadioGroup} name="vegetarian" row className='radioVegetarian'>

                      <FormControlLabel value={true} control={<Radio />} label="Yes" />
                      <FormControlLabel value={false} control={<Radio />} label="No" />
                    </Field>


                  </FormControl>

                </div>
              </div>
              <ErrorMessage name="vegetarian" component="div" className={styles.ErrorMessage} />
              <div className={styles.dietryInformationCardContainer}>
                <div className={styles.dietryInformationCardHeadingContainer}>
                  <Typography className={styles.dietryInformationCardHeading}>
                    Do you have any food dislikes (List up to 3) *
                  </Typography>
                </div>
                <div className={styles.dietryInformationCardRadioBtnContainer}>
                  <Field
                    as={TextField}
                    name="dislikes"
                    className="dietryInformationTextField"
                    id="fullWidth"
                    placeholder="Dislike 1 , Dislike 2 , Dislike 3 "

                  />
                </div>
              </div>
              <ErrorMessage name="dislikes" component="div" className={styles.ErrorMessage} />

              <div className={styles.dietryInformationCardContainer}>
                <div className={styles.dietryInformationCardHeadingContainer}>
                  <Typography className={styles.dietryInformationCardHeading}>Do you have any allergies? *</Typography>
                </div>
                <div className={styles.dietryInformationCardCheckboxContainer}>
                <FormControl className='allergiesFields'>
                  <Field name="allergies">
                    {({ field, form }) => {
                      const isNoAllergiesSelected = field.value.includes('I have no allergies');

                      return allergiesLocal.map((allergy, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              {...field}
                              value={allergy.title}
                              checked={field.value.includes(allergy.title)}
                              onChange={(e) => {
                                const set = new Set(field.value);

                                if (e.target.checked) {
                                  set.add(allergy.title);
                                  if (allergy.title === 'I have no allergies') {
                                    set.clear();
                                    set.add('I have no allergies');
                                  } else {
                                    set.delete('I have no allergies');
                                  }
                                } else {
                                  set.delete(allergy.title);
                                }

                                form.setFieldValue('allergies', Array.from(set));
                              }}
                            />
                          }
                          label={allergy.title}
                          className={isNoAllergiesSelected && allergy.title !== 'I have no allergies' ? 'grayOut' : ''}
                        />
                      ));
                    }}
                  </Field>
                </FormControl>
                </div>
              </div>
              <ErrorMessage name="allergies" component="div" className={styles.ErrorMessage} />

              <div className={styles.dietryInformationCardContainer}>
                <div className={styles.dietryInformationCardHeadingContainer}>
                  <Typography className={styles.dietryInformationCardHeading}>What portion size would you like your meals to be? *</Typography>
                  <small>Unsure of what your portion size is? Our most popular sizes for
                    females are 400, 500 and 600 calories and for males are 600, 700 and 800 calories.
                  </small>
                </div>
                <div className={styles.dietryInformationCardRadioBtnContainer}>
                  <FormControl>
                    <Field
                      as={RadioGroup}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="calorie_size_of_meal"  >
                      <FormControlLabel value="400" control={<Radio />} label="400 calories" />
                      <FormControlLabel value="500" control={<Radio />} label="500 calories" />
                      <FormControlLabel value="600" control={<Radio />} label="600 calories" />
                      <FormControlLabel value="700" control={<Radio />} label="700 calories" />
                      <FormControlLabel value="800" control={<Radio />} label="800 calories" />
                    </Field>
                  </FormControl>
                </div>


              </div>
              <ErrorMessage name="calorie_size_of_meal" component="div" className={styles.ErrorMessage} />

              <div className={styles.dietryInformationCardContainer}>
                <div className={styles.dietryInformationCardHeadingContainer}>
                  <Typography className={styles.dietryInformationCardHeading}>How many meals would you like us to deliver to your workplace daily? *</Typography>
                </div>
                <div className={styles.dietryInformationCardRadioBtnContainer}>
                  <FormControl>
                    <Field
                      as={RadioGroup}
                      row
                      aria-labelledby="demo-mealSize-label"
                      name="number_of_meals"  >
                      <FormControlLabel value={1} control={<Radio />} label="One" />
                      <FormControlLabel value={2} control={<Radio />} label="Two" />
                      <FormControlLabel value={3} control={<Radio />} label="Three" />
                      <FormControlLabel value={4} control={<Radio />} label="Four" />
                      <FormControlLabel value={5} control={<Radio />} label="Five" />
                    </Field>
                  </FormControl>
                </div>
              </div>
              <ErrorMessage name="number_of_meals" component="div" className={styles.ErrorMessage} />

              <div className={styles.dietryInformationCardContainer}>
                <div className={styles.dietryInformationCardHeadingContainer}>
                  <Typography className={styles.dietryInformationCardHeading}>How many snacks would you like from us daily? *</Typography>
                </div>
                <div className={styles.dietryInformationCardRadioBtnContainer}>
                  <FormControl>
                    <Field
                      as={RadioGroup}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="number_of_snacks"  >
                      <FormControlLabel value={0} control={<Radio />} label="None" />
                      <FormControlLabel value={1} control={<Radio />} label="One" />
                      <FormControlLabel value={2} control={<Radio />} label="Two" />
                      <FormControlLabel value={3} control={<Radio />} label="Three" />
                      <FormControlLabel value={4} control={<Radio />} label="Four" />
                      <FormControlLabel value={5} control={<Radio />} label="Five" />
                    </Field>
                  </FormControl>
                </div>
              </div>
              <ErrorMessage name="number_of_snacks" component="div" className={styles.ErrorMessage} />

            </div>
            <div className={styles.bottomButtonContainer}>
              <Stack direction="row" spacing={2}>
                <Button className="bottomButton" variant="outlined" type="submit" disabled={isSubmitting || loading} >
                  {isSubmitting || loading ? (<> <CircularProgress sx={{ color: '#fa7324' }} size={24} /> &nbsp;Loading... </>) : ('Submit')}
                </Button>
              </Stack>
            </div>
          </div>
        </Form>
      )}

    </Formik>
  );
};

export default FormExecutive;


