<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-3">
      <div>
        <router-link
          :to="{
            path: `/record/calendar/${prevMonthStr.year}/${prevMonthStr.month}`
          }"
        >
          <v-btn>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </router-link>
        <router-link
          :to="{
            path: `/record/calendar/${nextMonthStr.year}/${nextMonthStr.month}`
          }"
        >
          <v-btn>
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </router-link>
        <span class="ml-3">{{ year }} / {{ month }}</span>
      </div>

      <router-link :to="{ path: '/record' }">
        <v-btn>
          <v-icon>mdi-format-list-bulleted-type</v-icon>
        </v-btn>
      </router-link>
    </div>

    <div class="calendar">
      <div
        v-for="day in calendar"
        :key="day.date"
        :class="{ 'day-had-record': day.record }"
        class="day"
      >
        <router-link
          v-if="day.record"
          :to="{ path: `/record/${day.record.pk}` }"
          class="record-link record-wrap"
        >
          <span class="record-title">{{ day.record.title }}</span>
          <v-icon class="status"> {{ getIcon(day.record.status) }} </v-icon>
          <span class="date">{{ day.date }}</span>
        </router-link>

        <div v-else class="record-wrap">
          <span class="date">{{ day.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment/moment'

import { getStateIcon } from '~/utils/utils.js'

export default {
  async asyncData({ $axios, route }) {
    const year = Number(route.params.year)
    const month = Number(route.params.month)

    const startMonth = moment({ year, month: month - 1 }).startOf('month')
    const endMonth = moment({ year, month: month - 1 }).endOf('month')

    let res = null
    try {
      res = await $axios.get(
        '/api/v1/record/?ordering=-date' +
          '&date_after=' +
          startMonth.format('YYYY-MM-DD') +
          '&date_before=' +
          endMonth.format('YYYY-MM-DD')
      )
    } catch (err) {
      return { errorMessage: err }
    }
    const records = res.data

    const startCalendar = moment({
      year,
      month: month - 1,
      day: 1
    }).startOf('week')

    const endCalendar = moment({
      year,
      month: month - 1,
      day: 1
    })
      .endOf('month')
      .endOf('week')

    const calendar = []
    const current = moment(startCalendar)
    while (current.isSameOrBefore(endCalendar)) {
      const currentStr = current.format('YYYY-MM-DD')

      if (
        records.length > 0 &&
        records[records.length - 1].date === currentStr
      ) {
        calendar.push({
          date: currentStr,
          record: records.pop()
        })
      } else {
        calendar.push({
          date: currentStr,
          record: null
        })
      }
      current.add(1, 'days')
    }

    return { calendar }
  },
  data() {
    return {
      calendar: [],
      errorMessage: null
    }
  },
  computed: {
    year() {
      return this.$route.params.year
    },
    month() {
      return this.$route.params.month
    },
    prevMonthStr() {
      const prev = moment({ year: this.year, month: this.month - 1 }).subtract(
        '1',
        'month'
      )
      return {
        year: String(prev.year()),
        month: String(prev.month() + 1).padStart(2, '0')
      }
    },
    nextMonthStr() {
      const next = moment({ year: this.year, month: this.month - 1 }).add(
        '1',
        'month'
      )
      return {
        year: String(next.year()),
        month: String(next.month() + 1).padStart(2, '0')
      }
    }
  },
  methods: {
    getIcon(state) {
      return getStateIcon(state)
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar {
  display: grid;
  grid: auto-flow 100px / repeat(7, 1fr);
  grid-gap: 0.5rem;
}

.day {
  background-color: #ffffff17;
  &.day-had-record {
    background-color: #ffffff25;
  }
}

.record-wrap {
  width: 100%;
  height: 100%;
  padding: 0.5rem;

  display: grid;
  grid-template-columns: 20% 80%;
  grid-template-rows: 80% 20%;
  grid-gap: 0.2rem;
  grid-template-areas:
    'title title'
    'status date';

  @include lessThan($medium) {
    grid-template-rows: 70% 30%;
  }

  .date {
    text-align: end;
    grid-area: date;
    font-size: 0.8rem;

    @include lessThan($medium) {
      font-size: 0.5rem;
    }
  }

  .status {
    grid-area: status;

    @include lessThan($medium) {
      font-size: 1rem;
    }
  }

  .record-title {
    grid-area: title;
    overflow: hidden;
    font-size: 0.9rem;
    @include lessThan($medium) {
      font-size: 0.6rem;
    }
  }
}
</style>
