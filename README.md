# chatbot

> This is a wechat bot offer virtual coins price.

### install  
You need nodejs >= 14.0.0
```
git clone https://github.com/orlandoxu/chatbot.git
cd chatbot
npm install
cp config.yaml.example config.yaml
node app.js
```

### Notice.
```
1. Can not recall the message, cause wechaty-puppet-wechat plugin doesn't supported.
2. If u got some error.
    Centos:
    https://www.codenong.com/cs107058061/ may help u.
    yum install at-spi2-atk -y
    yum install libXScrnSaver* -y
    yum install gtk3 -y
    and ~, you can use 
    cd node_modules/_puppeteer@2.1.1@puppeteer/.local-chromium/linux-722234/chrome-linux
    ## 查看
    chrome | grep not
    check which package is not supported
    
    Ubuntu:
    sudo apt-get update
    sudo apt-get install libatk1.0-0
    sudo apt-get install libatk-bridge2.0-0
    sudo apt-get install libxkbcommon-x11-0
    sudo apt-get update && apt-get install -yq --no-install-recommends libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 libnss3 
    sudo apt-get install libgbm1
    sudo apt-get install libxshmfence1
```
