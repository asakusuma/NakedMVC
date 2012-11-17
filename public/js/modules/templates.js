define( 'Templates', function() {

    $('.template').each(function() {
        var el = $(this);
        dust.loadSource(dust.compile(el.html(), el.attr('data-name')));
    });

    /*
    //Load underscore templates
    $('.template').each(function() {
        var el = $(this),
            ids = el.attr('data-name').split('-'),
            ref = {};

        ref = templates;;
        for (var i = 0; i < ids.length; i++) {
            if (i == ids.length - 1) {
                ref[ids[i]] = _.template(el.html());
                break;
            }
            if (!_.isObject(ref[ids[i]]) || !_.isFunction(ref[ids[i]])) {
                ref[ids[i]] = {};
            }
            ref = ref[ids[i]];
        }
    });
    */
});