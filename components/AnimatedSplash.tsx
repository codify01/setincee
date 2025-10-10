import { View, Text, Image } from 'react-native'
import React from 'react'

const AnimatedSplash = ({onAnimationEnd}) => {
  const timeOut = 2000; // Duration for the splash screen animation

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, timeOut);

    return () => clearTimeout(timer);
  }, [onAnimationEnd, timeOut]);
  return (
    <View className='flex-1 items-center justify-center bg-sec'>
      <Image source={require('@/assets/images/setince.png')} className='h-32 mb-3'/>
      <Text className='text-base font-medium'>Discover Nigeria, Travel Smarter</Text>
    </View>
  )
}

export default AnimatedSplash