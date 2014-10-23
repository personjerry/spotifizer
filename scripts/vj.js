require([
    '$api/audio',
    '$api/models',
    'scripts/splat'
], function(audio, models, Splat) {

    var VJ = function (simulationEnv) {
        this.simulationEnv = simulationEnv;

        var stats = this.stats = new Stats();
        // Align top-left
        stats.domElement.style.position = 'fixed';
        stats.domElement.style.right = '0px';
        stats.domElement.style.bottom = '0px';

        // uncomment to view stats.
        // document.body.appendChild( stats.domElement );

        this.fluxBuffer = [];
        this.fluxBufferSize = 30;
        this.t = 0;

        this.r = this.g = this.b = 0.3;
        this.colorChangeTimer = 0;

    }


    VJ.prototype.splat = function (volume) {
        var position = {
            x: Math.random()*1.2 - 0.1,
            y: Math.random()*1.2 - 0.1
        };

        var velocity = {
            x: (Math.random() - 0.5) / 20.0,
            y: (Math.random() - 0.5) / 8.0
        }

        var splat = new Splat.Splat({
            duration: 8,
            size: volume*0.15,
            startPosition: position,
            velocity: velocity,
            scatter: 2 + 4*Math.random(),
            totalAmount: volume < 0.8 ? volume : 0.8
        });
        this.simulationEnv.splat(splat);
    }


    VJ.prototype.clearFluxBuffer = function () {
        this.fluxBuffer.length = 0;
        this.t = 0;
    }


    VJ.prototype.updateFluxBuffer = function(flux) {
        var pos = this.t % this.fluxBufferSize;
        this.fluxBuffer[pos] = flux;
        this.t ++;
    };


    VJ.prototype.averageFlux = function () {
        var totalFlux = 0;
        this.fluxBuffer.forEach(function (f) {
            totalFlux += f;
        });
        return totalFlux/this.fluxBuffer.length;
    };


    VJ.prototype.updateTexture = function (url ){
        this.simulationEnv.textureUrl(url);
    };


    VJ.prototype.getMetaData = function (albumId, cb) {
        var url = 'https://embed.spotify.com/oembed/?url=http://open.spotify.com/album/' + albumId;
        var req = new XMLHttpRequest();
        req.open("GET", url, true);

        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                var json = req.responseText;
                var data = JSON.parse(json);
                cb(data);
            }
        }
        req.send();
    };


    VJ.prototype.textureFromCurrentAlbum = function () {
        var scope = this;
        models.player.load('track').done(function () {
            var uri = player.track.album.uri;
            var id = uri.substr('spotify:album:'.length);
            scope.getMetaData(id, function (data) {
                var coverUrl = data.thumbnail_url;
                var firstIndex = coverUrl.indexOf('cover/');
                var lastIndex = firstIndex + 'cover'.length;

                var url = coverUrl.substr(0, firstIndex) + '640' + coverUrl.substr(lastIndex);
                console.log(url);
                scope.updateTexture(url);
            });
        });

    }


    VJ.prototype.start = function () {
        var scope = this;
        var lastVolume = -1;

        scope.textureFromCurrentAlbum();

        player.addEventListener('change', function(evt) {
            scope.textureFromCurrentAlbum();
        });

        analyzer.addEventListener('audio', function (evt) {
            
            scope.stats.begin();
            var lvolume = 0;
            var rvolume = 0;
            evt.audio.spectrum.left.forEach(function (v) {
                lvolume += 2*v;
            });

            evt.audio.spectrum.right.forEach(function (v) {
                rvolume += 2*v;
            });

            lvolume /= evt.audio.spectrum.left.length*2;
            lvolume /= -96;
            lvolume = 1-lvolume;

            rvolume /= evt.audio.spectrum.right.length*2;
            rvolume /= -96;
            rvolume = 1-rvolume;


            scope.simulationEnv.backgroundColorA({
                r: scope.r * 0.3,
                g: scope.g * 0.3,
                b: scope.b * 0.3,
            });

            if (lastVolume != -1) {
                var flux = (Math.max(rvolume, lvolume) - lastVolume)*Math.max(rvolume, lvolume);
                scope.updateFluxBuffer(flux > 0 ? flux : 0);
            }

            var avg = scope.averageFlux();

            if (flux > avg*2.0) {
                scope.splat(flux*8.0-avg*4.0);
                scope.splat(flux*12.0-avg*4.0);                
            }

            if (flux > avg*2.0 && scope.colorChangeTimer > 1) {
                scope.r = Math.random();
                scope.g = Math.random();
                scope.b = Math.random();
                scope.colorChangeTimer = 0;
            } else {
                scope.r *= 0.999;
                scope.g *= 0.999;
                scope.b *= 0.999;
                scope.colorChangeTimer++;
            }

            lastVolume = Math.min(rvolume, lvolume);
            scope.stats.end();
        });

    }

    var player = models.player;
    var analyzer = audio.RealtimeAnalyzer.forPlayer(player);

    exports.VJ = VJ;

});
