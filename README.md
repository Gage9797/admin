# 自定义Icon组件说明
```bash
iview组件库包含了Icon组件，但是由于Icon样式数量有限，且不支持自定义拓展，所以我编写了
麒龙自定义的icon组件，组件api和iview2.x版本的Icon完全相同，组件文件是src/components/ql-icon.vue，
已注册成全局组件，在页面中直接通过<ql-icon></ql-icon>标签使用。
如需拓展组件，需要更新src/icons/font文件夹和src/icons/style.css文件两处位置，历史新增的icon的svg原文件都保存在src/icons/svg文件夹下，每次更新时在icomoon网站上传svg文件夹下的svg文件和新增的svg文件，并将新增的svg保存到svg文件夹中。

需要注意的地方：不要在style.css文件中指定图标字体的颜色，否则无法在调用组件的页面中通过选择器指定组
件颜色为其他颜色，更无法动态修改icon的颜色。
```
