define( [ 'jquery' ], function( $ ){
    /*
        todo:
        + include .stopAll() which loops thru cache object and runs .stop() on any isPlaying
        + include .playAll()
        + create option to stop all others when clicking play (only one playing at a time - simply showing a playing gif takes resources)
    */

    var options = {
        playerSelector: 'div.gifplayer',
        isPausedClass: '.is-paused',
        fullPathData: 'src',
        preload: 2,
        autoplay: 1
    };

    var cache = {};

    var setup = function( cfg, $scope ){
        var $players;

        $.extend( options, cfg );

        $players = $( options.playerSelector, $scope ? $scope : document );

        options.preload = options.preload === true ? $players.length : options.preload;
        options.autoplay = options.autoplay === true ? $players.length : options.autoplay;

        $players.each(function( idx, elem ){
            var $img = $( this ).find( 'img' ),
                fullImgPath = $img.data( options.fullPathData ),
                guid = _parseGuid( fullImgPath );

            cache[ guid ] = {
                full: fullImgPath,
                thumb: $img.attr( 'src' ),
                isPlaying: false,
                isLoaded: false
            };

            if ( options.preload > idx ){
                preload( fullImgPath );
            }

            if ( options.autoplay > idx ){
                play( $img, fullImgPath, guid );
            }
        });

        return this;
    };

    var listen = function(){
        $(document)
            .on( 'hover', options.playerSelector, function( e ){
                var src = $( this ).find( 'img' ).data( options.fullPathData );
                if ( ! cache[ _parseGuid( src ) ].isLoaded ){
                    preload( src );
                }
            })
            .on( 'click', options.playerSelector, function( e ){
                var $img = $( this ).find( 'img' ),
                    fullSrc = $img.data( options.fullPathData ),
                    guid = _parseGuid( fullSrc );

                if ( cache[ guid ].isPlaying ){
                    stop( $img, fullSrc, guid );
                } else {
                    play( $img, fullSrc, guid );
                }
            });
    };

    var preload = function( imgsrc ){
        var img = new Image();
        img.src = imgsrc,
        img.onload = function(){ cache[ _parseGuid( imgsrc ) ].isLoaded = true; };
    };

    var play = function( $thumb, fullImgPath, guid ){
        var $full = $thumb.clone().attr( 'src', fullImgPath );

        $thumb.replaceWith( $full );
        $full.parent().removeClass( options.isPausedClass.replace( '.', '' ) );
        cache[ guid ].isPlaying = true;
    };

    var stop = function( $full, fullImgPath, guid ){
        var $thumb = $full.clone().attr( 'src', cache[ guid ].thumb );

        $full.replaceWith( $thumb );
        $thumb.parent().addClass( options.isPausedClass.replace( '.', '' ) );
        cache[ guid ].isPlaying = false;
    };

    var _parseGuid = function( src ){
        return src.slice( src.lastIndexOf( '/' ) + 1 ).replace( '.gif', '' );
    };

    // public api /////////////////////////////////////////////////////////////
    return {
        options: options,
        setup: setup,
        listen: listen,
        getCache: function(){ return cache; }
    };
});
