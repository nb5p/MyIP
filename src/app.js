const $$ = document;
let random = parseInt(Math.random() * 100000000);
let IP = {
    get: (url, type) =>
        fetch(url, { method: 'GET' }).then((resp) => {
            if (type === 'text')
                return Promise.all([resp.ok, resp.status, resp.text(), resp.headers]);
            else {
                return Promise.all([resp.ok, resp.status, resp.json(), resp.headers]);
            }
        }).then(([ok, status, data, headers]) => {
            if (ok) {
                let json = {
                    ok,
                    status,
                    data,
                    headers
                }
                return json;
            } else {
                throw new Error(JSON.stringify(json.error));
            }
        }).catch(error => {
            throw error;
        }),
    parseIPIpapi: (ip, elID) => {
        IP.get(`https://api.skk.moe/network/parseIp/v2/${ip}`, 'json')
            .then(resp => {
                $$.getElementById(elID).innerHTML = `${resp.data.country} ${resp.data.regionName} ${resp.data.city} ${resp.data.isp}`;
            })
    },
    parseIPIpip: (ip, elID) => {
        IP.get(`https://api.skk.moe/network/parseIp/ipip/${ip}`, 'json')
            .then(resp => {
                let x = '';
                for (let i of resp.data) {
                    x += (i !== '') ? `${i} ` : '';
                }
                $$.getElementById(elID).innerHTML = x;
                //$$.getElementById(elID).innerHTML = `${resp.data.country} ${resp.data.regionName} ${resp.data.city} ${resp.data.isp}`;
            })
    },
    getIpipnetIP: () => {
        IP.get(`https://myip.ipip.net/?z=${random}`, 'text')
            .then((resp) => {
                let data = resp.data.replace('当前 IP：', '').split(' 来自于：');
                $$.getElementById('ip-ipipnet').innerHTML = `<p>${data[0]}</p><p class="sk-text-small">${data[1]}</p>`;
            });
    },
    getTaobaoIP: (data) => {
        $$.getElementById('ip-taobao').innerHTML = data.ip;
        IP.parseIPIpip(data.ip, 'ip-taobao-ipip');
    },
    getIpifyIP: () => {
        IP.get(`https://api.ipify.org/?format=json&z=${random}`, 'json')
            .then(resp => {
                $$.getElementById('ip-ipify').innerHTML = resp.data.ip;
                return resp.data.ip;
            })
            .then(ip => {
                IP.parseIPIpip(ip, 'ip-ipify-ipip');
            })
            .catch(e => {
                window.alert('如果你正在使用 ADBlock 或者类似的插件，请取消在本页面时对 api.ipify.org 的拦截')
            })
    },
    getIPApiIP: () => {
        IP.get(`https://ipapi.co/json?z=${random}`, 'json')
            .then(resp => {
                $$.getElementById('ip-ipapi').innerHTML = resp.data.ip;
                IP.parseIPIpip(resp.data.ip, 'ip-ipapi-geo');
            })
            .catch(e => {
                window.alert('如果你正在使用 ADBlock 或者类似的插件，请取消在本页面时对 ipapi.co 的拦截')
            })
    },
    getSohuIP: () => {
        if (typeof returnCitySN === 'undefined') {
            window.alert('如果你正在使用 ADBlock 或者类似的插件，请取消在本页面时对 pv.sohu.com 的拦截')
        }
        $$.getElementById('ip-sohu').innerHTML = returnCitySN.cip;
        IP.parseIPIpip(returnCitySN.cip, 'ip-sohu-geo');
    }
};

let HTTP = {
    checker: (domain, cbElID) => {
        let img = new Image;
        let timeout = setTimeout(() => {
            img.onerror = img.onload = null;
            $$.getElementById(cbElID).innerHTML = '<span class="sk-text-error">连接超时</span>'
            // Cancel the load
            img.src = null;
        }, 6000);

        img.onerror = () => {
            clearTimeout(timeout);
            $$.getElementById(cbElID).innerHTML = '<span class="sk-text-error">无法访问</span>'
        }

        img.onload = () => {
            clearTimeout(timeout);
            $$.getElementById(cbElID).innerHTML = '<span class="sk-text-success">连接正常</span>'
        }

        img.src = `https://${domain}/favicon.ico?${+(new Date)}`
    },
    runcheck: () => {
        HTTP.checker('www.baidu.com', 'http-baidu');
        HTTP.checker('s1.music.126.net/style', 'http-163');
        HTTP.checker('github.com', 'http-github');
        HTTP.checker('www.youtube.com', 'http-youtube');
    }
};

HTTP.runcheck();
IP.getIpipnetIP();
//IP.getIPApiIP();
IP.getIpifyIP();
IP.getSohuIP();

const jQueryCallback = (data) => {
    $$.getElementById('ip-ipsb').innerHTML = data.address;
    $$.getElementById('ip-ipsb-geo').innerHTML = `${data.country} ${data.province} ${data.city} ${data.operator}`;
}