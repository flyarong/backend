<style lang="less" scoped>
.add-question-button {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: rgba(0, 0, 0, 0.04);
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
}
</style>
<template>
  <div>
    <FormItem label="题帽">
      <wang-editor v-model="header"></wang-editor>
    </FormItem>
    <div class="questions-box">
      <div v-for="(item, index) in questions" :key="index" class="mb-10">
        <cap-question :que="item" :index="index" @update="contentUpdate"></cap-question>
      </div>
    </div>
    <div class="add-question-button" @click="addQuestion">增加试题</div>
  </div>
</template>

<script>
import WangEditor from '@/components/common/wangEditor';
import CapQuestion from './cap_question';

export default {
  props: ['content'],
  components: {
    WangEditor,
    CapQuestion
  },
  data() {
    return {
      header: typeof this.content === 'undefined' ? null : this.content.header,
      questions: typeof this.content === 'undefined' ? [] : this.content.questions
    };
  },
  watch: {
    content() {
      this.header = this.content.header;
      this.questions = this.content.questions;
    }
  },
  methods: {
    contentUpdate(index, q) {
      this.questions[index] = q;
      this.$emit('update', 'cap', this.header, this.questions);
    },
    addQuestion() {
      this.questions.push({
        type: null,
        content: '',
        answer: '',
        score: null,
        option1: null,
        option2: null,
        option3: null,
        option4: null,
        option5: null,
        option6: null,
        option7: null,
        option8: null,
        option9: null,
        option10: null
      });
    }
  }
};
</script>