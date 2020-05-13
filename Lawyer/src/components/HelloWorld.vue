<template>
  <div class="page">
    <div class="container">
      <img src="../assets/images/header.png" alt />

    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}

body {
  max-width: 750px;
  min-width: 320px;
  background: #fff;
  position: relative;
  font-family: PingFangSC-Regular;
}

.page {
  width: 7.5rem;
  padding: 0.3rem;
  background-color: #fff;
}

.container {
  width: 100%;
  margin-bottom: 0.9rem;
  display: block;
}
img {
  width: 6.9rem;
  height: 2.2rem;
}
</style>
