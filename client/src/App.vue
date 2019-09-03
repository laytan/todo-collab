<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style lang="scss">
.red-border {
  background-color: rgba(0,0,0,0);
  border: #f44336 2px solid;

  &:hover, &:focus {
    background-color: #f44336;
  }
}
</style>
