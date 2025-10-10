import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { getAllPlaces, createItinerary } from '@/utils/axiosIntances';

interface Place {
  _id: string;
  name: string;
  address: string;
}

const itinerarySchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().required('End date is required'),
  places: Yup.array().min(1, 'Select at least one destination'),
  notes: Yup.string(),
});

const CreateItinerary: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await getAllPlaces();
        if (response?.data?.data) setPlaces(response.data.data);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };
    fetchPlaces();
  }, []);

  return (
    <Formik
      initialValues={{
        title: '',
        startDate: '',
        endDate: '',
        places: [] as string[],
        notes: '',
      }}
      validationSchema={itinerarySchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await createItinerary(values);
          Alert.alert('Success', 'Itinerary created!');
          resetForm();
          router.back();
        } catch (error: any) {
          console.error('Save error:', error?.response || error);
          Alert.alert(
            'Error',
            error?.response?.data?.message || 'Failed to save itinerary'
          );
        } finally {
          setSubmitting(false);
          setModalVisible(false);
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <View className="flex-1 bg-sec px-5 pt-6">
          <Text className="text-2xl font-bold text-pry mb-4">Create Itinerary</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text className="text-gray-600 mb-1">Trip Title</Text>
            <TextInput
              value={values.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              placeholder="e.g. Lagos Weekend Getaway"
              className="bg-white p-4 rounded-xl border border-gray-300 mb-1"
            />
            {touched.title && errors.title && (
              <Text className="text-red-500 mb-3">{errors.title}</Text>
            )}

            {/* Calendar */}
            <Text className="text-gray-600 mb-2">Select Dates</Text>
            <Calendar
              onDayPress={(day) => {
                if (!values.startDate || values.endDate) {
                  setFieldValue('startDate', day.dateString);
                  setFieldValue('endDate', '');
                } else if (values.startDate && !values.endDate) {
                  setFieldValue('endDate', day.dateString);
                }
              }}
              markedDates={{
                ...(values.startDate
                  ? { [values.startDate]: { selected: true, selectedColor: '#3B82F6' } }
                  : {}),
                ...(values.endDate
                  ? { [values.endDate]: { selected: true, selectedColor: '#10B981' } }
                  : {}),
              }}
              style={{ marginBottom: 10, borderRadius: 16, overflow: 'hidden' }}
            />
            {(touched.startDate && errors.startDate) ||
            (touched.endDate && errors.endDate) ? (
              <Text className="text-red-500 mb-3">
                {errors.startDate || errors.endDate}
              </Text>
            ) : null}

            {/* Destinations */}
            <Text className="text-gray-600 mb-3">Select Destinations</Text>
            <FlatList
              data={places}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                const isSelected = values.places.includes(item._id);
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (isSelected) {
                        setFieldValue(
                          'places',
                          values.places.filter((id) => id !== item._id)
                        );
                      } else {
                        setFieldValue('places', [...values.places, item._id]);
                      }
                    }}
                    className={`p-4 rounded-xl mb-2 border flex-row justify-between items-center ${
                      isSelected ? 'bg-pry border-pry' : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text className={isSelected ? 'text-white' : 'text-gray-700'}>
                      {item.name}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={20} color="#fff" />}
                  </TouchableOpacity>
                );
              }}
              style={{ maxHeight: 400, marginBottom: 10 }}
            />
            {touched.places && errors.places && (
              <Text className="text-red-500 mb-3">{errors.places as string}</Text>
            )}

            {/* Notes */}
            <Text className="text-gray-600 mb-2">Notes / Checklist</Text>
            <TextInput
              value={values.notes}
              onChangeText={handleChange('notes')}
              onBlur={handleBlur('notes')}
              placeholder="Add notes or packing list..."
              multiline
              className="bg-white p-4 rounded-xl border border-gray-300 h-40 mb-6"
            />

            {/* Preview */}
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="bg-pry py-3 px-6 rounded-xl mb-10"
            >
              <Text className="text-white font-semibold text-center">
                Preview Itinerary
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Modal */}
          <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 bg-black/50 justify-center items-center px-4">
              <View className="bg-white border border-pry w-full rounded-xl p-6 max-h-[80%]">
                <Text className="text-xl font-bold text-gray-800 mb-4">
                  Preview Itinerary
                </Text>
                <ScrollView className="mb-4">
                  <Text className="text-gray-700">Title: {values.title}</Text>
                  <Text className="text-gray-700">
                    Dates: {values.startDate} – {values.endDate}
                  </Text>
                  <Text className="font-semibold mt-2 mb-1">Destinations:</Text>
                  {places
                    .filter((p) => values.places.includes(p._id))
                    .map((p) => (
                      <Text key={p._id} className="ml-2">
                        - {p.name}
                      </Text>
                    ))}
                  {values.notes ? (
                    <Text className="mt-2 text-gray-600">Notes: {values.notes}</Text>
                  ) : null}
                </ScrollView>

                {/* Actions */}
                <View className="flex-row justify-between mt-4">
                  <TouchableOpacity
                    className="flex-1 py-3 mr-2 border border-gray-300 rounded-xl items-center"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-gray-700 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 py-3 ml-2 bg-pry rounded-xl items-center"
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-white font-semibold">Confirm & Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </Formik>
  );
};

export default CreateItinerary;
