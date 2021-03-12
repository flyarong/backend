<style lang="less" scoped>
.cap-question-box {
  background-color: rgba(0, 0, 0, 0.02);
  padding: 15px;
}
</style>
<template>
  <div class="cap-question-box">
    <FormItem label="类型">
      <Select v-model="question.type" :datas="types" keyName="id" titleName="name"></Select>
    </FormItem>
    <FormItem label="分数">
      <input type="text" v-model="question.score" />
    </FormItem>
    <FormItem label="问题">
      <wang-editor v-model="question.content"></wang-editor>
    </FormItem>
    <div class="answer-box">
      <paper-question-choice :content="question.answer" :que="question" @update="contentUpdate" v-if="question.type === 1"></paper-question-choice>
      <paper-question-select
        :content="question.answer.split(',')"
        @update="contentUpdate"
        :que="question"
        v-else-if="question.type === 2"
      ></paper-question-select>
      <paper-question-input
        :content="question.answer"
        @update="contentUpdate"
        v-else-if="question.type === 3 || question.type === 4"
      ></paper-question-input>
      <paper-question-judge
        :content="parseInt(question.answer) === 1 ? '正确' : '错误'"
        @update="contentUpdate"
        v-else-if="question.type === 5"
      ></paper-question-judge>
    </div>
  </div>
</template>

<script>
import WangEditor from '@/components/common/wangEditor';
import PaperQuestionChoice from './choice';
import PaperQuestionInput from './input';
import PaperQuestionJudge from './judge';
import PaperQuestionSelect from './select';
export default {
  props: ['que', 'index'],
  components: {
    WangEditor,
    PaperQuestionChoice,
    PaperQuestionInput,
    PaperQuestionJudge,
    PaperQuestionSelect
  },
  data() {
    return {
      types: [
        { id: 1, name: '单选' },
        { id: 2, name: '多选' },
        { id: 3, name: '填空' },
        { id: 4, name: '问答' },
        { id: 5, name: '判断' }
      ],
      question: this.que
    };
  },
  watch: {
    que() {
      this.question = this.que;
    },
    'question.type'() {
      this.emitUpdate();
    },
    'question.score'() {
      this.emitUpdate();
    },
    'quetion.content'() {
      this.emitUpdate();
    }
  },
  methods: {
    contentUpdate(t, val, length, options) {
      if (t === 'input' || t === 'judge') {
        this.question.answer = val;
      } else if (t === 'choice') {
        this.question.answer = val;
        for (let i = 1; i <= length; i++) {
          this.question['option' + i] = options['option' + i];
        }
      } else if (t === 'select') {
        this.question.answer = val.join(',');
        for (let i = 1; i <= length; i++) {
          this.question['option' + i] = options['option' + i];
        }
      }

      this.emitUpdate();
    },
    emitUpdate() {
      this.$emit('update', this.index, this.question);
    }
  }
};
</script>
