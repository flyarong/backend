<template>
  <div v-html="text"></div>
</template>
<script>
export default {
  props: ['question'],
  computed: {
    text() {
      if (this.question.type === 6) {
        // 题帽题
        let content = JSON.parse(this.question.content);
        return content.header;
      }
      return this.question.content;
    }
  }
};
</script>