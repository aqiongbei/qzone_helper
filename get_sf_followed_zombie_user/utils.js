'use strict'

const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

const MIN_PAGE_NO = 1;
const MAX_PAGE_LIST_NO = 20;
const UA_CHROME = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36";
const host = 'https://segmentfault.com';
const keyList = [{
    text: '他的回答',
    key: 'answers'
},{
    text: '他的提问',
    key: 'questions'
}, {
    text: '他的文章',
    key: 'articles'
}, {
    text: '他的讲座',
    key: 'lives'
}, {
    text: '他的笔记',
    key: 'notes'
}, {
    text: '他的分享',
    key: 'share'
}];

function getParameters() {
    let username = '';
    let args = process.argv.splice(2);
    let usageStr = `Usage: -username yourusername`;

    try {
        if (args instanceof Array && args.length > 1 && args.includes('-username')) {
            username = args[1];
        } else {
            console.log(usageStr);
        }
    } catch (e) {
        console.log(usageStr);
    }

    return username;
}

async function getFollowedPage(username, pageNo) {
    let followedUrl = `${host}/u/${username}/users/followed`;
    let options = {
        url: followedUrl,
        method: 'GET',
        headers: {
            'User-Agent': UA_CHROME,
        },
        qs: {
            page: pageNo
        },
        timeout: 30 * 1000
    }

    return new Promise(async (resolve, reject) => {
        request(options, (err, result) => {
            if (err) {
                return resolve('');
            }
            return resolve(result.body);
        })
    })
}

async function getUserInfoPage (uid) {
    let options = {
        url: `${host}${uid}`,
        method: 'GET',
        headers: {
            'User-Agent': UA_CHROME,
        },
        timeout: 30 * 1000
    }

    return new Promise(async (resolve, reject) => {
        request(options, (err, result) => {
            if (err) {
                return resolve('');
            }
            return resolve(result.body);
        })
    })
}

async function getUserActivitiesPage (uid, pageNo) {
    let options = {
        url: `${host}${uid}/activities`,
        method: 'GET',
        headers: {
            'User-Agent': UA_CHROME,
        },
        qs: {
            page: pageNo
        },
        timeout: 30 * 1000
    }

    return new Promise(async (resolve, reject) => {
        request(options, (err, result) => {
            if (err) {
                return resolve('');
            }
            return resolve(result.body);
        })
    })
}

function parseFollowedList (html) {
    let result = [];
    let $ = cheerio.load(html);
    let followedEle = $('.profile-following__users');

    if (followedEle.length > 0) {
        let folloedListEle = followedEle.find('li a');

        folloedListEle.each( (index, item) => {
            result.push($(item).attr('href'));
        })
    }

    return result;
}

function parseUserInfo (html) {
    let result = {};

    if (!html) {
        return result;
    }

    let $ = cheerio.load(html);

    if (html.includes('权限不足')) {
        result.error = $('.p').eq(0).text();
        return result;
    }


    let followedEle = $('.profile__heading-info .h5');
    let temp = '';

    result.following = parseInt(followedEle.eq(0).text() || 0); // 关注了
    result.followed = parseInt(followedEle.eq(1).text() || 0); // 粉丝
    result.username = $('.profile__heading--name').text().replace('查看完整档案', '').trim();
    result.rank = parseInt($('.profile__rank-btn').text()); // 声望

    temp = $('.profile__heading--avatar').attr('src');
    result.avatar = temp.includes('/global/img/user-256') ? '' : temp; // 头像

    temp = $('.profile__desc').text().trim();
    result.desc = temp.includes('该用户太懒什么也没留下') ? '' : temp; // 个人描述

    temp = $('.profile__city').text().replace('编辑', '').trim();
    result.city = temp.includes('填写现居城市') ? '' : temp;

    temp = $('.profile__school').text().replace('编辑', '').trim();
    result.school = temp.includes('填写毕业院校') ? '' : temp;

    temp = $('.profile__company').text().replace('编辑', '').trim();
    result.company = temp.includes('填写所在公司') ? '' : temp;

    temp = $('.profile__site').text().replace('编辑', '').trim();
    result.site = temp.includes('填写个人主网站') ? '' : temp;

    let userInfoEle = $('.nav-pills.nav-stacked.profile__nav li');

    userInfoEle.each( (index, item) => {
        let content = $(item).text();
        for (let prop of keyList) {
            if (content.includes(prop.text)) {
                result[prop.key] = parseInt($(item).find('.count').text() || 0);
            }
        }
    })

    return result;
}

