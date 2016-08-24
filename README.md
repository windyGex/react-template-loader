## @ali/seek-component-loader

seek-component-loader是webpack的loader，用于seek component文件的编译。

### 安装

```
tnpm install @ali/seek-component-loader --save-dev
```

### 配置

```js
{
  test: /\.sc$/,
  loader: '@ali/seek-component-loader',
  query: {
    loaders: {
      js: 'babel',
      css: 'style!css',
      sass: 'style!css!sass'
    }
  }
}
```

### SC文件编写格式

```js
<SeekComponent>
<template>
  <input className="new-todo" type="text" placeholder="What needs to be done?"
    onKeyDown="{this.handleKeyDown.bind(this)}" />
</template>

<!-- 目前只支持css/sass，默认css -->
<style lange="sass">
  .new-todo {
    /* some sass or scss */
  }
</style>

<script>
  import React from 'react'

  export default class AddTodo extends React.Component{
    handleKeyDown (e){
      let {handleAddTodo} = this.props;
      if (e.keyCode === 13) {
          const text = e.target.value.trim()
          if (text) {
            handleAddTodo(text)
            e.target.value = ''
          }
      }
    }
  }
</script>
</SeekComponent>
```
