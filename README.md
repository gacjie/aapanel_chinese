# aapanel_chinese

#### 介绍
本项目为aapanel(宝塔海外版)的中文语言包。    
为了版本兼容性以及后续更新，本包只汉化了语言配置文件。    
宝塔有部分文本分散写在模板以及面板代码内，因此汉化并不完整。     
本次使用腾讯云机器翻译API汉化，汉化准确性提升，感觉腾讯的比谷歌百度都要好。  
PS：正常使用6.8.21汉化版的不建议更新    

#### 演示图片    
 ![simplified_chinese.jpg](https://raw.githubusercontent.com/gacjie/aapanel_chinese/main/simplified_chinese.jpg)   
  ![traditional_chinese.jpg](https://raw.githubusercontent.com/gacjie/aapanel_chinese/main/traditional_chinese.jpg)   

#### 目录说明
/english   英文原版文件    
/simplified_chinese   中文简体汉化文件     
/traditional_chinese   中文繁体汉化文件      
     
#### 相关文章
[宝塔海外版aapanel升级(降级)指定版本](https://www.baota.me/post-264.html)     
[新蓝白配色清新宝塔面板模板美化主题](https://www.baota.me/post-233.html) 

#### 命令行安装
以6.8.27中文简体版本为例，其他版本请复制[发行版](https://github.com/gacjie/aapanel_chinese/releases) 内支持版本的下载链接替换教程链接。  
下载资源包   
```shell-session
wget -O aapanel_chinese.zip https://github.com/gacjie/aapanel_chinese/releases/download/6.8.27/aapanel_simplified_chinese_6827.zip
```
解压到覆盖资源文件
```shell-session
unzip -o aapanel_chinese.zip -d /www/server/
```
重启面板
```shell-session
/etc/init.d/bt restart
```
最后还需要手动清理浏览器缓存

#### 技术交流      
     
技术教程：www.baota.me     
QQ交流群：682796000      

#### 赞助推广
[最佳亚洲CDN、边缘和安全解决方案 - 腾讯 EdgeOne ](https://edgeone.ai/?from=github)  
![edgeone.jpg](https://edgeone.ai/media/34fe3a45-492d-4ea4-ae5d-ea1087ca7b4b.png)  


 
