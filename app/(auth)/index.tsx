import {
	View,
	Text,
	TextInput,
	KeyboardAvoidingView,
	ScrollView,
	Platform,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { register } from '@/utils/axiosIntances'; // Make sure this is defined correctly

const inputFields = [
	{ name: 'firstName', label: 'First Name', placeholder: 'Uthman', secureEntry: false },
	{ name: 'lastName', label: 'Last Name', placeholder: 'Amole', secureEntry: false },
	{ name: 'username', label: 'Username', placeholder: 'seun111', secureEntry: false },
	{ name: 'email', label: 'Email', placeholder: 'amoleuthman@gmail.com', secureEntry: false },
	{ name: 'password', label: 'Password', placeholder: '********', secureEntry: true },
	{ name: 'confirmPassword', label: 'Confirm Password', placeholder: '********', secureEntry: true },
] as const;

type FieldName = typeof inputFields[number]['name'];

const initialValues = {
	firstName: '',
	lastName: '',
	username: '',
	email: '',
	password: '',
	confirmPassword: '',
};

const validationSchema = Yup.object().shape({
	firstName: Yup.string().required('First name is required'),
	lastName: Yup.string().required('Last name is required'),
	username: Yup.string().required('Username is required'),
	email: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string().min(6, 'Password too short').required('Password is required'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'Passwords must match')
		.required('Please confirm your password'),
});

const Index = () => {
	const [loading, setLoading] = useState(false);

	const handleSignUp = async (values: typeof initialValues) => {
		setLoading(true);
		try {
			const response = await register(values)
			console.log('Registration successful:', response.data);
			router.push('/(auth)/interest');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message = error.message || 'Something went wrong';
				console.log('Registration error:', error.response?.data.message);
				
				Alert.alert('Registration Error', message);
			} else {
				Alert.alert('Error', 'An unexpected error occurred');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }} keyboardShouldPersistTaps="handled">
				<View className="flex-col gap-7">
					<Ionicons name="person" size={24} className="p-1 rounded" color={'#105679'} />
					<Text className="text-2xl font-semibold text-pry">Fill Personal Information</Text>

					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={handleSignUp}
					>
						{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
							<View className="flex-col gap-3">
								{inputFields.map(({ name, label, placeholder, secureEntry }) => {
									const fieldName = name as FieldName;
									return (
										<View key={name} className="flex-col gap-2">
											<Text className="text-pry text-lg font-medium">{label}</Text>
											<TextInput
												className="py-4 px-2 border border-grey rounded-md"
												placeholder={placeholder}
												secureTextEntry={secureEntry}
												value={values[fieldName]}
												onChangeText={handleChange(fieldName)}
												onBlur={handleBlur(fieldName)}
												autoCapitalize="none"
												textContentType={
													fieldName.includes('email')
														? 'emailAddress'
														: fieldName.includes('password')
														? 'password'
														: 'name'
												}
											/>
											{touched[fieldName] && errors[fieldName] && (
												<Text className="text-red-600 text-sm">{errors[fieldName]}</Text>
											)}
										</View>
									);
								})}

								<TouchableOpacity
									className="btn bg-pry mt-4 flex items-center justify-center rounded"
									activeOpacity={0.8}
									onPress={handleSubmit as any}
									disabled={loading}
								>
									{loading ? (
										<ActivityIndicator color="#fff" />
									) : (
										<Text className="text-center text-white font-medium">Sign Up</Text>
									)}
								</TouchableOpacity>
							</View>
						)}
					</Formik>

					<View className="flex-row gap-1 justify-center mt-4">
						<Text className="text-grey">Already have an account?</Text>
						<Link href={'/(auth)/login'} className="text-pry font-semibold">
							Login
						</Link>
					</View>

					<View className="flex-col gap-3 mt-4">
						<TouchableOpacity className="btn bg-blue-950 py-3 rounded">
							<Text className="text-center text-white font-medium">Sign Up with Google</Text>
						</TouchableOpacity>
						<TouchableOpacity className="btn bg-black py-3 rounded">
							<Text className="text-center text-white font-medium">Sign Up with Apple</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default Index;
