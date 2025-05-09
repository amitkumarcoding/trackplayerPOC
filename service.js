import TrackPlayer, {Event} from 'react-native-track-player';

module.exports = async function () {
  try {
    TrackPlayer.addEventListener(Event.RemotePlay, () => {
      console.log('remote play');
      TrackPlayer.play();
    });

    TrackPlayer.addEventListener(Event.RemotePause, () => {
      console.log('remote pause');
      TrackPlayer.pause();
    });

    TrackPlayer.addEventListener(Event.RemoteNext, () => {
      console.log('remote skipToNext');
      TrackPlayer.skipToNext();
    });

    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
      console.log('remote skipToPrevious');
      TrackPlayer.skipToPrevious();
    });

    TrackPlayer.addEventListener(Event.RemoteStop, () => {
      console.log('remote destroy');
      TrackPlayer.destroy();
    });

    TrackPlayer.addEventListener(Event.RemoteSeek, event => {
      console.log('remote seekTo');
      TrackPlayer.seekTo(event.position);
    });
  } catch (error) {}
};
