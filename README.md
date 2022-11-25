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
     
#### 手动安装    
本教程以中文简体为例，如需中文繁体，请使用traditional_chinese目录下的文件。   
1、下载汉化文件包解压       
2、将/simplified_chinese/menu.json文件上传到/www/server/panel/config目录下覆盖英文菜单文件      
3、将/simplified_chinese/目录下其他文件上传到/www/server/panel/BTPanel/static/language/English目录下覆盖替换英文语言数据文件    
4、重启宝塔面板     
5、清理浏览器缓存。   


#### 一键安装    

由于被人举报，因此一键安装脚本将不在提供。
宝塔工具箱系列脚本以及官网删除声明
https://www.baota.me/post-206.html

#### 技术交流      
     
技术教程：www.baota.me     
QQ交流群：699927761      
TG交流群：t.me/btfans    
  
#### 更新日志   
20221101   
本次重新使用腾讯云机器翻译重新汉化，汉化准比之前的百度谷歌好很多。   
同时提供了中文繁体语言包，重写了汉化一键脚本。   
20220908      
更新支持语言包到aapanel 6.8.26版本     
为提高更新频率，编写汉化脚本。  
