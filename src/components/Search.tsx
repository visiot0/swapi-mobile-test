/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react'
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    FlatList,
    ActivityIndicator,
    Alert
} from 'react-native'

import DropDownPicker from 'react-native-dropdown-picker'

import { apiRequest } from '../helpers'

interface SearchProps {
    type: string
    sortingEnabled: boolean
}

const Search = ({ type, sortingEnabled }: SearchProps) => {
    const [listData, setListData] = useState(null)

    const [page, setPage] = useState(1)

    const [searchTerm, setSearchTerm] = useState('test')
    const [isLoading, setIsLoading] = useState(false)
    const [isListEnd, setIsListEnd] = useState(false)

    // GENDER PICKER
    const [openGenders, setOpenGenders] = useState(false)
    const [gender, setGender] = useState('male')
    const [genders, setGenders] = useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
    ])

    // SORT PICKER
    const [openSorts, setOpenSorts] = useState(false)
    const [sort, setSort] = useState('height:asc')
    const [sorts, setSorts] = useState([
        { label: 'Height ASC', value: 'height:asc' },
        { label: 'Height DESC', value: 'height:desc' },
        { label: 'Age ASC', value: 'age:asc' },
        { label: 'Age DESC', value: 'age:desc' }
    ])

    const setListDataHelper = newData => {
        if (listData && listData.length > 0) {
            setListData(currentData => [...currentData, ...newData])
        } else {
            setListData(newData)
        }
    }

    const triggerSearch = async (shouldReset = false) => {
        if (shouldReset) {
            setPage(1)
            setIsListEnd(false)
        }
        if (searchTerm === '') {
            Alert.alert('Please enter a search term.')
            return
        }
        setIsLoading(true)

        try {
            const tempUrl =
                type === 'movies'
                    ? `api/v1/movies/${searchTerm}/?page=${page}&gender=${gender}&sort=${sort}`
                    : `api/v1/planets?climateType=${searchTerm}`

            const response = await apiRequest({
                method: 'get',
                url: tempUrl
            })

            if (type === 'movies') {
                if (response && response?.data?.results > 0) {
                    setListDataHelper(response.data.characters)
                }

                if (response && response?.data?.results === 0)
                    setIsListEnd(true)
            } else {
                // IF PLANETS
                if (response && response.data.planetResults > 0) {
                    setListDataHelper(response.data.planets)
                }

                if (response && response?.data?.planetResults === 0)
                    setIsListEnd(true)
            }

            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            setListData(null)
            setPage(1)
            setIsListEnd(false)
            // eslint-disable-next-line @typescript-eslint/quotes
            Alert.alert("We can't find items you are searching for.")
            return
        }
    }

    //Depending on the search type, it will render items
    const renderItem = ({ item }) => {
        return type === 'movies' ? (
            <View style={localStyles.resultRow}>
                <Text>Name: {item?.name}</Text>
                <Text>Height: {item?.height}</Text>
                <Text>Gender: {item?.gender}</Text>
                <Text>Age: {item?.age}</Text>
            </View>
        ) : (
            <View style={localStyles.resultRow}>
                <Text>Name: {item?.name}</Text>
                <Text>Climate: {item?.climate}</Text>
                <Text>Gravity: {item?.gravity}</Text>
                <Text>Terrain: {item?.terrain}</Text>
                <Text>Population: {item?.population}</Text>
            </View>
        )
    }

    const fetchMoreData = () => {
        if (!isListEnd && !isLoading) {
            setPage(page + 1)
        }
    }

    // When the page number in increased, useEffect will detech and will call api again
    useEffect(() => {
        if (page > 1) triggerSearch()
    }, [page])

    // Change of any dropdown will reset params
    useEffect(() => {
        setPage(1)
        setIsListEnd(false)
        setListData(null)
    }, [gender, sort])

    const renderEmpty = () => {
        return (
            <View style={localStyles.empty}>
                <Text>No data at the moment</Text>
            </View>
        )
    }

    const renderFooter = () => {
        return (
            <View style={localStyles.empty}>
                {isListEnd && <Text>No more items to show</Text>}
            </View>
        )
    }

    // CLOSE OTHER PICKERSS
    const onGenderOpen = useCallback(() => {
        setOpenSorts(false)
    }, [])

    const onSortOpen = useCallback(() => {
        setOpenGenders(false)
    }, [])

    return (
        <View style={localStyles.container}>
            <View style={localStyles.searchRow}>
                <TextInput
                    style={localStyles.input}
                    onChangeText={text => setSearchTerm(text)}
                />
                <TouchableOpacity
                    style={localStyles.btnSearch}
                    onPress={() => triggerSearch(true)}>
                    <Text style={localStyles.textColor}>Search</Text>
                </TouchableOpacity>
            </View>
            {sortingEnabled && (
                <View
                    style={[
                        localStyles.searchRow,
                        localStyles.pickersRow,
                        // eslint-disable-next-line react-native/no-inline-styles
                        { height: openSorts || openGenders ? 250 : 60 }
                    ]}>
                    <DropDownPicker
                        placeholder="Gender"
                        containerStyle={localStyles.pickerWidth}
                        open={openGenders}
                        onOpen={onGenderOpen}
                        value={gender}
                        items={genders}
                        setOpen={setOpenGenders}
                        setValue={setGender}
                        setItems={setGenders}
                    />

                    <DropDownPicker
                        placeholder="Sort by"
                        open={openSorts}
                        onOpen={onSortOpen}
                        containerStyle={localStyles.pickerWidth}
                        value={sort}
                        items={sorts}
                        setOpen={setOpenSorts}
                        setValue={setSort}
                        setItems={setSorts}
                    />
                </View>
            )}
            {listData ? (
                <FlatList
                    data={listData}
                    renderItem={renderItem}
                    keyExtractor={item => item?.name + '12'}
                    onEndReachedThreshold={0}
                    onEndReached={type === 'movies' ? fetchMoreData : null}
                    ListFooterComponent={renderFooter}
                    //ListEmptyComponent={renderEmpty}
                />
            ) : (
                renderEmpty()
            )}

            {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    input: {
        height: 40,
        width: 250,
        margin: 12,
        borderWidth: 1,
        padding: 10
    },
    searchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    btnSearch: {
        backgroundColor: '#7F2FA0',
        marginRight: 20,
        padding: 10,
        borderRadius: 5
    },
    resultRow: {
        width: '100%',
        backgroundColor: '#cece',
        padding: 10,
        marginBottom: 10
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textColor: {
        color: '#fff'
    },
    pickersRow: {
        paddingHorizontal: 10,
        alignItems: 'flex-start'
    },
    pickerWidth: { width: '48%' }
})
export default Search
