## @ali/react-template-loader

react-template-loader是基于webpack的loader，用于seek component的编写。

### 安装

```
tnpm install @ali/react-template-loader --save-dev
```

### 配置

```js
{
    test: /\.rt$/,
    loader: '@ali/react-template-loader'
}
```

### RT文件编写格式

```js
<SeekComponent>
<template>
  <input className="new-todo" type="text" placeholder="What needs to be done?"
    onKeyDown="{this.handleKeyDown.bind(this)}" />
</template>

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
