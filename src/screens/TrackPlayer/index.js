/* eslint-disable react-hooks/exhaustive-deps */
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  State,
  useProgress,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';

const TrackPlayerComponent = ({route}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  // const {artist, artwork, id, title, url} = route.params.data;
  const {position, duration} = useProgress();

  const DefaultAudioServiceBehaviour =
    AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification;

  const tracks = [
    {
      title: 'test',
      artist: 'Amit',
      artwork:
        'https://d3qcxffgqx9ae.cloudfront.net/content/1743625073981-Player_Screen_powernap.webp',
      url: 'https://d1dkg73nq3w8tn.cloudfront.net/audio/Funfocus_Hindi_with_music_01fd59d654_audio_20241128T070320/Funfocus_Hindi_with_music_01fd59d654_audio_20241128T070320.m3u8',
      id: '1',
      type: 'hls',
    },
  ];

  useEffect(() => {
    const onEndListener = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      ({track, position}) => {
        if (typeof position === 'number' && track != null) {
          console.log('🚀 ~ track finished:', track, 'at position:', position);
        } else {
          console.log('🚀 ~ PlaybackQueueEnded with undefined data');
        }
      },
    );

    return () => onEndListener.remove();
  }, []);

  useEffect(() => {
    TrackPlayer.addEventListener('playback-error', error => {
      console.log('Playback error:', error);
    });
  }, []);

  useEffect(() => {
    const listener = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async ({nextTrack}) => {
        if (nextTrack != null) {
          const track = await TrackPlayer.getTrack(nextTrack);
          console.log('🚀 ~ track Loaded', track);
        } else {
          console.log('🚀 ~ nextTrack is null');
        }
      },
    );
    return () => listener.remove();
  }, []);

  useEffect(() => {
    TrackPlayer.addEventListener(Event.RemotePlay, () => {
      setIsPlaying(true);
      TrackPlayer.play();
    });

    TrackPlayer.addEventListener(Event.RemotePause, () => {
      setIsPlaying(false);
      TrackPlayer.pause();
    });
  }, []);

  useEffect(() => {
    const startPlayer = async () => {
      await TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
        minBuffer: 1000,
        maxBuffer: 3000,
      });
      await TrackPlayer.reset();
      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: DefaultAudioServiceBehaviour,
          stoppingAppPausesPlayback: true,
          alwaysPauseOnInterruption: true,
        },
        stopWithApp: false,
        capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SeekTo,
        ],
        progressUpdateEventInterval: 2,
      });
      await TrackPlayer.add(tracks);
      const playerState = await TrackPlayer.getState();
      if (playerState !== State.Playing) {
        await TrackPlayer.play();

        setIsPlaying(true);
      }
    };

    startPlayer();

    return () => {
      TrackPlayer.stop();
    };
  }, []);

  const togglePlayback = async () => {
    const currentState = await TrackPlayer.getState();
    if (currentState === State.Playing) {
      await TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      await TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  const skipForward = async () => {
    const currentPosition = await TrackPlayer.getPosition();
    const newPosition = Math.min(currentPosition + 10, duration);
    await TrackPlayer.seekTo(newPosition);
  };

  const skipBackward = async () => {
    const currentPosition = await TrackPlayer.getPosition();
    const newPosition = Math.max(currentPosition - 10, 0);
    await TrackPlayer.seekTo(newPosition);
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Image source={{uri: tracks[0].artwork}} style={styles.albumArt} />

      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.title}>{tracks[0].title}</Text>
          <Text style={styles.artist}>{tracks[0].artist}</Text>
        </View>
      </View>

      <Slider
        step={1}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={async value => {
          await TrackPlayer.seekTo(value);
        }}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="#888"
        thumbTintColor="#fff"
        style={styles.slider}
      />

      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={skipBackward}>
          <Image
            style={styles.controlIcon}
            source={require('../../icons/SkipBack.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
          <Image
            style={{width: 30, height: 30}}
            source={
              isPlaying
                ? require('../../icons/Pause.png')
                : require('../../icons/Play.png')
            }
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipForward}>
          <Image
            style={styles.controlIcon}
            source={require('../../icons/SkipFwd.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TrackPlayerComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1f0036',
  },
  albumArt: {
    width: '85%',
    alignSelf: 'center',
    height: 400,
    borderRadius: 20,
  },
  infoContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 190,
    marginHorizontal: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  artist: {
    fontSize: 16,
    color: '#ccc',
  },
  slider: {
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 160 : 170,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
  },
  timeText: {
    color: '#fff',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    backgroundColor: '#8a4fff',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8a4fff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    marginHorizontal: 40,
  },
  controlIcon: {
    width: 50,
    height: 50,
  },
});
