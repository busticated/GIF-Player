require.config({
    paths : {
        'jquery' : 'http://code.jquery.com/jquery-latest'
    }
});
require( [ 'mods/gifplayer' ], function( gifplayer ){
    $( document ).ready(function(){
        gifplayer.setup().listen();
    });
});