function parseUserActivities (html) {
    let result = [];
    let $ = cheerio.load(html);
    let activiesEle = $('.timeline.timeline-jswork').children('div');

    if (activiesEle.length > 0) {
        activiesEle.each( (index, item) => {
            item = $(item);
            let activie = {};

            let content = item.find('.sentence').text().trim();
            if (content.length > 0) {
                activie.type = content.split('·')[0].trim().split(' ')[1].trim().replace('了', '');
                activie.date = content.split('·')[1].trim();
            }

            let linkItem = item.find('.title a');

            if (linkItem.length == 0) {
                linkItem = item.find('h3 a'); // 讲座/头条/活动
            }

            activie.title = linkItem.text().trim();
            activie.url = linkItem.attr('href');

            result.push(activie);
        })
    }
    return result;
}

function formatLength(source, target = 1000) {
    let targetLen = target.toString().length;
    let sourceLen = source.toString().length;
    let d_value = targetLen - sourceLen;

    if (d_value > 0) {
        for (var i = sourceLen; i < targetLen; i ++) {
            source = ' ' + source;
        }
    }
    return source;
}

function writeJson (filename, data) {
    filename = `${filename}.json`;
    let filePath = path.join('.', 'data');

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }

    fs.writeFileSync(path.join(filePath, filename), JSON.stringify(data, null, 4), 'utf8');
}

function formatLog(msg) {
    return `==================== ${msg} ====================`;
}

async function getFollwedUsers (username) {
    console.log(formatLog('get followed user list'));

    let isNextAble = true;
    let pageNo = MIN_PAGE_NO;
    let followedUserList = [];

    while (isNextAble) {
        let followedPage = await getFollowedPage(username, pageNo);
        let followedList = parseFollowedList(followedPage);
        console.log(`pageNo: ${formatLength(pageNo)} | followedList: ${followedList.length}`);

        if (followedList.length == MAX_PAGE_LIST_NO) {
            pageNo ++;
            followedUserList = followedUserList.concat(followedList);
        } else {
            if (followedList.length > 0) {
                followedUserList = followedUserList.concat(followedList);
            }

            pageNo = MIN_PAGE_NO;
            isNextAble = false;
        }
    }

    return followedUserList
}

async function getUsersInfo (userList) {
    console.log(formatLog('get followed user info'));

    let len = userList.length;
    let likeZombieUsers = [];
    let followedUsersInfo = [];

    for (let index in userList) {
        let uid = userList[index];
        let userInfoPage = await getUserInfoPage(uid);
        let userInfo = parseUserInfo(userInfoPage);

        userInfo.uid = uid;

        if (userInfo.error) {
            console.log(`${formatLength(+index + 1, len)}/${len} | uid: ${userInfo.uid} | error: ${userInfo.error}`);
            continue;
        }


        if ((userInfo.rank > 3) || userInfo.avatar || userInfo.desc || userInfo.city || userInfo.school || userInfo.company || userInfo.site || userInfo.answers || userInfo.questions || userInfo.articles || userInfo.notes || userInfo.share) {
            userInfo.isLikeZombie = false;
        } else {
            userInfo.isLikeZombie = true;
            userInfo.activities = await getUsersActivities(uid);
            likeZombieUsers.push(userInfo);
        }

        followedUsersInfo.push(userInfo);

        console.log(`${formatLength(+index + 1, len)}/${len} | isLikeZombie: ${userInfo.isLikeZombie ? (userInfo.isLikeZombie + ' ') : false} | username: ${userInfo.username}`);
    }

    return {likeZombieUsers, followedUsersInfo};
}

async function getUsersActivities (uid) {
    let userActivities = [];

    let isNextAble = true;
    let pageNo = MIN_PAGE_NO;

    while (isNextAble) {
        let userActivitiesPage = await getUserActivitiesPage(uid, pageNo);
        let userActivitiesInfo = parseUserActivities(userActivitiesPage);

        if (userActivitiesInfo.length == MAX_PAGE_LIST_NO) {
            pageNo ++;
            userActivities = userActivities.concat(userActivitiesInfo);
        } else {
            if (userActivitiesInfo.length > 0) {
                userActivities = userActivities.concat(userActivitiesInfo);
            }

            pageNo = MIN_PAGE_NO;
            isNextAble = false;
        }
    }

    return userActivities;
}

function getZombieUsers(likeZombieUsers) {
    console.log(formatLog('get followed zombieUser per'))
    return likeZombieUsers;
}

module.exports = {getFollwedUsers, getUsersInfo, getZombieUsers, getParameters, writeJson}