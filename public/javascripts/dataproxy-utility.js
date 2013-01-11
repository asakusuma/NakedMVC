define('dataproxy-utility', [
    'lib/underscore'
  ], function (
    _
  ) {

    return {
      buildMapReduceFunction: function(request, callback, context) {
        var evaluate = function(d, query, key) {
          var result = false,
            i,
            key,
            data;


          if(_.isObject(d) && _.isObject(d.attributes) && _.isString(d.cid)) {
            data = d.attributes;
          } else if(_.isObject(d)) {
            data = d;
          } else {
            return false;
          }

          if(_.isArray(query)) {
            //OR
            for(i = 0; i < query.length; i++) {
              if(evaluate(data, query[i])) return true;
            }
            return false;
          } else if(_.isObject(query)) {
            //AND
            result = true;
            for(key in query) {
              result = result && evaluate(data, query[key], key);
            }
            return result;
          } else if(key) {
            //Individual rule
            if(key === 'schema') {
              if(data.schema === query) return true;
            }
          }
          return false;
        }
        return function(data, originSocketID) {
          if(evaluate(data, request.arguments[0])) {
            if(context) {
              callback.call(context,_.extend(data, {
                'originSocketID': originSocketID
              }));
            } else {
              callback(_.extend(data, {
                'originSocketID': originSocketID
              }));
            }
          }
        };
      }
    };
});