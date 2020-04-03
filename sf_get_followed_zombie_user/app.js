'use strict'

const {getFollwedUsers, getUsersInfo, getZombieUsers, getParameters, writeJson} = require('./utils');

process.on('uncaughtException', function (err) {
    console.log(err);
});

process.on('unhandledRejection', function(err, p) {
    console.log(err.stack);
});

let username = getParameters();

if (!username) {
    return console.log(`Usage: -username yourusername`);
}

;(async () => {
    let followedUsers = await getFollwedUsers(username);
    let {likeZombieUsers, followedUsersInfo} = await getUsersInfo(followedUsers);

    writeJson(`${username}_all`, followedUsersInfo);
    writeJson(`${username}_zombie`, likeZombieUsers);

    let zombieUsers = getZombieUsers(likeZombieUsers);

    let all = followedUsersInfo.length;
    let zombie = zombieUsers.length;
    console.log(`allFollowedUser: ${all}, zombieUser: ${zombie}, zombiePer: ${((zombie / all) * 100).toFixed(2)}%`);
})();

