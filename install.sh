#!/bin/bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
LANG=en_US.UTF-8
download_Url=https://raw.githubusercontent.com/gacjie/aapanel_chinese/main/panel
panel_Path=/www/server/panel
wget -O ${panel_Path}/config/menu.json  ${download_Url}/config/menu.json
wget -O ${panel_Path}/BTPanel/static/language/English/template.json  ${download_Url}/BTPanel/static/language/English/template.json
wget -O ${panel_Path}/BTPanel/static/language/English/public.json  ${download_Url}/BTPanel/static/language/English/public.json
wget -O ${panel_Path}/BTPanel/static/language/English/log.json  ${download_Url}/BTPanel/static/language/English/log.json
wget -O ${panel_Path}/BTPanel/static/language/English/lan.js  ${download_Url}/BTPanel/static/language/English/lan.js