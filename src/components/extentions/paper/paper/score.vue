<style lang="less" scoped>
.question-item {
  width: 100%;
  height: auto;
  float: left;
  padding: 15px;
  border: 1px dashed #dddddd;

  .title {
    width: 100%;
    height: auto;
    float: left;
    line-height: 36px;
    font-weight: 600;
  }

  .content {
    width: 100%;
    height: auto;
    float: left;
    font-size: 12px;

    .option {
      width: 100%;
      height: auto;
      float: left;
      margin-right: 15px;
      margin-bottom: 15px;

      .option-item {
        width: 100%;
        height: auto;
        float: left;
        line-height: 20px;
        padding-left: 10px;
        margin-bottom: 2px;

        &.user-active {
          background-color: red;
          color: white;
        }

        &.active {
          background-color: rgba(0, 128, 0, 0.6);
          color: white;

          &.user-active {
            background-color: rgba(0, 128, 0, 1);
          }
        }

        img {
          max-width: 100px;
        }
      }
    }
  }

  .header {
    width: 100%;
    height: auto;
    float: left;
    margin-bottom: 10px;
  }

  .answer {
    width: 100%;
    height: auto;
    float: left;
    color: #333;
    line-height: 30px;
    background-color: rgba(0, 0, 0, 0.06);
    padding-left: 8px;
  }

  .result {
    width: 100%;
    height: auto;
    float: left;
    line-height: 30px;
  }

  .remark {
    width: 100%;
    height: auto;
    float: left;
    font-size: 12px;
    line-height: 18px;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .score {
    width: 100%;
    height: auto;
    float: left;
    margin-top: 10px;
  }
}

.green {
  color: green;
}
.red {
  color: red;
}

p {
  margin-top: 0;
  margin-bottom: 0;
}

.operator {
  width: 100%;
  height: auto;
  float: left;
  margin-top: 15px;
  text-align: right;
}
</style>
<template>
  <div class="h-panel w-1200">
    <div class="h-panel-bar">
      <span class="h-panel-title">详情</span>
      <div class="h-panel-right">
        <p-button
          v-if="userPaper.status === 3"
          glass="h-btn h-btn-primary"
          permission="addons.Paper.paper.userPaper.submit"
          text="提交阅卷结果"
          @click="submitPaper()"
        ></p-button>
        <Button @click="$emit('close')" :text="true">取消</Button>
      </div>
    </div>
    <div class="h-panel-body">
      <div class="float-box mb-10">
        <h2>
          {{ userPaper.status_text }}
          <span v-if="userPaper.status === 2">- {{ userPaper.score }}分</span>
        </h2>
      </div>
      <div class="float-box mb-10">
        <div class="question-item" v-for="item in list" :key="item.id">
          <div class="content">
            <div class="header" v-if="item.header" v-html="item.header"></div>

            <div class="mb-10" v-html="item.content"></div>

            <div class="answer">
              <p>回答：{{ item.answer }}</p>
              <template v-if="item.thumbs.length > 0">
                <img v-for="(img, index) in item.thumbs" :key="index" :src="img" width="70" height="70" @click="imagePreview(index, item.thumbs)" />
              </template>
            </div>

            <div class="score">
              <p>请打分：</p>
              <Select v-model="item.score" :datas="scoreList(item.score)" keyName="id" titleName="text"></Select>
            </div>
          </div>
        </div>
      </div>

      <div class="float-box mt-10"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['paper_id', 'user_paper_id'],
  data() {
    return {
      userPaper: {},
      questions: [],
      optionLength: 10
    };
  },
  computed: {
    list() {
      if (this.questions.length === 0) {
        return [];
      }
      let list = [];
      for (let i = 0; i < this.questions.length; i++) {
        let question = this.questions[i];
        if (question.question.type === 4) {
          // 问答题
          list.push({
            id: question.id,
            score: question.question.score,
            header: null,
            content: question.question.content,
            remark: question.question.remark,
            answer: question.answer_content,
            thumbs: question.thumbs ? JSON.parse(question.thumbs) : []
          });
          continue;
        }
        if (question.question.type === 6) {
          // 题帽题
          let questionContent = JSON.parse(question.question.content);
          let answerContent = question.answer_content ? JSON.parse(question.answer_content) : {};

          for (let j = 0; j < questionContent.questions.length; j++) {
            let childrenQuestion = questionContent.questions[j];
            let childrenAnswer = typeof answerContent[j] === 'undefined' ? null : answerContent[j];
            if (childrenQuestion.type === 4) {
              // 题帽题中含有问答题
              list.push({
                id: question.id + '-cap-' + j,
                score: childrenQuestion.score,
                header: questionContent.header,
                content: childrenQuestion.content,
                remark: question.question.remark,
                answer: childrenAnswer ? childrenAnswer['answer'] : '',
                thumbs: childrenAnswer ? childrenAnswer['thumbs'] : []
              });
              break;
            }
          }

          continue;
        }
      }

      return list;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    scoreList(max) {
      var rows = [];
      for (let i = 0; i <= max; i++) {
        rows.push({
          id: i,
          text: i + '分'
        });
      }
      return rows;
    },
    selectIsActive(val, answer) {
      var answers = answer.split(',');
      return answers.indexOf(val) !== -1;
    },
    userAnswer(item) {
      if (item.question.type === 1) {
        return item.question[item.answer_content];
      } else if (item.question.type === 2) {
        let rows = [];
        item.answer_content.split(',').forEach(i => {
          rows.push(item.question[i]);
        });
        return rows.join(',');
      } else if (item.question.type === 5) {
        return parseInt(item.answer_content) === 1 ? '正确' : '错误';
      } else {
        return item.answer_content;
      }
    },
    init() {
      R.Extentions.paper.Paper.UserPaperInfo({
        id: this.paper_id,
        user_paper_id: this.user_paper_id
      }).then(res => {
        this.userPaper = res.data.userPaper;
        this.questions = res.data.questions;
      });
    },
    submitPaper() {
      var data = {};
      for (let i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        data[item.id] = {
          score: item.score
        };
      }

      R.Extentions.paper.Paper.SubmitScore({
        id: this.paper_id,
        user_paper_id: this.user_paper_id,
        data: data
      }).then(res => {
        HeyUI.$Message.success('评卷成功，' + res.data.nickname + '得分：' + res.data.total_score + '分');
        this.$emit('success');
      });
    },
    imagePreview(index, items) {
      this.$ImagePreview(items, index);
    }
  }
};
</script>
