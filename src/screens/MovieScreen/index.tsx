import React from 'react'
import { View, StyleSheet } from 'react-native'

import { Search } from '../../components'

const Home = () => {
    return (
        <View style={localStyles.container}>
            <Search sortingEnabled={true} type="movies" />
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default Home
