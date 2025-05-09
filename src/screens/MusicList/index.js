import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {AUDIO_DATA} from './musicData';
import {ImageBackground} from 'react-native';

const MusicList = ({navigation}) => {

  console.log('object')

  const handlePlay = (url, thumbnail, item) => {
    navigation.navigate('TrackPlayerComponent', {
      source: url,
      posterImage: thumbnail,
      isAudio: true,
      data: item,
    });
  };

  const renderSongItem = ({item}) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handlePlay(item.url, item.artwork, item)}>
      <ImageBackground
        resizeMode="cover"
        source={{uri: item.artwork}}
        style={styles.songItem}>
        <View style={styles.overlay} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
        <View style={{position: 'absolute', top: 5, right: 5}}></View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Browse all Audio</Text>
      <FlatList
        data={AUDIO_DATA}
        renderItem={renderSongItem}
        keyExtractor={item => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={{backgroundColor: '#000', marginBottom: 50}}
      />
    </View>
  );
};

export default MusicList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 90,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 10,
    color: '#fff',
  },
  gridItem: {
    flex: 1,
    margin: 5,
  },
  songItem: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  artist: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  playIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
});
