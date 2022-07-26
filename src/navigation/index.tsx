import React from 'react'
import { View, StyleSheet } from 'react-native'

import TabNavigator from './TabNavigator'

const Navigator = () => {
    return (
        <View style={localStyles.container}>
            <TabNavigator />
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' }
})

export default Navigator
