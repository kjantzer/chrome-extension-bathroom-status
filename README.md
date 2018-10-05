
# <img src="icons/32x32.png"> Bathroom Status Chrome Extension

![Version 1.1.0](https://img.shields.io/badge/Version-1.1.0-blue.svg)
![Author](https://img.shields.io/badge/Author-Kevin_Jantzer-blue.svg)
[![Install](https://img.shields.io/badge/Chrome_Webstore-Install-brightgreen.svg)](https://chrome.google.com/webstore/detail/ngieggdpiiohlhkbfgooiijpdclbcpii)


>Display the open/closed status of the bathrooms using door sensors by [WirelessTag.net](http://wirelesstag.net/)

![screenshot](https://i.imgur.com/assHI11.jpg)

# How it Works

Buy and install a [Reed KumoSensor](https://store.wirelesstag.net/products/reed-kumosensor) and [Ethernet Tag Manager](https://wirelesstags.myshopify.com/products/ethernet-tag-manager). Add your API authorization token to the config file, build and install the extension and now the open/close status of your bathroom door(s) will be displayed in your chrome browser toolbar 👌

# Building Extension

Install [parcel.js](https://parceljs.org/) `npm install -g parcel-bundler`

You'll need to create an [API authorization token](http://wirelesstag.net/eth/oauth2_apps.html) and add it to `src/config.js`.

Once done, you can build the extension: `npm run build`

# Developing

If you wish to develop the extension further, you can run `npm start` which will rebuild the app when files change.

# Links

Dashboard → https://my.wirelesstag.net/eth/index.html  
API docs → http://wirelesstag.net/apidoc.html  
Creating AUTH TOKEN → http://wirelesstag.net/eth/oauth2_apps.html

# Changelog

#### v1.1.0 • 2018-10-05
- Show battery level when low
- Improve design
- Closed bathrooms can be watched and a notification will be sent when open again

#### v1.0.0 • 2018-05-04
- Initial release