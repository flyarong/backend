<template>
  <FormItem label="答案">
    <Radio v-model="status" :datas="rows"></Radio>
  </FormItem>
</template>

<script>
export default {
  props: ['content'],
  data() {
    return {
      status: this.content,
      rows: ['正确', '错误']
    };
  },
  watch: {
    content() {
      this.status = this.content;
    },
    status() {
      let v = this.status === '正确' ? 1 : 0;
      this.$emit('update', 'judge', v);
    }
  }
};
</script>