import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import MovieScreen from '../screens/MovieScreen'
import ClimateScreen from '../screens/ClimateScreen'

import FeatherIcon from 'react-native-vector-icons/Feather'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let iconName
                    if (route.name === 'Movies') {
                        iconName = 'film'
                    } else iconName = 'globe'

                    return (
                        <FeatherIcon name={iconName} size={focused ? 25 : 20} />
                    )
                }
            })}>
            <Tab.Screen name="Movies" component={MovieScreen} />
            <Tab.Screen name="Planets" component={ClimateScreen} />
        </Tab.Navigator>
    )
}

export default TabNavigator
