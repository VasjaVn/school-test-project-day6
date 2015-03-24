
var memcached = require('../helpers/memcached');

(function () {

    module.exports = {

        getAction: function* getAction( next ) {
            var key = this.params.key;
            this.body = yield memcached.get( key );
            yield next;
        },

        postAction: function* postAction( next ) {
            var key = this.request.body.key;
            var value = this.request.body.value;
            var ttl = Number( this.request.body.expire );

            var result = yield memcached.set( key, value, ttl );

            if ( result ) {
                this.status = 201;
                this.body = { "message": "Created" }
            } else {
                this.status = 400;
                this.body = { "message": "Bad request" }
            }
            yield next;
        },

        deleteAction: function* deleteAction( next ) {
            var key = this.params.key;

            var keyWasDeleted = yield memcached.delete( key );

            if ( keyWasDeleted ) {
                this.status = 204;
                this.body = { "message": "No content" }
            } else {
                this.status = 400;
                this.body = { "message": "Bad request" }
            }
            yield next;
        }
    }
}());
