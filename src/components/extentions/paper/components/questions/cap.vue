<style lang="less" scoped>
.questions-box {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.03);

  .cap-question-item {
    width: 100%;
    height: auto;
    float: left;
    box-sizing: border-box;
    padding: 15px;
    background-color: rgba(0, 0, 0, 0.04);

    &:hover {
      background-color: rgba(0, 0, 0, 0.07);
    }
  }
}

.add-question-button,
.remove-question-button {
  width: 100%;
  height: 30px;
  float: left;
  line-height: 30px;
  background-color: rgba(0, 0, 0, 0.1);
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.09);
  }
}
</style>
<template>
  <div>
    <FormItem label="题帽">
      <wang-editor v-model="header"></wang-editor>
    </FormItem>
    <Row>
      <Cell :width="24">
        <div class="questions-box" v-if="questions.length > 0">
          <Row :space="10">
            <Cell :width="24" v-for="(item, index) in questions" :key="index">
              <div class="cap-question-item">
                <a href="javascript:void(0)" @click="removeQuestion(index)">删除试题</a>
                <cap-question :que="item" :index="index" @update="contentUpdate"></cap-question>
              </div>
            </Cell>
          </Row>
        </div>
      </Cell>
    </Row>
    <Row :space="10">
      <Cell :width="24">
        <div class="add-question-button" @click="addQuestion">增加试题</div>
      </Cell>
    </Row>
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
      this.emitUpdate();
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
    },
    removeQuestion(index) {
      this.questions.splice(index, 1);

      this.emitUpdate();
    },
    emitUpdate() {
      this.$emit('update', 'cap', this.header, this.questions);
    }
  }
};
</script>
