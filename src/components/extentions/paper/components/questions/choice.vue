<style lang="less" scoped>
.add-option-button {
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
      <Select v-model="answer" :datas="choiceAnswers" keyName="key" titleName="title">
        <template slot-scope="{ item }" slot="item">
          <div>{{ item.title }}</div>
        </template>
      </Select>
    </FormItem>
    <FormItem :prop="'option' + i" v-for="i in length" :key="i">
      <template v-slot:label>选项{{ i }}</template>
      <wang-editor v-model="question['option' + i]" :height="100"></wang-editor>
    </FormItem>
    <div class="add-option-button" v-if="length < max" @click="length++">添加选项</div>
  </div>
</template>

<script>
import WangEditor from '@/components/common/wangEditor';

export default {
  props: ['content', 'que'],
  components: {
    WangEditor
  },
  data() {
    return {
      max: 10,
      length: 4,
      answer: typeof this.content !== 'undefined' ? this.content : null,
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
  mounted() {
    this.lengthSync();
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
  watch: {
    que() {
      this.question = this.que;

      this.lengthSync();
    },
    content() {
      this.answer = this.content;
    },
    answer() {
      this.$emit('update', 'choice', this.answer, this.length, this.question);
    },
    'question.option1'() {
      this.$emit('update', 'choice', this.answer, this.length, this.question);
    },
    'question.option2'() {
      this.$emit('update', 'choice', this.answer, this.length, this.question);
    },
    'question.option3'() {
      this.$emit('update', 'choice', this.answer, this.length, this.question);
    },
    'question.option4'() {
      this.$emit('update', 'choice', this.answer, this.length, this.question);
    },
    'question.option5'() {
      this.$emit('update', 'choice', this.answer, this.length, this.question);
    },
    'question.option6'() {
      this.$emit('update', 'choice', this.answer, this.length, this.question);
    },
    'question.option7'() {
      this.$emit('update', 'choice', this.answer, this.length, this.question);
    },
    'question.option8'() {
      this.$emit('update', 'choice', this.answer, this.length, this.question);
    },
    'question.option9'() {
      this.$emit('update', 'choice', this.answer, this.length, this.question);
    },
    'question.option10'() {
      this.$emit('update', 'choice', this.answer, this.length, this.question);
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
      if (i === 0) {
        return;
      }
      this.length = i;
    }
  }
};
</script>