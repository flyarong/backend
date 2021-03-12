<style lang="less" scoped>
.add-option-button,
.del-option-button {
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
    <FormItem label="答案">
      <Select v-model="answer" :datas="choiceAnswers" :multiple="true" keyName="key" titleName="title">
        <template slot-scope="{ item }" slot="item">
          <div>{{ item.title }}</div>
        </template>
      </Select>
    </FormItem>
    <FormItem :label="'选项' + i" :prop="'option' + i" v-for="i in length" :key="i">
      <wang-editor v-model="question['option' + i]" :height="50"></wang-editor>
    </FormItem>

    <Row :space="10">
      <Cell :width="12">
        <div class="add-option-button" v-if="length < max" @click="length++">添加选项</div>
      </Cell>
      <Cell :width="12">
        <div class="del-option-button" @click="deleteOption">删除选项</div>
      </Cell>
    </Row>
  </div>
</template>

<script>
import WangEditor from '@/components/common/wangEditor';
const _ = require('lodash');

export default {
  props: ['content', 'que'],
  components: {
    WangEditor
  },
  data() {
    return {
      max: 10,
      length: 4,
      answer: typeof this.content !== 'undefined' ? this.content : [],
      question:
        typeof this.que === 'undefined'
          ? {
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
            }
          : this.que
    };
  },
  computed: {
    choiceAnswers() {
      let arr = [];
      for (let i = 1; i <= this.length; i++) {
        arr.push({
          key: 'option' + i,
          title: `选项${i}`
        });
      }
      return arr;
    }
  },
  mounted() {
    this.lengthSync();
  },
  watch: {
    que() {
      this.question = this.que;

      this.lengthSync();
    },
    content() {
      this.answer = this.content;
    },
    answer() {
      this.emitUpdate();
    },
    'question.option1'() {
      this.emitUpdate();
    },
    'question.option2'() {
      this.emitUpdate();
    },
    'question.option3'() {
      this.emitUpdate();
    },
    'question.option4'() {
      this.emitUpdate();
    },
    'question.option5'() {
      this.emitUpdate();
    },
    'question.option6'() {
      this.emitUpdate();
    },
    'question.option7'() {
      this.emitUpdate();
    },
    'question.option8'() {
      this.emitUpdate();
    },
    'question.option9'() {
      this.emitUpdate();
    },
    'question.option10'() {
      this.emitUpdate();
    }
  },
  methods: {
    lengthSync() {
      if (!this.que) {
        return;
      }
      let i = 1;
      for (; i <= this.max; i++) {
        if (this.que['option' + i] === null) {
          break;
        }
      }
      i--;
      this.length = i;
    },
    deleteOption() {
      if (this.length === 0) {
        return;
      }

      let key = 'option' + this.length;
      this.question[key] = null;
      this.length--;

      // 答案选择清空
      let index = _.indexOf(this.answer, key);
      if (index !== -1) {
        this.answer.splice(index, 1);
      }
    },
    emitUpdate() {
      this.$emit('update', 'select', this.answer, this.length, this.question);
    }
  }
};
</script>