
flowplayer.engine('hlsjs-lite').plugin(function(data) {
  var common = flowplayer.common
    , videoTag = data.videoTag
    , player = data.player;

  var tracks = []
    , activeTrack;

  data.hls.subtitleDisplay = false;

  function createControl(tracks) {
    player.ui.createSubtitleControl(tracks, function(idx) {
      if (Number(idx) === -1) {
        if (activeTrack) activeTrack.mode = 'disabled';
        activeTrack = null;
        player.hideSubtitle();
      }
      else activeTrack = tracks[idx];
      player.ui.setActiveSubtitleItem(idx);

      if (activeTrack) activeTrack.mode = 'hidden';
    }, {
      controlledExternally: true
    });

    player.ui.setActiveSubtitleItem(-1);
  }

  videoTag.textTracks.addEventListener('addtrack', function(ev) {
    if (ev.track.kind !== 'captions' && ev.track.kind !== 'subtitles') return;

    tracks = [].filter.call(videoTag.textTracks, function(tr) { return tr.kind === 'captions' || tr.kind === 'subtitles'; });

    tracks.forEach(function(tr) { tr.mode = 'disabled'; });

    if (player.ready) createControl(tracks);
    else player.one('ready', function() { createControl(tracks); });

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
