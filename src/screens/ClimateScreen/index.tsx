import React from 'react'
import { View, StyleSheet } from 'react-native'

import { Search } from '../../components'

const Climate = () => {
    return (
        <View style={localStyles.container}>
            <Search sortingEnabled={false} type="climate" />
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        backgroundColor: '#1A72A5',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alignItems: {
        alignItems: 'center'
    }
})
export default Climate
