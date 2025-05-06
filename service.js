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
      TrackPlayer.skipToNext();
    });

    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
      TrackPlayer.skipToPrevious();
    });

    TrackPlayer.addEventListener(Event.RemoteStop, () => {
      TrackPlayer.destroy();
    });
  } catch (error) {}
};
