import React, { Component } from 'react'
import { StyleSheet, Text, Image, View, ImageBackground, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator } from 'react-native'

import getImageForWeather from './utils/getImageForWeather'
import { fetchLocationId, fetchWeather } from "./utils/api"

import SearchInput from './components/SearchInput'


export default class App extends Component {
    state = {
        loading: false,
        error: false,
        location: '',
        temperature: 0,
        weather: '',
        logo: ''
    }

    componentDidMount() {
        StatusBar.setHidden(true, 'none');
        this.handleUpdateLocation("Warsaw")
    }

    handleUpdateLocation = async city => {
        if(!city) return

        this.setState({ loading: true }, async () => {
            try {
                const locationId = await fetchLocationId(city)
                const { location, weather, temperature, logoId } = await fetchWeather(locationId)
                const logo = await require(`https://www.metaweather.com/static/img/weather/png/${logoId}.png`)

                this.setState({
                    loading: false,
                    error: false,
                    location,
                    weather,
                    temperature,
                    logo
                })
            }
            catch (error) {
                this.setState({
                    loading: false,
                    error: true
                })
            }
        })
    }

    renderContent() {
        const { error } = this.state

        return (
            <View>
                { error && <Text style={[styles.textStyle, styles.errorText]}>
                                Polecam zostać w {this.state.location}
                            </Text>
                }
                { !error && this.renderInfo() }
            </View>
        )
    }

    renderInfo() {
        const { location, temperature, weather, logo } = this.state
        return (
            <View>
                <Text style={[styles.largeText, styles.textStyle]}> { location } </Text>
                <Text style={[styles.smallText, styles.textStyle]}> { weather } </Text>
                <Image style={styles.selfCentered} source={{uri: {logo}, width: 32, height: 32}}/>
                <Text style={[styles.largeText, styles.textStyle]}> {`${Math.round(temperature)}°`}</Text>
            </View>
        )
    }

    render() {
        const { loading, weather } = this.state

        return (
          <KeyboardAvoidingView style={styles.container} behavior="padding">
              <ImageBackground
                source={getImageForWeather(weather)}
                style={styles.imageContainer}
                imageStyle={styles.image}
              >
                  <View style={styles.detailsContainer}>
                      <ActivityIndicator animating={loading} color="white" size="large"/>

                      {!loading && this.renderContent()}

                      <SearchInput
                          placeholder="Wyszukaj miasto"
                          onSubmit={this.handleUpdateLocation}
                      />
                  </View>
              </ImageBackground>
          </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#34495E',
    },
    detailsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 20,
        flex: 1
    },
    imageContainer: {
        flex: 1
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    textStyle: {
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
        color: 'white'
    },
    largeText: {
        fontSize: 44,
    },
    smallText: {
        fontSize: 18,
    },
    errorText: {
        fontSize: 25,
        fontWeight: '500'
    },
    selfCentered: {
        alignSelf: 'center',
        marginVertical: 5
    }
});





