<template>
  <div class="yk-date-picker" @click="captureCapture($event)">
    <div class="date-picker-header">
      <div class="header-input" :class="headerClass">
        <input
          v-model="titleText"
          type="text"
          :placeholder="props.placeholder"
          readonly
          @focusin.capture="inputClick()"
        />
      </div>
    </div>
    <div
      :class="hideFlag"
      class="date-picker-dropdown-container"
      @click="captureCapture($event)"
    >
      <div class="dropdown-nav">
        <h1 style="cursor: pointer" @click="changeMonth(-1)">&lt;</h1>
        <h1 style="font-size: large">{{ titleText }}</h1>
        <h1 style="cursor: pointer" @click="changeMonth(1)">></h1>
      </div>
      <div class="dropdown-panel">
        <div
          v-for="i in time.head"
          class="dropdown-item dropdown-head"
          style="cursor: text"
        >
          {{ i }}
        </div>
        <div
          v-for="i in time.body"
          class="dropdown-item dropdown-item-date"
          :class="[
            i.locale == today.locale && 'today-item',
            i.locale == titleText && 'selected-item',
            i.month != time.d.month && 'other-month',
          ]"
          @click="itemClick(i)"
        >
          {{ i.date }}
        </div>
        <div
          class="dropdown-today-button"
          :class="time.d.month == today.month && 'hidden'"
        >
          <YkButton @click="changeToday">今日</YkButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DatePickerProps } from './date-picker'
// import { createCssScope } from '../../../utils/bem'
import '../style'
import { reactive, ref } from 'vue'
import { getCalender } from './get-date'
import YkButton from '../../button'

// const bem = createCssScope('date-picker')
const time = ref(getCalender())
const today = time.value.d
const titleText = ref()
const hideFlag = reactive(['hidden'])
const headerClass = reactive([''])
const inputClick = function () {
  headerClass.push('focus')
  hideFlag.length = 0
  window.addEventListener(
    'click',
    function () {
      hideFlag.push('hidden')
      headerClass.length = 0
    },
    { once: true },
  )
}

const itemClick = function (i) {
  titleText.value = i.year + '/' + i.month + '/' + i.date
  if (i.month != time.value.d.month) {
    time.value = getCalender(new Date(i.year, i.month - 1, i.date))
  }
  hideFlag.push('hidden')
}

const changeMonth = function (mm) {
  time.value = getCalender(
    new Date(time.value.d.year, time.value.d.month - 1 + mm),
  )
  titleText.value = time.value.d.locale
}

const changeToday = function () {
  time.value = getCalender(new Date(today.year, today.month - 1, today.date))
  titleText.value = time.value.d.locale
}

const captureCapture = function (e) {
  e.stopPropagation()
}

defineOptions({
  name: 'YkDatePicker',
})
const props = withDefaults(defineProps<DatePickerProps>(), {
  onChange: () => undefined,
  placeholder: '请输入日期',
})
</script>
