
flowplayer.engine('hlsjs-lite').plugin(function(data) {
  var common = flowplayer.common
    , videoTag = data.videoTag
    , player = data.player;

  var tracks = []
    , activeTrack;

  videoTag.textTracks.addEventListener('addtrack', function(ev) {
    if (ev.track.kind !== 'captions') return;

    tracks = [].filter.call(videoTag.textTracks, function(tr) { return tr.kind === 'captions'; });

    player.ui.createSubtitleControl(tracks, function(idx) {
      if (Number(idx) === -1) activeTrack = null;
      else activeTrack = tracks[idx];
      player.ui.setActiveSubtitleItem(idx);
    });

    player.ui.setActiveSubtitleItem(-1);


    ev.track.addEventListener('cuechange', function() {
      if (ev.track !== activeTrack) return;
      if (!ev.track.activeCues.length) return player.hideSubtitle();
      var text = [].map.call(ev.track.activeCues, function(cue) {
        return cue.text;
      }).join('<br>');
      player.showSubtitle('<p>' + text + '</p>');
    });
  });


});
