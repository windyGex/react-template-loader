## seek-component-loader

Write single file component use react template.

### Install

```
tnpm install seek-component-loader --save-dev
```

### Config

```js
{
  test: /\.sc$/,
  loader: 'seek-component-loader',
  query: {
    loaders: {
      js: 'babel',
      css: 'style!css',
      sass: 'style!css!sass'
    }
  }
}
```

### Write sinlge file component.

```js
<SeekComponent>
<template>
  <input className="new-todo" type="text" placeholder="What needs to be done?"
    onKeyDown="{this.handleKeyDown.bind(this)}" />
</template>

<style lange="sass">
  .new-todo {
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

### Know Issues

* Not support stateless component.
