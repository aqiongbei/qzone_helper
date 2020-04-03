'use strict'

const fs = require('fs');
const path = require('path');
const request = require('request');

const UA_CHROME = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36";

async function requestSync (options) {
    options.method = options.method || 'get';
    options.headers = options.headers || {};
    options.headers['User-Agent'] = UA_CHROME;
    options.timeout = 30 * 1000;
    return new Promise(async (resolve, reject) => {
        request(options, (err, result) => {
            if (err) {
                return resolve('');
            }
            return resolve(result);
        })
    })
}

function readJson (filename) {
    let result = fs.readFileSync(`./data/${filename}.json`);
    return JSON.parse(result);
}

function formatLog(msg, type = 'info') {
    if (type == 'info') {
        return `==================== ${msg} ====================`;
    } else {
        return `>>>>>>>>>>>>>>>>>>>> ${msg} <<<<<<<<<<<<<<<<<<<<`;
    }
}

function getFilesInfo (html) {
    let result = {
        shareid: '',
        from: '',
        fsidlist: [],
    }
    if (html === '') {
        return result;
    }
    let reg = /yunData.setData\((.*)\);/gim;
    let params = reg.exec(html);
    if (params.length > 1) {
        params = params[1];
        try {
            params = JSON.parse(params);
            result.shareid = params.shareid;
            result.from = params.uk;
            if (params.file_list) {
                params.file_list.list.map(item => {
                    result.fsidlist.push(item.fs_id);
                })
            }
        } catch (e) {
            return result;
        }
    }
    return result;
}

module.exports = {getFilesInfo, requestSync, readJson, formatLog}