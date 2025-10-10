import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const fields = [
  { key: 'name', placeholder: 'Name*', required: true },
  { key: 'description', placeholder: 'Description*', required: true, multiline: true },
  { key: 'category', placeholder: 'Category' },
  { key: 'address', placeholder: 'Address*', required: true },
  { key: 'phone', placeholder: 'Phone*', required: true, keyboardType: 'phone-pad' },
  { key: 'email', placeholder: 'Email*', required: true, keyboardType: 'email-address' },
  { key: 'website', placeholder: 'Website' },
  { key: 'openingHours', placeholder: 'Opening Hours' },
  { key: 'entryFee', placeholder: 'Entry Fee' },
];

const validationSchema = Yup.object(
  fields.reduce((schema, field) => {
    if (field.required) {
      schema[field.key] = Yup.string().required(`${field.placeholder} is required`);
    }
    return schema;
  }, {} as Record<string, any>)
);

const SuggestionBox = () => {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView className="flex-1 bg-sec p-5" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-pry mb-5">Suggest a Place</Text>

        <Formik
          initialValues={fields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {})}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log('Suggested Place:', values);
            Alert.alert('Success', 'Your suggestion has been submitted!');
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              {fields.map((field) => (
                <View key={field.key} className="flex-col gap-2 mb-4">
                  <Text className="text-pry text-lg font-medium">
                    {field.placeholder}
                  </Text>
                  <TextInput
                    // placeholder={field.placeholder}
                    className="py-4 px-2 border border-grey rounded-md"
                    multiline={field.multiline || false}
                    keyboardType={field.keyboardType || 'default'}
                    value={values[field.key]}
                    onChangeText={handleChange(field.key)}
                    onBlur={handleBlur(field.key)}
                  />
                  {touched[field.key] && errors[field.key] && (
                    <Text className="text-red-500 text-sm">{errors[field.key]}</Text>
                  )}
                </View>
              ))}

              <TouchableOpacity
                className="bg-pry py-4 rounded-2xl items-center justify-center mt-5"
                onPress={() => handleSubmit()}
              >
                <Text className="text-white text-lg font-semibold">Submit Suggestion</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SuggestionBox;
