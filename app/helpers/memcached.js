var Memcached = require('memcached'),
       config = require('config'),
            Q = require('q');

var serverLocation = config.memcached.host + ":" + config.memcached.port;

var memcached = new Memcached( serverLocation );

module.exports = {

    get: function( key ) {
        var deferred = Q.defer();

        memcached.get( key, function( err, result ) {
             err ? deferred.reject( err ) : deferred.resolve( result );
        });

        return deferred.promise;
    },

    set: function( key, value, ttl ) {
        var deffered = Q.defer();

        memcached.set( key, value, ttl, function( err ) {
            if ( err ) {
                deffered.reject( err );
            } else {
                memcached.touch( key, ttl, function( err ) {
                    err ? deffered.reject( err ) : deffered.resolve(true);
                });
                deffered.resolve(true);
            }
        });

        return deffered.promise;
    },

    delete: function( key ){
        var deffered = Q.defer();

        memcached.del( key, function( err ) {
            err ? deffered.reject( err ) : deffered.resolve(true);
        });

        return deffered.promise;
    }

};
