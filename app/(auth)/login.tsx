import {
	View,
	Text,
	TextInput,
	KeyboardAvoidingView,
	ScrollView,
	Platform,
	TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signin } from '@/utils/axiosIntances';
import ButtonSolid from '@/components/buttons/ButtonSolid';
import { useAuth } from '@/context/AuthContext';
import GoogleSignIn from '@/components/auth/GoogleSignIn';
import AppleSignIn from '@/components/auth/AppleSignIn';


const inputFields = [
	{ name: 'email', label: 'Email', placeholder: 'amoleuthman@gmail.com', secureEntry: false, icon: 'mail' },
	{ name: 'password', label: 'Password', placeholder: '********', secureEntry: true, icon: 'lock-closed' },
] as const;

type FieldName = (typeof inputFields)[number]['name'];

const initialValues = {
	email: '',
	password: '',
};

const validationSchema = Yup.object({
	email: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string().min(6, 'Password too short').required('Password is required'),
});

const Login = () => {
	const [loading, setLoading] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const {login} = useAuth()

	const handleLogin = async (values: typeof initialValues, setStatus: (v: string | null) => void) => {
		setLoading(true);
		setSubmitError(null);
		setStatus(null);
		try {
			const {data} = await signin(values);
			if (!data?.token) {
				throw new Error('Missing auth token');
			}
			await login(data.token);
			router.replace('/(tabs)');
		} catch (error) {
			console.log(error);
			
			if (axios.isAxiosError(error)) {
				const message =
					error.response?.data?.message ||
					error.response?.data?.error ||
					'Something went wrong. Please try again.';
				setSubmitError(message);
				setStatus(message);
			} else {
				const message = 'An unexpected error occurred';
				setSubmitError(message);
				setStatus(message);
			}
		} finally {
			setLoading(false);
		}
	};


	return (
		<SafeAreaView className="flex-1 bg-white">
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<ScrollView
					contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
					keyboardShouldPersistTaps="handled"
				>
					{/* Header */}
					<View className="w-12 h-12 flex items-center justify-center mb-6 bg-white shadow-sm rounded-full ">
						<Ionicons
							name="arrow-back"
							size={22}
							className="p-1 rounded"
							color={'#105679'}
							onPress={() => router.back()}
						/>
					</View>
					<View className="flex-col gap-3">
						<View className='flex-col gap-2'>
							<Text className="text-4xl ">
							Welcome Back!
						</Text>
						<Text className='text-grey'>
							Join thousands of travelers worldwide
						</Text>
						</View>

						{/* Social Auth */}
						<View className="flex-col gap-3 mt-4">
							<GoogleSignIn label="Sign In with Google" />
							<AppleSignIn label="Sign In with Apple" />
						</View>

						<View className="flex-row items-center my-6 gap-2">
							<View className="flex-1 h-px bg-neutral-300" />
							<Text className="text-grey">or</Text>
							<View className="flex-1 h-px bg-neutral-300" />
						</View>

						{/* Form */}
						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={(vals, { setStatus }) => handleLogin(vals, setStatus)}
						>
							{({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, status }) => (
								<View className="flex-col gap-3">
									{(submitError || status) && (
										<View className="p-3 rounded-md bg-red-50 border border-red-200">
											<Text className="text-red-700 text-sm">
												{status || submitError}
											</Text>
										</View>
									)}

									{inputFields.map(({ name, label, placeholder, secureEntry, icon }) => {
										const fieldName = name as FieldName;
										const isPassword = name === 'password';
										const actualSecureEntry = isPassword ? !showPassword : secureEntry;

										return (
											<View key={name} className="gap-2">
												<Text className="text-grey text-lg font-medium">{label}</Text>
												<View className="py-4 px-2 border border-neutral-300 rounded-md flex-row items-center gap-2">
													<Ionicons name={icon} size={20} color={'#d4d4d4'}/>
													<TextInput
														className="flex-1"
														placeholder={placeholder}
														placeholderTextColor={'#d4d4d4'}
														secureTextEntry={actualSecureEntry}
														value={values[fieldName]}
														onChangeText={handleChange(fieldName)}
														onBlur={handleBlur(fieldName)}
														autoCapitalize="none"
													/>
													{isPassword && (
														<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
															<Ionicons 
																name={showPassword ? 'eye-off' : 'eye'} 
																size={20} 
																color={'#d4d4d4'}
															/>
														</TouchableOpacity>
													)}
												</View>
												{touched[fieldName] && errors[fieldName] && (
													<Text className="text-red-600 text-sm">
														{errors[fieldName]}
													</Text>
												)}
											</View>
										);
									})}

									<ButtonSolid
									// onPress={() => router.push('(auth)/interest')}
										title="Login"
										onPress={() => {
											if (loading || isSubmitting) return;
											handleSubmit();
										}}
										loading={loading || isSubmitting}
									/>
								</View>
							)}
						</Formik>

						<View className="flex-row gap-1 justify-center mt-4">
							<Text className="text-grey">Already have an account?</Text>
							<Link href="/(auth)" className="text-sec font-semibold">
								Create an account
							</Link>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default Login;
