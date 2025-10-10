import {
	View,
	Text,
	TextInput,
	KeyboardAvoidingView,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	Platform,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { signin } from '@/utils/axiosIntances';
import { useAuth } from '@/context/AuthContext'; 

const Login = () => {
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();

	const initialValues = {
		email: '',
		password: '',
	};

	const validationSchema = Yup.object().shape({
		email: Yup.string().email('Invalid email').required('Email is required'),
		password: Yup.string().required('Password is required'),
	});

	const handleLogin = async (values: typeof initialValues) => {
		setLoading(true);
		try {
			const response = await signin(values);
			login(response.data.token);
			console.log('Login successful:', response.data);
			router.push('/(tabs)');
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const message = error.response?.data.message || 'Login failed';
				console.log('Login error:', error.response?.data);
				
				Alert.alert('Login Error', message);
			} else {
				Alert.alert('Error', 'Something went wrong');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView className="container px-4 flex-col gap-7 py-2">
			<Ionicons name="person" size={24} className="p-1 rounded" color={'#105679'} />
			<Text className="text-2xl font-semibold mb-5 text-pry">Welcome Back</Text>

			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleLogin}
			>
				{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
						className="flex-col gap-3"
					>
						<View className="flex-col gap-2">
							<Text className="text-pry text-lg font-medium">Email</Text>
							<TextInput
								className="py-4 px-2 border border-grey rounded-md"
								placeholder="amoleuthman@gmail.com"
								autoCapitalize="none"
								keyboardType="email-address"
								textContentType="emailAddress"
								value={values.email}
								onChangeText={handleChange('email')}
								onBlur={handleBlur('email')}
							/>
							{touched.email && errors.email && (
								<Text className="text-red-600 text-sm">{errors.email}</Text>
							)}
						</View>

						<View className="flex-col gap-2">
							<Text className="text-pry text-lg font-medium">Password</Text>
							<TextInput
								className="py-4 px-2 border border-grey rounded-md"
								placeholder="********"
								secureTextEntry
								autoCapitalize="none"
								textContentType="password"
								value={values.password}
								onChangeText={handleChange('password')}
								onBlur={handleBlur('password')}
							/>
							{touched.password && errors.password && (
								<Text className="text-red-600 text-sm">{errors.password}</Text>
							)}
						</View>

						<Link href={'/(auth)/forgot-password'} className="text-pry font-semibold mt-2">
							Forgot password?
						</Link>

						<TouchableOpacity
							className="btn bg-pry mt-4 flex items-center justify-center"
							activeOpacity={0.8}
							onPress={handleSubmit as any}
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Text className="text-center text-white font-medium">Sign In</Text>
							)}
						</TouchableOpacity>
					</KeyboardAvoidingView>
				)}
			</Formik>

			<View className="flex-row gap-1 justify-center mt-4">
				<Text className="text-grey">Don’t have an account yet?</Text>
				<Link href={'/(auth)'} className="text-pry font-semibold">
					Create account
				</Link>
			</View>

			<View className="flex-col gap-3 mt-4">
				<TouchableOpacity className="btn bg-blue-950 py-3 rounded">
					<Text className="text-center text-white font-medium">Sign In with Google</Text>
				</TouchableOpacity>
				<TouchableOpacity className="btn bg-black py-3 rounded">
					<Text className="text-center text-white font-medium">Sign In with Apple</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default Login;
