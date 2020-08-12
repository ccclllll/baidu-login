const config = {
    baiduUrl: 'https://www.baidu.com/',
    checkLoginUrl: 'https://index.baidu.com/Interface/Newwordgraph/getIndex',
    stepSleep: 600, // 密码输入间隔时间
    intervalTime: 500
}

async function baiduLogin(name, password) {
    if (!name || !password) return '用户名或密码为空';

    let DRIVER = require('selenium-webdriver'),

        profile = DRIVER.Capabilities.chrome(),
        builder = new DRIVER.Builder().withCapabilities(profile),
        browser = builder.build(),
        By = DRIVER.By;

        

    profile.set('browserName', 'chrome');
    await browser.get(config.baiduUrl);
    await browser.executeScript(`document.getElementById('u1').getElementsByTagName('a')[1].click();`); // 点击登录
    await browser.wait(DRIVER.until.elementLocated(By.id('TANGRAM__PSP_11__footerULoginBtn')), 2000); // 点击账号密码登录
    await browser.sleep(config.intervalTime);
    browser.manage().window().maximize(); // 窗口最大行
    await browser.sleep(config.intervalTime);
    browser.findElement(By.id('TANGRAM__PSP_11__footerULoginBtn')).click();
    await browser.sleep(config.intervalTime);
    let nameInput = browser.findElement(By.id('TANGRAM__PSP_11__userName'));
    let passwordInput = browser.findElement(By.id('TANGRAM__PSP_11__password'));

    // 输入用户名
    for (let i = 0; i < name.length; i++) {
        let stepSleepTime = parseInt(Math.random() * 100 + config.stepSleep);
        await browser.sleep(stepSleepTime);
        nameInput.sendKeys(name[i]);
    }

    // 输入密码
    for (let i = 0; i < password.length; i++) {
        let stepSleepTime = parseInt(Math.random() * 100 + config.stepSleep);
        await browser.sleep(stepSleepTime);
        passwordInput.sendKeys(password[i]);
    }

    await browser.sleep(config.intervalTime);
    // 提交表单
    browser.findElement(By.id('TANGRAM__PSP_11__submit')).click();
    await browser.sleep(config.intervalTime * 2);

    let cookies = '登录失败';
    if (await isLogSuccess(browser)) {
        cookies = await browser.manage().getCookies();
    }

    // 结束浏览器
    browser.quit();
    return cookies;
}


async function isLogSuccess(browser) {
    await browser.get(config.checkLoginUrl);
    let res = JSON.parse(await browser.findElement(By.tagName('body')).getText());
    return res.status == 1;
}

module.exports = baiduLogin;