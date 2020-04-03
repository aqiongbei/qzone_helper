const fs = require('fs');
const async = require('async');

async.map(['../get_sf_followed_user_info.js','../package-lock.json','file3'], fs.stat, function(err, results) {
    console.log(results)
});
